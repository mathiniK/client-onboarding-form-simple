# Client Onboarding Form

A Next.js client onboarding form with React Hook Form validation and Zod schema validation. Submits to external API endpoint.

## Requirements

- Node.js 18+
- npm

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Environment variables:**
Create `.env.local` in the project root, Replace with proper API URL if needed:
```env
NEXT_PUBLIC_ONBOARD_URL=https://example.com/api/onboard
```

3. **Tailwind CSS v4 configuration:**

**postcss.config.mjs:**
```js
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: { '@tailwindcss/postcss': {} },
};
export default config;
```

**src/app/globals.css:**
```css
@import "tailwindcss";

html, body { 
  background-color: #fff; 
  color: #111; 
}
```

**src/app/layout.tsx:**
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

4. **Run the application:**
```bash
npm run dev
# Open http://localhost:3000
```

## Form Fields & Validation

- **Full Name:** Required, 2-80 characters, letters/spaces only
- **Email:** Required, valid email format
- **Company Name:** Required, 2-100 characters
- **Services:** Required, multi-select from UI/UX, Branding, Web Dev, Mobile App
- **Budget(USD):** Optional; integer between 100–1,000,000
- **Project Start Date:** Required, today or later
- **Terms:** Required checkbox
  
- Zod validates, zodResolver plugs it into React Hook Form, you read error messages from formState.errors, and you normalize the optional number with setValueAs

## Features

- Client-side validation with Zod schema
- Inline error messages
- Multi-select checkboxes for services
- Query parameter prefilling (`?services=Web%20Dev&services=Branding`)
- Accessible form design
- Submit to external API endpoint

## Scripts

```bash
npm run dev     # Development server
npm run build   # Production build
npm start       # Production server
npm run lint    # Lint code
npm run test    # To run tests
```
