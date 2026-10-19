import mongoose, { type InferSchemaType, type Model } from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, required: true, unique: true },
    vin: { type: String },
    nin: { type: String, required: true, unique: true },
    gender: { type: String, default: "Prefer not to say" },
    lgaId: { type: Number, required: true },
    lgaName: { type: String, required: true },
    wardId: { type: Number, required: true },
    wardName: { type: String, required: true },
    pollingUnitId: { type: Number, required: true },
    pollingUnitName: { type: String, required: true },
    passwordHash: { type: String, required: true },
    referralCode: { type: String, trim: true },
    consent: { type: Boolean, required: true },
    volunteer: { type: String, default: "Maybe later" },
  },
  { timestamps: true },
);

export type MemberDoc = InferSchemaType<typeof memberSchema>;

const Member: Model<MemberDoc> =
  (mongoose.models.Member as Model<MemberDoc>) ??
  mongoose.model<MemberDoc>("Member", memberSchema);

export default Member;
