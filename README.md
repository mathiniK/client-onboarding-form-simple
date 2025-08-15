# Client Onboarding – Next.js + React Hook Form + Zod

A small client onboarding form built with **Next.js App Router**, **React Hook Form**, and **Zod**.  
Validates inputs on the client and POSTs JSON to an **external** endpoint (no local API routes).

---

## 1) Requirements

- Node.js **18+**
- npm (bundled with Node)

---

## 2) Setup

### A) Install dependencies
```bash
npm i
```

### B) Environment variable
Create `.env.local` at the project root:
```env
NEXT_PUBLIC_ONBOARD_URL=https://example.com/api/onboard
```

### C) Tailwind CSS v4 wiring

**postcss.config.mjs**
```js
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: { '@tailwindcss/postcss': {} },
};
export default config;
```

**src/app/globals.css**
```css
@import "tailwindcss";

/* Light background */
html, body { 
  background-color: #fff; 
  color: #111; 
}
```

**src/app/layout.tsx**
```tsx
import "./globals.css";

export const metadata = { 
  title: "Client Onboarding", 
  description: "Form" 
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### D) Run locally
```bash
npm run dev
# Open http://localhost:3000
```

### E) Build & start (production)
```bash
npm run build
npm start
```

---

## 3) Fields & Validation (Zod + RHF)

| Field | Type | Rules |
|-------|------|-------|
| `fullName` | `string` | required; 2–80 chars; letters/spaces/'/- only |
| `email` | `string` | required; valid email |
| `companyName` | `string` | required; 2–100 chars |
| `services` | `string[]` | required; ≥1 from: UI/UX, Branding, Web Dev, Mobile App |
| `budgetUsd` | `number?` | optional; integer 100–1,000,000 |
| `projectStartDate` | `date str` | required; today or later |
| `acceptTerms` | `boolean` | required; must be checked |

**Zod schema:** `src/lib/validation.ts`

**RHF:**
```ts
useForm({ 
  resolver: zodResolver(onboardingSchema), 
  mode: "onTouched" 
})
```

**Budget normalization:**
```ts
register("budgetUsd", { 
  setValueAs: v => (v === "" ? undefined : Number(v)) 
})
```

**Inline errors** via `formState.errors.<field>.message`

---

## 4) Submit Behavior

- **Endpoint:** `process.env.NEXT_PUBLIC_ONBOARD_URL`
- **Method:** POST
- **Headers:** `Content-Type: application/json`
- **Body:** validated form data (no files)
- **On success:** show success message with submitted summary
- **On error:** show top-level error message

**Example request body:**
```json
{
  "fullName": "Ada Lovelace",
  "email": "ada@example.com",
  "companyName": "Analytical Engines Ltd",
  "services": ["UI/UX", "Web Dev"],
  "budgetUsd": 50000,
  "projectStartDate": "2025-09-01",
  "acceptTerms": true
}
```

---

## 5) UX & Accessibility

- Labels tied to inputs; visible focus states; keyboard navigable
- Services displayed as multi-select checkboxes
- Submit disabled while submitting; form values persist on validation errors
- Inline error text under each input
- Native date input

---

## 6) Bonus (Prefill Services from Query Params)

**Examples:**
- `?service=UI%2FUX`
- `?services=Web%20Dev&services=Branding`

**Logic in:** `src/lib/prefills.ts`

---

## 7) Scripts

```bash
npm run dev     # start dev server
npm run build   # production build
npm start       # start production server
npm run lint    # lint
npm run test    # run tests (if present)
```

---

## 8) Troubleshooting

- **VS Code warning:** "Unknown at rule @tailwind / @apply" → install Tailwind CSS IntelliSense or set `"css.lint.unknownAtRules": "ignore"` in settings.
- **Hydration mismatch:** Browser extensions may inject attributes before React hydration → test in a private window or disable extensions during development.
