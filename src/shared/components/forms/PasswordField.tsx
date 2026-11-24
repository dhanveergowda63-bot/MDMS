import { forwardRef, useState } from "react";
import Input from "./Input";
import type { InputProps } from "./Input";

type PasswordFieldProps = Omit<InputProps, "type" | "endAdornment">;

const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  (props, ref) => {
    const [visible, setVisible] = useState(false);
    return (
      <Input
        {...props}
        ref={ref}
        type={visible ? "text" : "password"}
        endAdornment={
          <button
            type="button"
            className="field__adornment"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? "Hide" : "Show"}
          </button>
        }
      />
    );
  },
);
PasswordField.displayName = "PasswordField";

export default PasswordField;
