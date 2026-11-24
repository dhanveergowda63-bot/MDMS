import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import "./forms.css";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  endAdornment?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, endAdornment, id, className = "", ...rest }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    return (
      <div className="field">
        <label htmlFor={inputId} className="field__label">{label}</label>
        <div className="field__control">
          <input
            ref={ref}
            id={inputId}
            className={`field__input ${error ? "field__input--error" : ""} ${className}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...rest}
          />
          {endAdornment}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="field__error" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export default Input;