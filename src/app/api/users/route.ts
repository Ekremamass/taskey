import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { handleError } from "@/lib/utils";

export const dynamic = "force-static";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return handleError(new Error("Unauthorized"), 401);
    }

    const users = await prisma.user.findMany();
    return new Response(JSON.stringify({ users }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return handleError(error, 500);
  }
}
