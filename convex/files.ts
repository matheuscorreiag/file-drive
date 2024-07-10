import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createFile = mutation({
  args: {
    name: v.string(),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("files", { name: args.name, orgId: args.orgId });
  },
});

export const getFile = query({
  args: {
    orgId: v.string(),
  },
  async handler(ctx, args) {
    return await ctx.db
      .query("files")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId!))
      .collect();
  },
});
