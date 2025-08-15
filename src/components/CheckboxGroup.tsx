import { Fragment } from "react";

const ALL = ["UI/UX", "Branding", "Web Dev", "Mobile App"] as const;
export type Service = (typeof ALL)[number];

export function CheckboxGroup({
  id,
  legend,
  values,
  onChange,
  error,
}: {
  id: string;
  legend: string;
  values: Service[];
  onChange: (next: Service[]) => void;
  error?: string;
}) {
  function toggle(v: Service) {
    const set = new Set(values);
    if (set.has(v)) set.delete(v);
    else set.add(v);
    onChange(Array.from(set));
  }

  return (
    <fieldset className="space-y-1.5">
      <legend className="label mb-1">{legend}</legend>

      <div
        className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4"
        aria-describedby={error ? `${id}-error` : undefined}
      >
        {ALL.map((opt) => {
          const uid = `${id}-${opt.replace(/\s+/g, "-").toLowerCase()}`;
          const checked = values.includes(opt);
          return (
            <Fragment key={opt}>
              <div className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2">
                <input
                  id={uid}
                  type="checkbox"
                  className="checkbox accent-blue-600"
                  checked={checked}
                  onChange={() => toggle(opt)}
                />
                <label htmlFor={uid} className="text-sm">
                  {opt}
                </label>
              </div>
            </Fragment>
          );
        })}
      </div>

      {error && (
        <p id={`${id}-error`} className="error">
          {error}
        </p>
      )}
    </fieldset>
  );
}
