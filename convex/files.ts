import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUser } from "./users";
import { fileTypes } from "./schema";
import { Id } from "./_generated/dataModel";

async function hasAcessToOrg(
  ctx: QueryCtx | MutationCtx,
  tokenIdentifier: string,
  orgId: string,
) {
  const user = await getUser(ctx, tokenIdentifier);

  const hasAccess =
    user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId);

  if (!hasAccess) {
    throw new ConvexError("Not authorized");
  }

  return user;
}

async function hasAccessToFile(
  ctx: QueryCtx | MutationCtx,
  fileId: Id<"files">,
) {
  const identidy = await ctx.auth.getUserIdentity();

  if (!identidy) {
    throw new ConvexError("Not authorized");
  }

  const file = await ctx.db.get(fileId);

  if (!file) {
    return null;
  }

  const hasAccess = await hasAcessToOrg(
    ctx,
    identidy.tokenIdentifier,
    file.orgId,
  );

  if (!hasAccess) {
    return null;
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_tokenIdentifier", (q) =>
      q.eq("tokenIdentifier", identidy.tokenIdentifier),
    )
    .first();

  if (!user) {
    return null;
  }

  return { user, file };
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
      args.orgId,
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
    favorites: v.optional(v.boolean()),
  },
  async handler(ctx, args) {
    let files = await ctx.db
      .query("files")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId!))
      .collect();

    const query = args.query;

    if (args.favorites) {
      const identidy = await ctx.auth.getUserIdentity();

      if (!identidy) {
        throw new ConvexError("Not authorized");
      }

      const user = await ctx.db
        .query("users")
        .withIndex("by_tokenIdentifier", (q) =>
          q.eq("tokenIdentifier", identidy.tokenIdentifier),
        )
        .first();

      if (!user) {
        return files;
      }

      const favorites = await ctx.db
        .query("favorites")
        .withIndex("by_userId_orgId_fileId", (q) =>
          q.eq("userId", user._id).eq("orgId", args.orgId),
        )
        .collect();

      files = files.filter((file) =>
        favorites.some((favorite) => favorite.fileId === file._id),
      );
    }

    if (query) {
      files = files.filter((file) => {
        return file.name.toLowerCase().includes(query.toLowerCase());
      });
    }

    return files;
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  const identidy = await ctx.auth.getUserIdentity();

  if (!identidy) {
    throw new ConvexError("Not authorized");
  }

  return await ctx.storage.generateUploadUrl();
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

export const toggleFavorite = mutation({
  args: {
    fileId: v.id("files"),
  },
  async handler(ctx, args) {
    const access = await hasAccessToFile(ctx, args.fileId);

    if (!access) {
      throw new ConvexError("Not authorized");
    }

    const { user, file } = access;

    const favorite = await ctx.db
      .query("favorites")
      .withIndex("by_userId_orgId_fileId", (q) =>
        q
          .eq("userId", user._id)
          .eq("orgId", file.orgId)
          .eq("fileId", args.fileId),
      )
      .first();

    if (!favorite) {
      await ctx.db.insert("favorites", {
        fileId: args.fileId,
        userId: user._id,
        orgId: file.orgId,
      });
    } else {
      await ctx.db.delete(favorite._id);
    }
  },
});

export const getAllFavorites = query({
  args: {
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return [];
    }

    const hasAccess = await hasAcessToOrg(
      ctx,
      identity.tokenIdentifier,
      args.orgId,
    );

    if (!hasAccess) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .first();

    if (!user) {
      return [];
    }

    const response = await ctx.db
      .query("favorites")
      .withIndex("by_userId_orgId_fileId", (q) =>
        q.eq("userId", user._id).eq("orgId", args.orgId),
      )
      .collect();

    console.log(args.orgId, user._id);

    console.log("response", response);

    return response;
  },
});

export const assignFileToDelete = mutation({
  args: {
    fileId: v.id("files"),
  },
  async handler(ctx, args) {
    const access = await hasAccessToFile(ctx, args.fileId);

    if (!access) {
      throw new ConvexError("Not authorized");
    }

    const { file } = access;

    await ctx.db.patch(file._id, {
      on_trash: true,
    });

    return file;
  },
});
