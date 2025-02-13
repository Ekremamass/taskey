export function handleError(
  error: unknown,
  statusCode: number = 500
): Response {
  console.error("Error:", error);

  if (error instanceof Error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: statusCode,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ error: "Unknown error occurred" }), {
    status: statusCode,
    headers: { "Content-Type": "application/json" },
  });
}
