import { z } from "zod";
const schema = z.object({ id: z.string() });
console.log(schema.safeParse(null));
