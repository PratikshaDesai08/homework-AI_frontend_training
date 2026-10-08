import type { ReactNode } from "react";

interface FormFieldProps {
  /** id of the input inside, for the <label> */
  htmlFor: string;
  label: string;
  required?: boolean;
  /** Help text under the input (replaced by the error when there is one) */
  help?: string;
  error?: string;
  /** The input itself */
  children: ReactNode;
}

// Label + input + help/error text. The input should set aria-describedby={`${htmlFor}-note`}.
export default function FormField({ htmlFor, label, required = false, help, error, children }: FormFieldProps) {
  return (
    <div className={error ? "form-field form-field-invalid" : "form-field"}>
      <label htmlFor={htmlFor} className="form-field-label">
        {label}{" "}
        {required ? (
          <span className="form-field-required" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="form-field-optional">(optional)</span>
        )}
      </label>
      {children}
      {(error || help) && (
        <p id={`${htmlFor}-note`} className={error ? "form-field-error" : "form-field-help"} role={error ? "alert" : undefined}>
          {error ?? help}
        </p>
      )}
    </div>
  );
}
