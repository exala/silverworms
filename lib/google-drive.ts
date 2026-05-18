import { Readable } from "node:stream";
import { google } from "googleapis";

const GOOGLE_DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.file";

type GoogleDriveUploadResult = {
  id: string;
  url: string;
};

type UploadCreativeOptions = {
  companyName?: string | null;
  existingFileId?: string | null;
};

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  return value;
}

function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

function getRedirectUri() {
  return `${getSiteUrl()}/api/google-drive/callback`;
}

function sanitizeFileName(fileName: string) {
  const safeName = fileName
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "-")
    .replace(/\s+/g, " ")
    .trim();

  return safeName || `creative-${Date.now()}`;
}

function escapeDriveQueryValue(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function getOAuthClient() {
  const client = new google.auth.OAuth2(
    getRequiredEnv("GOOGLE_OAUTH_CLIENT_ID"),
    getRequiredEnv("GOOGLE_OAUTH_CLIENT_SECRET"),
    getRedirectUri(),
  );

  return client;
}

export function getGoogleDriveAuthorizeUrl() {
  const client = getOAuthClient();

  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [GOOGLE_DRIVE_SCOPE],
  });
}

export async function exchangeGoogleDriveCode(code: string) {
  const client = getOAuthClient();
  const { tokens } = await client.getToken(code);

  if (!tokens.refresh_token) {
    throw new Error(
      "Google did not return a refresh token. Revoke this app from your Google account, then connect again.",
    );
  }

  return tokens;
}

function getDriveClient() {
  const auth = getOAuthClient();

  auth.setCredentials({
    refresh_token: getRequiredEnv("GOOGLE_OAUTH_REFRESH_TOKEN"),
  });

  return google.drive({ version: "v3", auth });
}

async function getOrCreateCompanyFolder(drive: ReturnType<typeof getDriveClient>, companyName?: string | null) {
  const parentFolderId = getRequiredEnv("GOOGLE_DRIVE_FOLDER_ID");
  const folderName = sanitizeFileName(companyName || "Unassigned Company");
  const escapedFolderName = escapeDriveQueryValue(folderName);
  const escapedParentFolderId = escapeDriveQueryValue(parentFolderId);
  const existing = await drive.files.list({
    q: [
      `name = '${escapedFolderName}'`,
      "mimeType = 'application/vnd.google-apps.folder'",
      `'${escapedParentFolderId}' in parents`,
      "trashed = false",
    ].join(" and "),
    fields: "files(id, name)",
    pageSize: 1,
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });
  const existingFolderId = existing.data.files?.[0]?.id;

  if (existingFolderId) {
    return existingFolderId;
  }

  const created = await drive.files.create({
    requestBody: {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentFolderId],
    },
    fields: "id",
    supportsAllDrives: true,
  });
  const createdFolderId = created.data.id;

  if (!createdFolderId) {
    throw new Error("Google Drive did not return a company folder ID.");
  }

  return createdFolderId;
}

async function makeFilePublic(drive: ReturnType<typeof getDriveClient>, fileId: string) {
  await drive.permissions.create({
    fileId,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
    supportsAllDrives: true,
  });
}

export async function uploadCreativeToGoogleDrive(
  file: File,
  options: UploadCreativeOptions = {},
): Promise<GoogleDriveUploadResult> {
  const drive = getDriveClient();
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileName = `${Date.now()}-${sanitizeFileName(file.name)}`;

  if (options.existingFileId) {
    const response = await drive.files.update({
      fileId: options.existingFileId,
      requestBody: {
        name: fileName,
      },
      media: {
        mimeType: file.type || "application/octet-stream",
        body: Readable.from(buffer),
      },
      fields: "id, webViewLink",
      supportsAllDrives: true,
    });
    const fileId = response.data.id;

    if (!fileId) {
      throw new Error("Google Drive did not return a file ID after replacing the creative.");
    }

    return {
      id: fileId,
      url: response.data.webViewLink || `https://drive.google.com/file/d/${fileId}/view`,
    };
  }

  const companyFolderId = await getOrCreateCompanyFolder(drive, options.companyName);

  const response = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [companyFolderId],
    },
    media: {
      mimeType: file.type || "application/octet-stream",
      body: Readable.from(buffer),
    },
    fields: "id, webViewLink",
    supportsAllDrives: true,
  });
  const fileId = response.data.id;

  if (!fileId) {
    throw new Error("Google Drive did not return a file ID.");
  }

  await makeFilePublic(drive, fileId);

  return {
    id: fileId,
    url: response.data.webViewLink || `https://drive.google.com/file/d/${fileId}/view`,
  };
}
