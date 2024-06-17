import { z } from "zod";

export const UserSchema = z.object({
  profile_picture: z.string().url().optional(),
  name: z.string().min(1),
  username: z.string().min(1),
  email: z.string().email(),
  score: z.number().int().default(0),
  password: z.string(),
  lastLogInDate: z.date().default(() => new Date()),
  match_played: z.number().int().default(0),
  match_failed: z.number().int().default(0),
  match_win: z.number().int().default(0),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type User = z.infer<typeof UserSchema>;
