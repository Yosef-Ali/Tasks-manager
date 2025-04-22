"use client"

import { useState } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { DocumentCard } from "@/components/ui/document-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Search, Filter, Plus, Calendar, SortAsc, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Document type definition based on the instructions
export interface Document {
  id: string
  taskId: string
  title: string
  description: string
  type: string
  fileName: string
  fileUrl: string
  uploadedBy: string
  status: "pending" | "approved" | "review"
  category: string
  fileSize: string
  lastUpdated: string
  validUntil?: string
  tags: string[]
}

// Sample documents data
const initialDocuments: Document[] = [
  {
    id: "doc-1",
    taskId: "task-1",
    title: "Hospital License Renewal",
    description: "Annual hospital license renewal application with supporting documentation and compliance reports.",
    type: "PDF",
    fileName: "hospital_license_renewal_2023.pdf",
    fileUrl: "/documents/hospital_license_renewal_2023.pdf",
    uploadedBy: "Dr. Samuel",
    status: "pending",
    category: "License",
    fileSize: "4.2 MB",
    lastUpdated: "2023-05-13",
    validUntil: "2024-05-13",
    tags: ["License", "Renewal", "Compliance"],
  },
  {
    id: "doc-2",
    taskId: "task-2",
    title: "Medical Staff Bylaws",
    description: "Official bylaws governing the medical staff organization, responsibilities, and privileges.",
    type: "DOCX",
    fileName: "medical_staff_bylaws_v3.docx",
    fileUrl: "/documents/medical_staff_bylaws_v3.docx",
    uploadedBy: "Medical Director",
    status: "approved",
    category: "Administrative",
    fileSize: "1.8 MB",
    lastUpdated: "2023-04-15",
    validUntil: "2024-04-15",
    tags: ["Bylaws", "Staff", "Governance"],
  },
  {
    id: "doc-3",
    taskId: "task-3",
    title: "Infection Control Policy",
    description: "Updated infection control policies and procedures for all hospital departments.",
    type: "PDF",
    fileName: "infection_control_policy_2023.pdf",
    fileUrl: "/documents/infection_control_policy_2023.pdf",
    uploadedBy: "Infection Control Officer",
    status: "review",
    category: "Policies",
    fileSize: "3.5 MB",
    lastUpdated: "2023-05-08",
    validUntil: "2024-05-08",
    tags: ["Policy", "Infection Control", "Safety"],
  },
  {
    id: "doc-4",
    taskId: "task-4",
    title: "Emergency Response Plan",
    description: "Comprehensive emergency response procedures for various scenarios including natural disasters.",
    type: "PDF",
    fileName: "emergency_response_plan.pdf",
    fileUrl: "/documents/emergency_response_plan.pdf",
    uploadedBy: "Safety Officer",
    status: "approved",
    category: "Safety",
    fileSize: "7.2 MB",
    lastUpdated: "2023-02-20",
    validUntil: "2024-02-20",
    tags: ["Emergency", "Safety", "Procedures"],
  },
  {
    id: "doc-5",
    taskId: "task-5",
    title: "Pharmacy Formulary",
    description: "Current hospital formulary listing all approved medications with dosing guidelines.",
    type: "XLSX",
    fileName: "pharmacy_formulary_q2_2023.xlsx",
    fileUrl: "/documents/pharmacy_formulary_q2_2023.xlsx",
    uploadedBy: "Chief Pharmacist",
    status: "pending",
    category: "Pharmacy",
    fileSize: "2.4 MB",
    lastUpdated: "2023-05-10",
    validUntil: "2023-08-10",
    tags: ["Pharmacy", "Medications", "Formulary"],
  },
  {
    id: "doc-6",
    taskId: "task-6",
    title: "Quality Improvement Report",
    description: "Quarterly quality metrics and improvement initiatives across all departments.",
    type: "PPTX",
    fileName: "quality_improvement_q1_2023.pptx",
    fileUrl: "/documents/quality_improvement_q1_2023.pptx",
    uploadedBy: "Quality Director",
    status: "review",
    category: "Quality",
    fileSize: "5.8 MB",
    lastUpdated: "2023-05-01",
    validUntil: "2023-08-01",
    tags: ["Quality", "Metrics", "Improvement"],
  },
]

export function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter documents based on active tab and search query
  const filteredDocuments = documents.filter((document) => {
    // Filter by tab
    if (activeTab !== "all" && document.status !== activeTab) {
      return false
    }

    // Filter by search query
    if (
      searchQuery &&
      !document.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !document.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !document.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !document.category.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !document.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    ) {
      return false
    }

    return true
  })

  // Count documents by status
  const documentCounts = {
    all: documents.length,
    pending: documents.filter((document) => document.status === "pending").length,
    approved: documents.filter((document) => document.status === "approved").length,
    review: documents.filter((document) => document.status === "review").length,
  }

  // Calculate document processing percentages
  const licenseRenewals =
    Math.round((documents.filter((doc) => doc.category === "License").length / documents.length) * 100) || 0
  const supportLetters = Math.round(
    (documents.filter((doc) => doc.category === "Administrative").length / documents.length) * 100 || 0,
  )
  const authentication =
    Math.round((documents.filter((doc) => doc.category === "Policies").length / documents.length) * 100) || 0

  return (
    <div className="p-8">
      <PageHeader
        title="Documents"
        description="Manage and organize all hospital documents, forms, and records in one place."
      />

      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="h-10">
            <TabsTrigger
              value="all"
              className="flex items-center gap-1.5"
            >
              All <Badge variant="outline" className="ml-0.5">{documentCounts.all}</Badge>
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="flex items-center gap-1.5"
            >
              Pending <Badge className="ml-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/20">{documentCounts.pending}</Badge>
            </TabsTrigger>
            <TabsTrigger
              value="review"
              className="flex items-center gap-1.5"
            >
              Under Review <Badge className="ml-0.5 bg-sky-500/10 text-sky-500 border border-sky-500/20">{documentCounts.review}</Badge>
            </TabsTrigger>
            <TabsTrigger
              value="approved"
              className="flex items-center gap-1.5"
            >
              Approved <Badge className="ml-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">{documentCounts.approved}</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Calendar className="h-4 w-4 mr-2" />
                Date Updated
              </DropdownMenuItem>
              <DropdownMenuItem>
                <SortAsc className="h-4 w-4 mr-2" />
                File Size
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button size="sm" variant="default">
            <Plus className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Document Processing Status */}
      <div className="bg-card rounded-lg border border-border p-5 mb-6">
        <h3 className="font-medium text-card-foreground mb-4">Document Processing Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">License Renewals</span>
              <span className="text-sm text-foreground">{licenseRenewals}%</span>
            </div>
            <Progress value={licenseRenewals} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Support Letters</span>
              <span className="text-sm text-foreground">{supportLetters}%</span>
            </div>
            <Progress value={supportLetters} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Authentication</span>
              <span className="text-sm text-foreground">{authentication}%</span>
            </div>
            <Progress value={authentication} className="h-2" />
          </div>
        </div>
      </div>

      {filteredDocuments.length === 0 ? (
        <div className="bg-card rounded-lg border border-border p-8 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No documents found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? "No documents match your search criteria. Try adjusting your search."
              : "There are no documents in this category. Upload a new document to get started."}
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Upload New Document
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((document) => (
            <DocumentCard
              key={document.id}
              title={document.title}
              description={document.description}
              status={document.status}
              category={document.category}
              fileType={document.type}
              fileSize={document.fileSize}
              lastUpdated={document.lastUpdated}
              owner={document.uploadedBy}
            />
          ))}
        </div>
      )}
    </div>
  )
}
