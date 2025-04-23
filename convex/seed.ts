import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Simple test function to make sure the file is being deployed
export const testSeed = mutation({
  handler: async (ctx) => {
    console.log("Test seed function called successfully!");
    return { success: true };
  }
});

// Enhanced seed script with realistic Ethiopian hospital data
export const seedDatabase = mutation({
    handler: async (ctx) => {
        // --- Create Users --- 
        const usersToCreate = [
            { name: "Yonatan Afewerk", email: "yonatan@soddo.org", tokenIdentifier: "yonatan-token", avatarUrl: "/placeholder-user.jpg" },
            { name: "Bethel Admin", email: "admin@bethel.org", tokenIdentifier: "bethel-token", avatarUrl: "/placeholder-user.jpg" },
            { name: "Kalkidan Tadesse", email: "kalkidan@soddo.org", tokenIdentifier: "kalkidan-token", avatarUrl: "/placeholder-user.jpg" },
            { name: "Samuel Kebede", email: "samuel@bethel.org", tokenIdentifier: "samuel-token", avatarUrl: "/placeholder-user.jpg" },
            { name: "Daniel Tesfaye", email: "daniel@immigration.gov.et", tokenIdentifier: "daniel-token", avatarUrl: "/placeholder-user.jpg" },
            { name: "Feven Mulugeta", email: "feven@mol.gov.et", tokenIdentifier: "feven-token", avatarUrl: "/placeholder-user.jpg" },
        ];

        // User mapping to store IDs with proper typing
        const userIds: Record<string, Id<"users">> = {};

        // Create admin user
        const adminUserId = await ctx.db.insert("users", {
            ...usersToCreate[0],
            createdAt: new Date().toISOString()
        });
        userIds[usersToCreate[0].name] = adminUserId;

        // Create the rest of the users
        for (const userData of usersToCreate.slice(1)) {
            // Check if user already exists by email
            const existingUser = await ctx.db.query("users")
                .filter(q => q.eq(q.field("email"), userData.email))
                .first();

            if (!existingUser) {
                const userId = await ctx.db.insert("users", {
                    ...userData,
                    createdAt: new Date().toISOString()
                });
                userIds[userData.name] = userId;
            } else {
                userIds[userData.name] = existingUser._id;
            }
        }

        // --- LICENSES ---
        const licenseTypes = ["Medical Professional", "Medical Facility", "Specialized Practice", "Temporary Practice", "Medical Research"];
        const licenseLocations = ["Addis Ababa", "Hawassa", "Bahir Dar", "Mekelle", "Dire Dawa", "Jimma", "Soddo"];
        const licenseApplicants = ["Dr. Abebe Fekadu", "Dr. Tigist Hailu", "Dr. Mekonnen Tadesse", "Nurse Rahel Desta", "Dr. John Smith"];
        const licenseOrgs = ["Soddo Christian Hospital", "St. Paul's Hospital", "Black Lion Hospital", "Tikur Anbessa Hospital", "Hawassa University Hospital"];

        // Create license tasks
        for (let i = 0; i < 5; i++) {
            const createdDate = new Date();
            createdDate.setDate(createdDate.getDate() - (i * 3 + Math.floor(Math.random() * 5)));

            const dueDate = new Date(createdDate);
            dueDate.setDate(dueDate.getDate() + 14 + Math.floor(Math.random() * 30));

            const status = i === 0 ? "pending" : i === 1 ? "in-progress" : i === 2 ? "in-progress" : "completed";
            const priority = i === 0 ? "high" : i === 1 ? "medium" : i === 2 ? "high" : "medium";

            const assigneeName = i === 0 ? "Kalkidan Tadesse" : i === 1 ? "Samuel Kebede" : i === 2 ? "Bethel Admin" : "Kalkidan Tadesse";

            const documentType = licenseTypes[i % licenseTypes.length];
            const location = licenseLocations[i % licenseLocations.length];
            const applicant = licenseApplicants[i % licenseApplicants.length];
            const organization = licenseOrgs[i % licenseOrgs.length];

            const taskId = await ctx.db.insert("tasks", {
                title: `License Application - ${documentType}`,
                description: `Process license application for ${applicant} from ${organization}`,
                taskType: "license-application",
                status,
                priority,
                dueDate: dueDate.toISOString(),
                location,
                completedSteps: status === "completed" ? ["submission", "verification", "approval"] :
                    status === "in-progress" ? ["submission", "verification"] : ["submission"],
                totalSteps: 3,
                createdAt: createdDate.toISOString(),
                assigneeId: userIds[assigneeName],
                creatorId: adminUserId,
            });

            // Create related documents
            const docs = [
                { name: "Support letter", type: "support-letter" },
                { name: "Authenticated academic document", type: "academic-document" },
                { name: "Health Certificate", type: "health-certificate" },
                { name: "HERQA equivalence letter", type: "equivalence-letter" },
                { name: "Payment proof", type: "payment-proof" }
            ];

            for (const doc of docs) {
                const docStatus = status === "completed" ? "verified" :
                    status === "in-progress" && docs.indexOf(doc) < 3 ? "uploaded" : "required";

                const uploadDate = docStatus !== "required" ? new Date(createdDate) : undefined;
                if (uploadDate) {
                    uploadDate.setDate(uploadDate.getDate() + (1 + Math.floor(Math.random() * 3)));
                }

                await ctx.db.insert("documents", {
                    name: `${doc.name} for ${applicant}`,
                    type: doc.type,
                    status: docStatus,
                    fileUrl: docStatus !== "required" ? `/documents/${doc.type}-sample.pdf` : undefined,
                    uploadedAt: uploadDate?.toISOString(),
                    taskId,
                    uploadedById: docStatus !== "required" ? userIds[assigneeName] : undefined
                });
            }
        }

        // --- WORK PERMITS ---
        const workPermitApplicants = ["Dr. Richard Miller", "Dr. Sarah Johnson", "Michael Williams", "Elizabeth Taylor", "Robert Davis"];
        const supportLetterSources = ["SNNP Region", "Addis Ababa Health Bureau", "Ministry of Health", "National Medical Association", "Oromia Health Department"];
        const submissionPlaces = ["SCH Office", "Ministry of Labor", "Immigration Office", "Bethel Office", "Embassy Liaison Office"];

        for (let i = 0; i < 5; i++) {
            const createdDate = new Date();
            createdDate.setDate(createdDate.getDate() - (i * 5 + Math.floor(Math.random() * 10)));

            const dueDate = new Date(createdDate);
            dueDate.setDate(dueDate.getDate() + 20 + Math.floor(Math.random() * 30));

            const status = i <= 1 ? "pending" : i <= 3 ? "in-progress" : "completed";
            const priority = i === 0 ? "high" : i === 1 ? "high" : i === 2 ? "medium" : "low";

            const assigneeName = i === 0 || i === 4 ? "Feven Mulugeta" : i === 1 ? "Samuel Kebede" : "Bethel Admin";

            const applicant = workPermitApplicants[i % workPermitApplicants.length];
            const supportLetterFrom = supportLetterSources[i % supportLetterSources.length];
            const submissionPlace = submissionPlaces[i % submissionPlaces.length];

            const taskId = await ctx.db.insert("tasks", {
                title: `Work Permit - ${applicant}`,
                description: `Process work permit application for ${applicant}`,
                taskType: "work-permit",
                status,
                priority,
                dueDate: dueDate.toISOString(),
                location: submissionPlace,
                completedSteps: status === "completed" ? ["submission", "processing", "approval", "collection"] :
                    status === "in-progress" ? ["submission", "processing"] : ["submission"],
                totalSteps: 4,
                createdAt: createdDate.toISOString(),
                assigneeId: userIds[assigneeName],
                creatorId: adminUserId,
            });

            // Create related documents
            const docs = [
                { name: "Passport", type: "passport" },
                { name: "Certificate of Competence", type: "coc" },
                { name: "Business License", type: "business-license" },
                { name: "Support Letter", type: "support-letter" },
                { name: "Visa Copy", type: "visa-copy" }
            ];

            for (const doc of docs) {
                const docStatus = status === "completed" ? "verified" :
                    status === "in-progress" && docs.indexOf(doc) < 3 ? "uploaded" : "required";

                const uploadDate = docStatus !== "required" ? new Date(createdDate) : undefined;
                if (uploadDate) {
                    uploadDate.setDate(uploadDate.getDate() + (1 + Math.floor(Math.random() * 3)));
                }

                await ctx.db.insert("documents", {
                    name: `${doc.name} for ${applicant}`,
                    type: doc.type,
                    status: docStatus,
                    fileUrl: docStatus !== "required" ? `/documents/${doc.type}-sample.pdf` : undefined,
                    uploadedAt: uploadDate?.toISOString(),
                    taskId,
                    uploadedById: docStatus !== "required" ? userIds[assigneeName] : undefined
                });
            }
        }

        // --- RESIDENCE IDs ---
        const residentApplicants = ["Dr. Mark Wilson", "Dr. Emily Brown", "James Anderson", "Jennifer Martinez", "Thomas Robinson"];

        for (let i = 0; i < 5; i++) {
            const createdDate = new Date();
            createdDate.setDate(createdDate.getDate() - (i * 4 + Math.floor(Math.random() * 8)));

            const dueDate = new Date(createdDate);
            dueDate.setDate(dueDate.getDate() + 25 + Math.floor(Math.random() * 15));

            const status = i === 0 ? "pending" : i <= 2 ? "in-progress" : "completed";
            const priority = i === 0 ? "medium" : i === 1 ? "high" : i === 2 ? "high" : "medium";

            const assigneeName = i <= 1 ? "Daniel Tesfaye" : i === 2 ? "Samuel Kebede" : "Bethel Admin";

            const applicant = residentApplicants[i % residentApplicants.length];

            const taskId = await ctx.db.insert("tasks", {
                title: `Residence ID - ${applicant}`,
                description: `Process residence ID for ${applicant}`,
                taskType: "residence-id",
                status,
                priority,
                dueDate: dueDate.toISOString(),
                location: "Immigration Bethel",
                completedSteps: status === "completed" ? ["submission", "payment", "collection"] :
                    status === "in-progress" ? ["submission"] : [],
                totalSteps: 3,
                createdAt: createdDate.toISOString(),
                assigneeId: userIds[assigneeName],
                creatorId: adminUserId,
            });

            // Create related documents
            const docs = [
                { name: "Passport", type: "passport" },
                { name: "Work Permit", type: "work-permit" },
                { name: "Support Letter", type: "support-letter" },
                { name: "Visa", type: "visa" },
                { name: "Photos", type: "photos" }
            ];

            for (const doc of docs) {
                const docStatus = status === "completed" ? "verified" :
                    status === "in-progress" && docs.indexOf(doc) < 2 ? "uploaded" : "required";

                const uploadDate = docStatus !== "required" ? new Date(createdDate) : undefined;
                if (uploadDate) {
                    uploadDate.setDate(uploadDate.getDate() + (1 + Math.floor(Math.random() * 3)));
                }

                await ctx.db.insert("documents", {
                    name: `${doc.name} for ${applicant}`,
                    type: doc.type,
                    status: docStatus,
                    fileUrl: docStatus !== "required" ? `/documents/${doc.type}-sample.pdf` : undefined,
                    uploadedAt: uploadDate?.toISOString(),
                    taskId,
                    uploadedById: docStatus !== "required" ? userIds[assigneeName] : undefined
                });
            }
        }

        // --- SUPPORT LETTERS ---
        const requesterOrgs = ["Soddo Christian Hospital", "CURE Ethiopia", "Myungsung Christian Medical Center", "Project Mercy", "Hamlin Fistula Ethiopia"];
        const letterTypes = ["General Support", "Ministry of Health", "Ministry of Finance", "Regional Health Bureau", "Immigration Authority"];
        const responsibles = ["Kalkidan Tadesse", "Samuel Kebede", "Bethel Admin"];

        for (let i = 0; i < 5; i++) {
            const createdDate = new Date();
            createdDate.setDate(createdDate.getDate() - (i * 2 + Math.floor(Math.random() * 5)));

            const dueDate = new Date(createdDate);
            dueDate.setDate(dueDate.getDate() + 10 + Math.floor(Math.random() * 10));

            const status = i <= 1 ? "pending" : i === 2 ? "in-progress" : "completed";
            const priority = i === 0 ? "high" : i === 1 ? "medium" : i === 2 ? "medium" : "low";

            const assigneeName = responsibles[i % responsibles.length];
            const requester = requesterOrgs[i % requesterOrgs.length];
            const letterType = letterTypes[i % letterTypes.length];

            const taskId = await ctx.db.insert("tasks", {
                title: `Support Letter - ${requester}`,
                description: `Generate ${letterType} support letter for ${requester}`,
                taskType: "support-letter",
                status,
                priority,
                dueDate: dueDate.toISOString(),
                location: "SCH Office",
                completedSteps: status === "completed" ? ["request", "drafting", "approval", "issuance"] :
                    status === "in-progress" ? ["request", "drafting"] : ["request"],
                totalSteps: 4,
                createdAt: createdDate.toISOString(),
                assigneeId: userIds[assigneeName],
                creatorId: adminUserId,
            });

            // Create related documents
            const docs = [
                { name: "Official Request Letter", type: "official-letter" },
                { name: "Business License", type: "business-license" },
                { name: "Certificate of Competence", type: "coc" },
                { name: "Business Registration", type: "business-registration" },
                { name: "TIN Certificate", type: "tin-certificate" }
            ];

            for (const doc of docs) {
                const docStatus = status === "completed" ? "verified" :
                    status === "in-progress" && docs.indexOf(doc) < 3 ? "uploaded" : "required";

                const uploadDate = docStatus !== "required" ? new Date(createdDate) : undefined;
                if (uploadDate) {
                    uploadDate.setDate(uploadDate.getDate() + (1 + Math.floor(Math.random() * 2)));
                }

                await ctx.db.insert("documents", {
                    name: `${doc.name} from ${requester}`,
                    type: doc.type,
                    status: docStatus,
                    fileUrl: docStatus !== "required" ? `/documents/${doc.type}-sample.pdf` : undefined,
                    uploadedAt: uploadDate?.toISOString(),
                    taskId,
                    uploadedById: docStatus !== "required" ? userIds[assigneeName] : undefined
                });
            }
        }

        console.log("Seed data created successfully.");
        return { success: true };
    }
});