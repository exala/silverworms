import fs from "node:fs";
import path from "node:path";
import { randomInt } from "node:crypto";
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

function randomFrom(values) {
  return values[randomInt(values.length)];
}

function randomDigits(length) {
  return Array.from({ length }, () => randomInt(10)).join("");
}

loadEnvFile(".env");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const companyEmail = "rafey.saeed94@gmail.com";
const companyPassword = companyEmail;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function upsertAuthUser(email, password, role) {
  const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();

  if (listError) {
    throw listError;
  }

  const existingUser = existingUsers.users.find((user) => user.email === email);

  if (!existingUser) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        pending_role: role,
      },
    });

    if (error) {
      throw error;
    }

    console.log(`Created ${role.toLowerCase()} user ${email}`);
    return data.user.id;
  }

  const { error } = await supabase.auth.admin.updateUserById(existingUser.id, {
    password,
    user_metadata: {
      pending_role: role,
    },
  });

  if (error) {
    throw error;
  }

  console.log(`Updated existing ${role.toLowerCase()} user ${email}`);
  return existingUser.id;
}

async function seedCompany() {
  const companyId = await upsertAuthUser(companyEmail, companyPassword, "COMPANY");
  const city = randomFrom(["Karachi", "Lahore", "Islamabad", "Faisalabad", "Peshawar"]);
  const companyName = randomFrom([
    "Brightline Media",
    "Urban Reach Advertising",
    "MetroPulse Brands",
    "Signal Peak Marketing",
  ]);
  const contactPerson = randomFrom(["Rafey Saeed", "Rafey Ahmed", "Rafey Khan", "Rafey Malik"]);
  const industry = randomFrom(["Retail", "FMCG", "Telecom", "Automotive", "Food & Beverage"]);

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: companyId,
    email: companyEmail,
    role: "COMPANY",
    full_name: contactPerson,
    phone: `03${randomDigits(9)}`,
    city,
    country: "Pakistan",
    registration_completed: true,
  });

  if (profileError) {
    throw profileError;
  }

  const { error: companyProfileError } = await supabase.from("company_profiles").upsert({
    user_id: companyId,
    company_name: companyName,
    contact_person: contactPerson,
    phone: `03${randomDigits(9)}`,
    website: `https://${companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.example.com`,
    industry,
    address: `${randomInt(1, 250)} ${randomFrom(["Shahrah-e-Faisal", "MM Alam Road", "Blue Area", "University Road"])}, ${city}`,
    country: "Pakistan",
    tax_identifier: `TAX-${randomDigits(8)}`,
    ntn: `${randomDigits(7)}-${randomDigits(1)}`,
    fbr_registration: `FBR-${randomDigits(9)}`,
    marketing_budget: randomInt(250000, 2500001),
    verification_status: "VERIFIED",
  });

  if (companyProfileError) {
    throw companyProfileError;
  }

  console.log("Company profile seeded successfully.");
}

seedCompany().catch((error) => {
  console.error(error);
  process.exit(1);
});
