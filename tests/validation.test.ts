import { describe, it, expect } from "vitest";
import { onboardingSchema } from "../src/lib/validation";

// Helper: YYYY-MM-DD for "today" (local time)
function todayStr(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function base() {
  return {
    fullName: "Ada Lovelace",
    email: "ada@example.com",
    companyName: "Analytical Engines Ltd",
    services: ["UI/UX"],
    projectStartDate: todayStr(),
    acceptTerms: true,
  };
}

describe("onboardingSchema", () => {
  it("accepts a valid payload (with budget)", () => {
    const payload = { ...base(), budgetUsd: 50000 };
    const parsed = onboardingSchema.parse(payload);
    expect(parsed.fullName).toBe("Ada Lovelace");
    expect(parsed.budgetUsd).toBe(50000);
  });

  it("accepts a valid payload (without budget)", () => {
    const res = onboardingSchema.safeParse(base());
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.budgetUsd).toBeUndefined();
    }
  });

  it("rejects invalid name characters", () => {
    const bad = { ...base(), fullName: "Ada_123" };
    const res = onboardingSchema.safeParse(bad);
    expect(res.success).toBe(false);
  });

  it("requires at least one service", () => {
    const bad = { ...base(), services: [] as string[] };
    const res = onboardingSchema.safeParse(bad);
    expect(res.success).toBe(false);
  });

  it("enforces budget range (100–1,000,000) and integer", () => {
    const low = onboardingSchema.safeParse({ ...base(), budgetUsd: 50 });
    const high = onboardingSchema.safeParse({ ...base(), budgetUsd: 2_000_000 });
    const float = onboardingSchema.safeParse({ ...base(), budgetUsd: 100.5 });
    expect(low.success).toBe(false);
    expect(high.success).toBe(false);
    expect(float.success).toBe(false);
  });

  it("requires acceptTerms to be true", () => {
    const bad = { ...base(), acceptTerms: false as boolean };
    const res = onboardingSchema.safeParse(bad);
    expect(res.success).toBe(false);
  });

  it("rejects past start dates", () => {
    const past = new Date();
    past.setDate(past.getDate() - 1);
    const mm = String(past.getMonth() + 1).padStart(2, "0");
    const dd = String(past.getDate()).padStart(2, "0");
    const bad = { ...base(), projectStartDate: `${past.getFullYear()}-${mm}-${dd}` };
    const res = onboardingSchema.safeParse(bad);
    expect(res.success).toBe(false);
  });

  it("accepts today as a valid start date", () => {
    const ok = { ...base(), projectStartDate: todayStr() };
    const res = onboardingSchema.safeParse(ok);
    expect(res.success).toBe(true);
  });
});
