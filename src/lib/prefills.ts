import { Service } from "@/components/CheckboxGroup";

export function parseServicePrefills(params: URLSearchParams): Service[] {
  // Supports both ?service=UI%2FUX and repeated ?services=Web%20Dev&services=Branding
  const single = params.get("service");
  const multi = params.getAll("services");
  const raw = [single, ...multi].filter(Boolean) as string[];
  const allowed: Service[] = ["UI/UX", "Branding", "Web Dev", "Mobile App"];
  const clean = raw.filter((r) => allowed.includes(r as Service)) as Service[];
  // Deduplicate
  return Array.from(new Set(clean));
}