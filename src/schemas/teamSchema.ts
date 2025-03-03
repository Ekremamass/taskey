import { z } from "zod";

const TeamSchema = z.object({
  name: z.string(),
});

export { TeamSchema };
