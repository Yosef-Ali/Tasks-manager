import { Clock, CheckCircle, AlertCircle, MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface TaskCardProps {
  title: string
  description: string
  status: "pending" | "in-progress" | "completed" | "urgent" | "under-review" // Added "under-review" status
  dueDate: string
  assignee: string
  category: string
  priority?: "low" | "medium" | "high"
  requiredDocuments?: string[] // Added requiredDocuments prop
}

export function TaskCard({
  title,
  description,
  status,
  dueDate,
  assignee,
  category,
  priority = "medium",
}: TaskCardProps) {
  const statusColors = {
    pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    "in-progress": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    urgent: "bg-red-500/10 text-red-500 border-red-500/20",
    "under-review": "bg-sky-500/10 text-sky-500 border-sky-500/20",
  }

  const statusIcons = {
    pending: <Clock className="h-4 w-4" />,
    "in-progress": <AlertCircle className="h-4 w-4" />,
    completed: <CheckCircle className="h-4 w-4" />,
    urgent: <AlertCircle className="h-4 w-4" />,
    "under-review": <Clock className="h-4 w-4" />,
  }

  const priorityColors = {
    low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    high: "bg-red-500/10 text-red-500 border-red-500/20",
  }

  // Format the due date
  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-gray-600 transition-all duration-200 flex flex-col">
      <div className="p-5 flex-1">
        <div className="flex justify-between items-start mb-3">
          <Badge className={`${statusColors[status]} text-xs font-medium flex items-center gap-1`}>
            {statusIcons[status]}
            {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
          </Badge>
          <Badge className={`${priorityColors[priority]} text-xs font-medium`}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
          </Badge>
        </div>
        <h3 className="font-medium text-lg mb-2 text-white">{title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-3">{description}</p>
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex justify-between">
            <span>Due:</span>
            <span className="text-gray-400">{formatDueDate(dueDate)}</span>
          </div>
          <div className="flex justify-between">
            <span>Assignee:</span>
            <span className="text-gray-400">{assignee}</span>
          </div>
          <div className="flex justify-between">
            <span>Category:</span>
            <span className="text-gray-400">{category}</span>
          </div>
        </div>
      </div>
      <div className="px-5 py-3 border-t border-gray-700 flex justify-between items-center">
        <button className="text-xs text-blue-400 hover:text-blue-300 font-medium">View Details</button>
        <DropdownMenu>
          <DropdownMenuTrigger className="text-xs text-gray-400 hover:text-gray-300 font-medium flex items-center">
            <MoreHorizontal size={14} className="mr-1" />
            Actions
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
            <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700 text-sm">Edit Task</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700 text-sm">
              Mark as Completed
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700 text-sm text-red-400">
              Delete Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
