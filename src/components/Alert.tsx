import { ReactNode } from "react";

export function Alert({
  kind = "info",
  children,
}: {
  kind?: "info" | "error" | "success";
  children: ReactNode;
}) {
  const styles =
    kind === "error"
      ? "bg-red-50 text-red-900 border-red-200"
      : kind === "success"
      ? "bg-green-50 text-green-900 border-green-200"
      : "bg-blue-50 text-blue-900 border-blue-200";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`mb-4 flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${styles}`}
    >
      <span aria-hidden>ℹ️</span>
      <div>{children}</div>
    </div>
  );
}
