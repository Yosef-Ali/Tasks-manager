import { FileText, FileCheck, FileWarning, MoreHorizontal, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface DocumentCardProps {
  title: string
  description: string
  status: "pending" | "approved" | "review"
  category: string
  fileType: string
  fileSize: string
  lastUpdated: string
  owner: string
}

export function DocumentCard({
  title,
  description,
  status,
  category,
  fileType,
  fileSize,
  lastUpdated,
  owner,
}: DocumentCardProps) {
  const statusColors = {
    pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    approved: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    review: "bg-sky-500/10 text-sky-500 border-sky-500/20",
  }

  const statusIcons = {
    pending: <FileWarning className="h-4 w-4" />,
    approved: <FileCheck className="h-4 w-4" />,
    review: <FileText className="h-4 w-4" />,
  }

  const statusLabels = {
    pending: "Pending",
    approved: "Approved",
    review: "Under Review",
  }

  // Format the last updated date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden hover:border-primary/20 transition-all duration-200 flex flex-col">
      <div className="p-5 flex-1">
        <div className="flex justify-between items-start mb-3">
          <Badge className={`${statusColors[status]} text-xs font-medium flex items-center gap-1`}>
            {statusIcons[status]}
            {statusLabels[status]}
          </Badge>
          <Badge className="bg-secondary text-secondary-foreground text-xs">{fileType}</Badge>
        </div>
        <h3 className="font-medium text-lg mb-2 text-foreground">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{description}</p>
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Category:</span>
            <span className="text-muted-foreground/80">{category}</span>
          </div>
          <div className="flex justify-between">
            <span>Size:</span>
            <span className="text-muted-foreground/80">{fileSize}</span>
          </div>
          <div className="flex justify-between">
            <span>Updated:</span>
            <span className="text-muted-foreground/80">{formatDate(lastUpdated)}</span>
          </div>
          <div className="flex justify-between">
            <span>Owner:</span>
            <span className="text-muted-foreground/80">{owner}</span>
          </div>
        </div>
      </div>
      <div className="px-5 py-3 border-t border-border flex justify-between items-center">
        <button className="text-xs text-primary hover:text-primary/80 font-medium">View Document</button>
        <DropdownMenu>
          <DropdownMenuTrigger className="text-xs text-muted-foreground hover:text-foreground font-medium flex items-center">
            <MoreHorizontal size={14} className="mr-1" />
            Actions
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="text-sm">
              <Download size={14} className="mr-2" />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem className="text-sm">Share Document</DropdownMenuItem>
            <DropdownMenuItem className="text-sm">Edit Details</DropdownMenuItem>
            <DropdownMenuItem className="text-sm text-destructive">Delete Document</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
