import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createFile = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identidy = await ctx.auth.getUserIdentity();

    if (!identidy) {
      throw new Error("Not logged in");
    }

    await ctx.db.insert("files", { name: args.name });
  },
});

export const getFile = query({
  args: {},
  async handler(ctx) {
    const identidy = await ctx.auth.getUserIdentity();

    if (!identidy) {
      throw new Error("Not logged in");
    }
    return await ctx.db.query("files").collect();
  },
});
