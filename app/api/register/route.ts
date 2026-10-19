import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import { sendMail } from "@/lib/mailer";
import { welcomeEmail } from "@/lib/emailTemplates";
import Member from "@/models/Member";
import plateauLocations from "@/data/plateau-locations.json";

const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const firstName = str(body.firstName);
  const lastName = str(body.lastName);
  const email = str(body.email);
  const phone = str(body.phone).replace(/[\s()-]/g, "");
  const vin = str(body.vin).replace(/\s/g, "");
  const nin = str(body.nin);
  const password = typeof body.password === "string" ? body.password : "";
  const lgaId = Number(body.lgaId);
  const wardId = Number(body.wardId);
  const pollingUnitId = Number(body.pollingUnitId);

  if (
    !firstName ||
    !lastName ||
    !/^(?:0[789]\d{9}|\+234[789]\d{9})$/.test(phone) ||
    !/^\d{11}$/.test(nin) ||
    (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ||
    (vin && !/^\d{19,20}$/.test(vin)) ||
    password.length < 8 ||
    body.consent !== true
  ) {
    return Response.json({ error: "Please check your details." }, { status: 400 });
  }

  const lga = plateauLocations.lgas.find((item) => item.id === lgaId);
  const ward = lga?.wards.find((item) => item.id === wardId);
  const unit = ward?.pollingUnits.find((item) => item.id === pollingUnitId);
  if (!lga || !ward || !unit) {
    return Response.json({ error: "Invalid location selected." }, { status: 400 });
  }

  // Normalise to the 0xxxxxxxxxx form so +234 and 0 variants collide
  const normalizedPhone = phone.startsWith("+234") ? `0${phone.slice(4)}` : phone;

  try {
    await connectToDatabase();
    await Member.create({
      firstName,
      lastName,
      email: email || undefined,
      phone: normalizedPhone,
      vin: vin || undefined,
      nin,
      gender: str(body.gender) || "Prefer not to say",
      lgaId,
      lgaName: lga.name,
      wardId,
      wardName: ward.name,
      pollingUnitId,
      pollingUnitName: unit.name,
      passwordHash: await bcrypt.hash(password, 12),
      referralCode: str(body.referralCode) || undefined,
      consent: true,
      volunteer: str(body.volunteer) || "Maybe later",
    });
  } catch (error) {
    if ((error as { code?: number }).code === 11000) {
      return Response.json(
        { error: "An account with this phone number or NIN already exists." },
        { status: 409 },
      );
    }
    console.error("Registration failed", error);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }

  // A mail failure must not fail a registration that is already saved
  if (email) {
    try {
      await sendMail({ to: email, ...welcomeEmail(firstName) });
    } catch (error) {
      console.error("Welcome email failed", error);
    }
  }

  return Response.json({ success: true }, { status: 201 });
}
