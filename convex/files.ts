import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Generate a URL for file uploads
export const generateUploadUrl = mutation({
    args: {},
    handler: async (ctx, args) => {
        return await ctx.storage.generateUploadUrl();
    },
});

// Get a URL to download a file
export const getDownloadUrl = mutation({
    args: { storageId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.storage.getUrl(args.storageId);
    },
});