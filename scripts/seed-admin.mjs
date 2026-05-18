import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnvFile(fileName) {
  const filePath = path.resolve(process.cwd(), fileName);

  if (!fs.existsSync(filePath)) {
    return;
  }

  const contents = fs.readFileSync(filePath, "utf8");

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line
      .slice(separatorIndex + 1)
      .trim()
      .replace(/^"(.*)"$/, "$1")
      .replace(/^'(.*)'$/, "$1");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(".env");
// loadEnvFile(".env.local");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const adminEmail = "admin@silverworms.com";
const adminPassword = "admin123";

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function seedAdmin() {
  const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();

  if (listError) {
    throw listError;
  }

  const existingAdmin = existingUsers.users.find((user) => user.email === adminEmail);
  let adminId = existingAdmin?.id;

  if (!existingAdmin) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        pending_role: "ADMIN",
      },
    });

    if (error) {
      throw error;
    }

    adminId = data.user.id;
    console.log(`Created admin user ${adminEmail}`);
  } else {
    const { error } = await supabase.auth.admin.updateUserById(existingAdmin.id, {
      password: adminPassword,
      user_metadata: {
        pending_role: "ADMIN",
      },
    });

    if (error) {
      throw error;
    }

    console.log(`Updated existing admin user ${adminEmail}`);
  }

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: adminId,
    email: adminEmail,
    role: "ADMIN",
    full_name: "Platform Administrator",
    registration_completed: true,
  });

  if (profileError) {
    throw profileError;
  }

  console.log("Admin profile seeded successfully.");
}

seedAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});
