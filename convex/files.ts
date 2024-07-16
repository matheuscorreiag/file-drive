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
    fileId: v.id("_storage"),
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

    await ctx.db.insert("files", {
      name: args.name,
      orgId: args.orgId,
      fileId: args.fileId,
    });
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

export const generateUploadUrl = mutation(async (ctx) => {
  const identidy = await ctx.auth.getUserIdentity();

  if (!identidy) {
    throw new ConvexError("Not authorized");
  }

  return await ctx.storage.generateUploadUrl();
});

export const deleteFile = mutation({
  args: {
    fileId: v.id("files"),
  },
  async handler(ctx, args) {
    const identidy = await ctx.auth.getUserIdentity();

    if (!identidy) {
      throw new ConvexError("Not authorized");
    }

    const file = await ctx.db.get(args.fileId);

    if (!file) {
      throw new ConvexError("File not found");
    }

    const hasAccess = await hasAcessToOrg(
      ctx,
      identidy.tokenIdentifier,
      file.orgId
    );

    if (!hasAccess) {
      throw new ConvexError("Not authorized");
    }

    await ctx.db.delete(args.fileId);
  },
});
