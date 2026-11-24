export interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

export type LoginFormErrors = Partial<Record<"email" | "password", string>>;
