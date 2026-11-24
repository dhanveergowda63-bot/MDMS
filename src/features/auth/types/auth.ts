export interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

export type LoginFormErrors = Partial<Record<"email" | "password", string>>;

export interface ResetPasswordValues {
  password: string;
  confirm: string;
}

export type ResetPasswordErrors = Partial<
  Record<keyof ResetPasswordValues, string>
>;
