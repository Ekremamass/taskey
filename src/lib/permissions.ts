import { getSessionUser } from "@/lib/auth";

export async function authorizeRole(roles: string[]) {
  const user = await getSessionUser();
  if (!user || !roles.includes(user.role)) {
    throw new Error("Unauthorized: Insufficient permissions");
  }
  return user;
}
