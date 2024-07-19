import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUser } from "./users";
import { fileTypes } from "./schema";

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
    type: fileTypes,
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
      type: args.type,
    });
  },
});

export const getFile = query({
  args: {
    orgId: v.string(),
    query: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const files = await ctx.db
      .query("files")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId!))
      .collect();

    const query = args.query;

    if (!query) {
      return files;
    }

    return files.filter((file) => {
      return file.name.toLowerCase().includes(query.toLowerCase());
    });
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

export const getFileUrl = query({
  args: {
    fileId: v.id("_storage"),
  },

  async handler(ctx, args) {
    const fileUrl = await ctx.storage.getUrl(args.fileId);

    if (!fileUrl) {
      throw new ConvexError("File not found");
    }

    return fileUrl;
  },
});
