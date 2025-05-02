
export type UserRole = "admin" | "manager";

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  role: UserRole;
}
