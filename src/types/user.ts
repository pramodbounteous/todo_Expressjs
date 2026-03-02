export type UserRole = "user" | "admin";

export interface IUser {
  username: string;
  password: string;
  role: UserRole;
}