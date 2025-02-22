export type User = {
  id: string;
  name?: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "MEMBER";
};
