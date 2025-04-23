import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel.js";

export const getDocuments = query({
    args: { taskId: v.optional(v.id("tasks")) },
    handler: async (ctx, args) => {
        let documents;

        if (args.taskId) {
            // Use the index only if taskId is provided
            documents = await ctx.db
                .query("documents")
                .withIndex("by_task", (q) => q.eq("taskId", args.taskId!))
                .collect();
        } else {
            // Otherwise, fetch all documents
            documents = await ctx.db.query("documents").collect();
        }

        // Get uploader information for each document
        const documentsWithUploaders = await Promise.all(
            documents.map(async (doc) => {
                if (doc.uploadedById) {
                    // Assert uploadedById as Id<"users"> since it's not undefined
                    const uploader = await ctx.db.get(doc.uploadedById as Id<"users">); // Id is now imported
                    return { ...doc, uploadedBy: uploader };
                }
                return doc;
            })
        );

        return documentsWithUploaders;
    },
});

export const createDocument = mutation({
    args: {
        name: v.string(),
        type: v.string(),
        status: v.string(),
        fileUrl: v.optional(v.string()),
        taskId: v.id("tasks"),
        uploadedById: v.optional(v.id("users")),
    },
    handler: async (ctx, args) => {
        const documentId = await ctx.db.insert("documents", {
            ...args,
            uploadedAt: args.fileUrl ? new Date().toISOString() : undefined,
        });

        return documentId;
    },
});

export const updateDocument = mutation({
    args: {
        id: v.id("documents"),
        status: v.optional(v.string()),
        fileUrl: v.optional(v.string()),
        uploadedById: v.optional(v.id("users")),
    },
    handler: async (ctx, args) => {
        const { id, ...fields } = args;

        let patchData: typeof fields & { uploadedAt?: string } = fields; // Define patchData with potential uploadedAt

        // If we're updating with a file URL, add upload timestamp
        if (fields.fileUrl) {
            patchData = {
                ...fields,
                uploadedAt: new Date().toISOString(),
            };
        }

        await ctx.db.patch(id, patchData); // Use patchData

        return await ctx.db.get(id);
    },
});