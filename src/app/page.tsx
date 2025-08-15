import Form from "@/components/Form";

export default function Page() {
  return (
    <main className="min-h-dvh bg-neutral-50 p-4 md:p-8">
      <div className="mx-auto max-w-2xl rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-2xl font-semibold tracking-tight">CLIENT ONBOARDING</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Fill in the details below. All fields validate on blur.
        </p>

        <div className="mt-6">
          <Form />
        </div>
      </div>
    </main>
  );
}
