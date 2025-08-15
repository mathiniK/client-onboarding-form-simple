import { InputHTMLAttributes, forwardRef } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
  id: string;
};

const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { id, label, error, hint, className, ...rest },
  ref
) {
  const base =
    "block w-full rounded-lg border bg-white px-3.5 py-2.5 text-[15px] shadow-sm outline-none transition";
  const ok = "border-neutral-300 focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500";
  const bad = "border-red-500 focus:ring-2 focus:ring-red-500/60 focus:border-red-500";

  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="label">
        {label}
      </label>

      <input
        id={id}
        ref={ref}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={`${base} ${error ? bad : ok} ${className ?? ""}`}
        {...rest}
      />

      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-neutral-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="error">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
