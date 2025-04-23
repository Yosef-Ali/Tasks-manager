import type { Task } from "@/components/kanban/kanban-board"
import { Calendar, Clock, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface KanbanItemProps {
  task: Task
}

export function KanbanItem({ task }: KanbanItemProps) {
  const priorityColors = {
    low: "bg-blue-900 text-blue-300",
    medium: "bg-yellow-900 text-yellow-300",
    high: "bg-red-900 text-red-300",
  }

  const priorityIcons = {
    low: <Clock className="h-3 w-3" />,
    medium: <Clock className="h-3 w-3" />,
    high: <AlertCircle className="h-3 w-3" />,
  }

  // Format the due date
  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-sm hover:border-gray-600 transition-all duration-200">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <Badge className={cn("text-xs font-medium flex items-center gap-1", priorityColors[task.priority])}>
            {priorityIcons[task.priority]}
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
          </Badge>
          <Badge className="bg-gray-700 text-gray-300 text-xs">{task.category}</Badge>
        </div>

        <h3 className="font-medium text-white mb-2">{task.title}</h3>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{task.description}</p>

        <div className="flex justify-between items-center text-xs text-gray-400">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDueDate(task.dueDate)}
          </div>
          {task.assignee ? (
            typeof task.assignee === 'object' && task.assignee !== null ? (
              // Assignee is an object
              <div className="flex items-center">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={(task.assignee as any).avatarUrl} />
                  <AvatarFallback>{(task.assignee as any).name ? (task.assignee as any).name.charAt(0) : '?'}</AvatarFallback>
                </Avatar>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  {(task.assignee as any).name || 'Unknown Assignee'}
                </span>
              </div>
            ) : typeof task.assignee === 'string' ? (
              // Assignee is a string
              <div className="flex items-center">
                <Avatar className="h-6 w-6">
                  <AvatarFallback>{task.assignee.length > 0 ? task.assignee.charAt(0) : '?'}</AvatarFallback>
                </Avatar>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  {task.assignee}
                </span>
              </div>
            ) : (
              // Fallback for unexpected assignee type
              <span className="text-sm text-gray-500">Invalid Assignee Data</span>
            )
          ) : (
            <span className="text-sm text-gray-500">Unassigned</span>
          )}
        </div>
      </div>
    </div>
  )
}
