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

const driverEmail = "hasan.ag93@gmail.com";
const driverPassword = driverEmail;

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

async function seedDriver() {
  const driverId = await upsertAuthUser(driverEmail, driverPassword, "DRIVER");
  const city = randomFrom(["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Multan"]);
  const carMake = randomFrom(["Toyota", "Honda", "Suzuki", "Kia", "Hyundai"]);
  const carModel = randomFrom(["Corolla", "Civic", "Alto", "Sportage", "Elantra"]);
  const fullName = randomFrom(["Hasan Ahmed", "Hasan Ali", "Hasan Raza", "Hasan Malik"]);

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: driverId,
    email: driverEmail,
    role: "DRIVER",
    full_name: fullName,
    phone: `03${randomDigits(9)}`,
    city,
    country: "Pakistan",
    registration_completed: true,
  });

  if (profileError) {
    throw profileError;
  }

  const { error: driverProfileError } = await supabase.from("driver_profiles").upsert({
    user_id: driverId,
    cnic: `${randomDigits(5)}-${randomDigits(7)}-${randomDigits(1)}`,
    license_number: `LIC-${randomDigits(7)}`,
    ride_hailing_platform: randomFrom(["Uber", "Careem", "InDrive", "Yango"]),
    car_make: carMake,
    car_model: carModel,
    car_year: randomInt(2018, 2026),
    plate_number: `${randomFrom(["ABC", "BAV", "LEA", "ICT"])}-${randomDigits(4)}`,
    led_screen_serial: `SW-LED-${randomDigits(5)}`,
    city,
    status: "ACTIVE",
  });

  if (driverProfileError) {
    throw driverProfileError;
  }

  console.log("Driver profile seeded successfully.");
}

seedDriver().catch((error) => {
  console.error(error);
  process.exit(1);
});
