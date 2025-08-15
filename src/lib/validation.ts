import { z } from "zod";

const nameRegex = /^[A-Za-z\s'-]+$/;

function isTodayOrLater(dateStr: string) {
  const input = new Date(dateStr);
  const today = new Date();
  const atMidnight = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return atMidnight(input) >= atMidnight(today);
}

export const onboardingSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(80, "Full name must be at most 80 characters")
    .regex(nameRegex, "Only letters, spaces, ' and - allowed"),

  email: z.string().email("Invalid email address"),

  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be at most 100 characters"),

  services: z
    .array(z.enum(["UI/UX", "Branding", "Web Dev", "Mobile App"]))
    .min(1, "Please select at least one service"),

  // We'll normalize the input in RHF (see setValueAs below).
  budgetUsd: z
    .number()
    .int("Must be an integer")
    .gte(100, "Minimum budget is 100")
    .lte(1_000_000, "Maximum budget is 1,000,000")
    .optional(),

  projectStartDate: z
    .string()
    .refine((v) => isTodayOrLater(v), { message: "Date must be today or later" }),

  // Use boolean + refine so default `false` is allowed by TypeScript, but validation still forces it to be checked.
  acceptTerms: z
    .boolean()
    .refine((v) => v === true, { message: "You must accept the terms" }),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;
