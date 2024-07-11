import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUser } from "./users";

async function hasAcessToOrg(
  ctx: QueryCtx | MutationCtx,
  tokenIdentifier: string,
  orgId: string
) {
  const user = await getUser(ctx, tokenIdentifier);

  const hasAccess =
    user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId);

  if (!hasAccess) {
    throw new ConvexError("Not authorized");
  }

  return user;
}
export const createFile = mutation({
  args: {
    name: v.string(),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identidy = await ctx.auth.getUserIdentity();

    if (!identidy) {
      return [];
    }
    const hasAccess = await hasAcessToOrg(
      ctx,
      identidy.tokenIdentifier,
      args.orgId
    );

    if (!hasAccess) {
      throw new ConvexError("Not authorized");
    }

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
