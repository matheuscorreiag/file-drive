import { query } from "../convex/_generated/server";

export const getActualUser = query(async (ctx) => {
  const user = await ctx.auth.getUserIdentity();

  if (user === null) {
    return null;
  }

  return user;
});
