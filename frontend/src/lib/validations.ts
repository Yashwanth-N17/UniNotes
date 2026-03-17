import { z } from "zod";


export const sanitize = (val: string) => val.replace(/<[^>]*>/g, "").trim();

// Reusable field schemas
const nameField = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(100, "Name must be under 100 characters")
  .transform(sanitize);

const emailField = z
  .string()
  .trim()
  .email("Invalid email address")
  .max(255, "Email must be under 255 characters");

const passwordField = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be under 128 characters")
  .regex(/[A-Z]/, "Must include an uppercase letter")
  .regex(/[a-z]/, "Must include a lowercase letter")
  .regex(/[0-9]/, "Must include a number")
  .regex(/[^A-Za-z0-9]/, "Must include a special character");

const urlField = z
  .string()
  .trim()
  .max(500, "URL must be under 500 characters")
  .refine((val) => val === "" || /^https?:\/\/.+/.test(val), "Must be a valid URL starting with http:// or https://")
  .optional()
  .or(z.literal(""));

// ─── Login ──────────────────────────────────────
export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Password is required").max(128),
});
export type LoginFormData = z.infer<typeof loginSchema>;

// ─── Signup ─────────────────────────────────────
export const signupSchema = z.object({
  fullname: nameField,
  email: emailField,
  password: passwordField,
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
export type SignupFormData = z.infer<typeof signupSchema>;

// ─── Signup Step 2 (Profile Setup) ──────────────
export const signupStep2Schema = z.object({
  username: z.string().trim().min(3, "Username must be at least 3 characters").max(50, "Username is too long"),
  university: z
    .string()
    .trim()
    .min(1, "University is required")
    .max(200, "University must be under 200 characters"),
  branch: z.string().min(1, "Branch/Department is required"),
  year: z.string().min(1, "Year is required"),
});
export type SignupStep2Data = z.infer<typeof signupStep2Schema>;

// ─── Contact ────────────────────────────────────
export const contactSchema = z.object({
  name: nameField,
  email: emailField,
  subject: z
    .string()
    .trim()
    .min(1, "Subject is required")
    .max(200, "Subject must be under 200 characters")
    .transform(sanitize),
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(2000, "Message must be under 2000 characters")
    .transform(sanitize),
});
export type ContactFormData = z.infer<typeof contactSchema>;

// ─── Upload Resource ────────────────────────────
export const uploadSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be under 200 characters")
    .transform(sanitize),
  department: z.string().min(1, "Department is required"),
  semester: z.string().min(1, "Semester is required"),
  subject: z
    .string()
    .trim()
    .min(1, "Subject is required")
    .max(200, "Subject must be under 200 characters")
    .transform(sanitize),
  resourceType: z.string().min(1, "Resource type is required"),
  tags: z
    .string()
    .trim()
    .max(300, "Tags must be under 300 characters")
    .transform(sanitize)
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .trim()
    .max(1000, "Description must be under 1000 characters")
    .transform(sanitize)
    .optional()
    .or(z.literal("")),
});
export type UploadFormData = z.infer<typeof uploadSchema>;

// ─── Edit Profile ───────────────────────────────
export const editProfileSchema = z.object({
  name: nameField,
  email: emailField,
  bio: z
    .string()
    .trim()
    .max(500, "Bio must be under 500 characters")
    .transform(sanitize)
    .optional()
    .or(z.literal("")),
  university: z
    .string()
    .trim()
    .max(200, "University must be under 200 characters")
    .transform(sanitize)
    .optional()
    .or(z.literal("")),
  username: z.string().trim().min(3, "Username must be at least 3 characters").max(50, "Username is too long"),
  branch: z.string().optional(),
  year: z.string().optional(),
  linkedin: urlField,
  github: urlField,
});
export type EditProfileFormData = z.infer<typeof editProfileSchema>;

// ─── File validation ────────────────────────────
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const MAX_FILE_COUNT = 10;
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/jpeg",
  "image/png",
];
const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx", ".ppt", ".pptx", ".jpg", ".jpeg", ".png"];

export interface FileValidationError {
  fileName: string;
  reason: string;
}

export const validateFiles = (
  newFiles: File[],
  existingCount: number
): { valid: File[]; errors: FileValidationError[] } => {
  const errors: FileValidationError[] = [];
  const valid: File[] = [];

  if (existingCount + newFiles.length > MAX_FILE_COUNT) {
    return {
      valid: [],
      errors: [{ fileName: "", reason: `Maximum ${MAX_FILE_COUNT} files allowed` }],
    };
  }

  for (const file of newFiles) {
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext) && !ALLOWED_TYPES.includes(file.type)) {
      errors.push({ fileName: file.name, reason: "File type not allowed" });
    } else if (file.size > MAX_FILE_SIZE) {
      errors.push({ fileName: file.name, reason: "File exceeds 25MB limit" });
    } else {
      valid.push(file);
    }
  }

  return { valid, errors };
};
