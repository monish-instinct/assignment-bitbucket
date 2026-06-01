export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
}

export interface UserFormValues {
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
}

export type ViewMode = "list" | "card";
