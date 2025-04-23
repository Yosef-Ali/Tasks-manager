import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Button } from "./ui/button";
import { useState } from "react";
import { Id } from "../convex/_generated/dataModel";

export default function SeedButton() {
    const createTask = useMutation(api.tasks.createTask);
    const createDocument = useMutation(api.documents.createDocument);
    // First, we need to check if we have a function to get users
    const allUsers = useQuery(api.tasks.getTasks, {}) ?? [];

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Function to seed the database
    const seedDatabase = async () => {
        if (!allUsers || allUsers.length === 0) {
            setMessage("No tasks found. Please create at least one task first to have a valid user ID.");
            return;
        }

        setIsLoading(true);
        setMessage("Populating database with Ethiopian hospital data...");

        try {
            // Extract user IDs from existing tasks
            // We'll use the first task's creator and assignee as our user IDs
            const sampleTask = allUsers[0];

            if (!sampleTask || !sampleTask.creatorId) {
                setMessage("No valid user IDs found in tasks. Create a task first.");
                setIsLoading(false);
                return;
            }

            // Use the creator ID for all operations to ensure data consistency
            const mainUserId = sampleTask.creatorId;

            // --- LICENSES ---
            const licenseTypes = ["Medical Professional", "Medical Facility", "Specialized Practice", "Temporary Practice", "Medical Research"];
            const licenseLocations = ["Addis Ababa", "Hawassa", "Bahir Dar", "Mekelle", "Dire Dawa", "Jimma", "Soddo"];
            const licenseApplicants = ["Dr. Abebe Fekadu", "Dr. Tigist Hailu", "Dr. Mekonnen Tadesse", "Nurse Rahel Desta", "Dr. John Smith"];
            const licenseOrgs = ["Soddo Christian Hospital", "St. Paul's Hospital", "Black Lion Hospital", "Tikur Anbessa Hospital", "Hawassa University Hospital"];

            let tasksCreated = 0;
            let documentsCreated = 0;

            // Create license tasks
            for (let i = 0; i < 5; i++) {
                const createdDate = new Date();
                createdDate.setDate(createdDate.getDate() - (i * 3 + Math.floor(Math.random() * 5)));

                const dueDate = new Date(createdDate);
                dueDate.setDate(dueDate.getDate() + 14 + Math.floor(Math.random() * 30));

                const status = i === 0 ? "pending" : i === 1 ? "in-progress" : i === 2 ? "in-progress" : "completed";
                const priority = i === 0 ? "high" : i === 1 ? "medium" : i === 2 ? "high" : "medium";

                const documentType = licenseTypes[i % licenseTypes.length];
                const location = licenseLocations[i % licenseLocations.length];
                const applicant = licenseApplicants[i % licenseApplicants.length];
                const organization = licenseOrgs[i % licenseOrgs.length];

                const taskId = await createTask({
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
                    assigneeId: mainUserId,
                    creatorId: mainUserId,
                });

                tasksCreated++;

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

                    await createDocument({
                        name: `${doc.name} for ${applicant}`,
                        type: doc.type,
                        status: docStatus,
                        fileUrl: docStatus !== "required" ? `/documents/${doc.type}-sample.pdf` : undefined,
                        taskId,
                        uploadedById: docStatus !== "required" ? mainUserId : undefined
                    });

                    documentsCreated++;
                }
            }

            // --- WORK PERMITS ---
            const workPermitApplicants = ["Dr. Richard Miller", "Dr. Sarah Johnson", "Michael Williams", "Elizabeth Taylor", "Robert Davis"];
            const submissionPlaces = ["SCH Office", "Ministry of Labor", "Immigration Office", "Bethel Office", "Embassy Liaison Office"];

            for (let i = 0; i < 5; i++) {
                const createdDate = new Date();
                createdDate.setDate(createdDate.getDate() - (i * 5 + Math.floor(Math.random() * 10)));

                const dueDate = new Date(createdDate);
                dueDate.setDate(dueDate.getDate() + 20 + Math.floor(Math.random() * 30));

                const status = i <= 1 ? "pending" : i <= 3 ? "in-progress" : "completed";
                const priority = i === 0 ? "high" : i === 1 ? "high" : i === 2 ? "medium" : "low";

                const applicant = workPermitApplicants[i % workPermitApplicants.length];
                const submissionPlace = submissionPlaces[i % submissionPlaces.length];

                const taskId = await createTask({
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
                    assigneeId: mainUserId,
                    creatorId: mainUserId,
                });

                tasksCreated++;

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

                    await createDocument({
                        name: `${doc.name} for ${applicant}`,
                        type: doc.type,
                        status: docStatus,
                        fileUrl: docStatus !== "required" ? `/documents/${doc.type}-sample.pdf` : undefined,
                        taskId,
                        uploadedById: docStatus !== "required" ? mainUserId : undefined
                    });

                    documentsCreated++;
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

                const applicant = residentApplicants[i % residentApplicants.length];

                const taskId = await createTask({
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
                    assigneeId: mainUserId,
                    creatorId: mainUserId,
                });

                tasksCreated++;

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

                    await createDocument({
                        name: `${doc.name} for ${applicant}`,
                        type: doc.type,
                        status: docStatus,
                        fileUrl: docStatus !== "required" ? `/documents/${doc.type}-sample.pdf` : undefined,
                        taskId,
                        uploadedById: docStatus !== "required" ? mainUserId : undefined
                    });

                    documentsCreated++;
                }
            }

            // --- SUPPORT LETTERS ---
            const requesterOrgs = ["Soddo Christian Hospital", "CURE Ethiopia", "Myungsung Christian Medical Center", "Project Mercy", "Hamlin Fistula Ethiopia"];
            const letterTypes = ["General Support", "Ministry of Health", "Ministry of Finance", "Regional Health Bureau", "Immigration Authority"];

            for (let i = 0; i < 5; i++) {
                const createdDate = new Date();
                createdDate.setDate(createdDate.getDate() - (i * 2 + Math.floor(Math.random() * 5)));

                const dueDate = new Date(createdDate);
                dueDate.setDate(dueDate.getDate() + 10 + Math.floor(Math.random() * 10));

                const status = i <= 1 ? "pending" : i === 2 ? "in-progress" : "completed";
                const priority = i === 0 ? "high" : i === 1 ? "medium" : i === 2 ? "medium" : "low";

                const requester = requesterOrgs[i % requesterOrgs.length];
                const letterType = letterTypes[i % letterTypes.length];

                const taskId = await createTask({
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
                    assigneeId: mainUserId,
                    creatorId: mainUserId,
                });

                tasksCreated++;

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

                    await createDocument({
                        name: `${doc.name} from ${requester}`,
                        type: doc.type,
                        status: docStatus,
                        fileUrl: docStatus !== "required" ? `/documents/${doc.type}-sample.pdf` : undefined,
                        taskId,
                        uploadedById: docStatus !== "required" ? mainUserId : undefined
                    });

                    documentsCreated++;
                }
            }

            setMessage(`Success! Created ${tasksCreated} tasks and ${documentsCreated} documents with Ethiopian hospital data.`);
            setIsLoading(false);
        } catch (error) {
            console.error("Error seeding database:", error);
            setMessage(`Error: ${error instanceof Error ? error.message : "Unknown error occurred"}`);
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-start gap-2">
            <Button
                onClick={seedDatabase}
                variant="outline"
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={isLoading || !allUsers || allUsers.length === 0}
            >
                {isLoading ? "Populating..." : "Populate with Ethiopian Hospital Data"}
            </Button>

            {message && (
                <div className={`text-sm ${message.includes("Error") ? "text-red-500" : "text-green-600"}`}>
                    {message}
                </div>
            )}

            {(!allUsers || allUsers.length === 0) && (
                <div className="text-sm text-amber-600">
                    Please create at least one task first to have valid user IDs for seeding.
                </div>
            )}
        </div>
    );
}
