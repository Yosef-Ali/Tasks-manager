import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarIcon,
  MapPinIcon,
  FileTextIcon,
  MoreHorizontalIcon,
  EyeIcon,
  EditIcon
} from "lucide-react";
import { format } from "date-fns";
import { Id } from "@/convex/_generated/dataModel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export interface TaskCardProps {
  id: Id<"tasks">;
  title: string;
  description?: string;
  dueDate: Date;
  status: string;
  taskType?: string;
  priority?: string;
  assignee?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  location?: string;
  documentCount: number;
  completedDocuments: number;
  onStatusChange?: (id: Id<"tasks">, status: string) => void;
  onEdit?: (id: Id<"tasks">) => void;
  onViewDetails?: (id: string) => void;
  onArchive?: (id: Id<"tasks">) => void;
  onShare?: (id: Id<"tasks">) => void;
}

export function TaskCard({
  id,
  title,
  description,
  dueDate,
  status,
  taskType,
  priority,
  assignee,
  location,
  documentCount,
  completedDocuments,
  onStatusChange,
  onEdit,
  onViewDetails,
  onArchive,
  onShare
}: TaskCardProps) {
  const progressValue = documentCount > 0 ? (completedDocuments / documentCount) * 100 : 0;

  // Get status badge styling based on status
  const getStatusBadgeClass = () => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "under-review":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
    }
  };

  // Format status display text
  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl font-semibold line-clamp-1">{title}</CardTitle>
            {taskType && (
              <Badge variant="outline" className="mt-2 font-normal text-gray-600 dark:text-gray-400">
                {taskType}
              </Badge>
            )}
          </div>
          <Badge className={`${getStatusBadgeClass()} ml-2 self-start flex-shrink-0`}>
            {formatStatus(status)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col h-full p-6 pt-0">
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
            {description}
          </p>
        )}

        <div className="flex flex-col flex-1 justify-between">
          <div className="space-y-4">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
              <span>Due: {format(dueDate, "PPP")}</span>
            </div>

            {location && (
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <MapPinIcon className="mr-2 h-4 w-4 text-gray-400" />
                <span>{location}</span>
              </div>
            )}

            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <FileTextIcon className="mr-2 h-4 w-4 text-gray-400" />
              <span>Documents: {completedDocuments}/{documentCount}</span>
            </div>
          </div>

          {documentCount > 0 && (
            <div className="pt-4 mt-auto mb-4">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>Progress</span>
                <span>{Math.round(progressValue)}%</span>
              </div>
              <Progress value={progressValue} className="h-2" />
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-100 dark:border-gray-800">
          {assignee ? (
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2 ring-2 ring-background">
                <AvatarImage src={assignee.avatarUrl} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {assignee.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-700 dark:text-gray-300">{assignee.name}</span>
            </div>
          ) : (
            <span className="text-xs text-gray-500 dark:text-gray-400">No assignee</span>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onViewDetails && (
                <DropdownMenuItem onClick={() => onViewDetails(String(id))}>
                  <EyeIcon className="h-4 w-4 mr-2" /> View Details
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(id)}>
                  <EditIcon className="h-4 w-4 mr-2" /> Edit Task
                </DropdownMenuItem>
              )}
              {onStatusChange && (
                <DropdownMenuItem onClick={() => onStatusChange(id, status === "completed" ? "pending" : "completed")}>
                  Mark as {status === "completed" ? "Pending" : "Completed"}
                </DropdownMenuItem>
              )}
              {onShare && (
                <DropdownMenuItem onClick={() => onShare(id)}>
                  Share Task
                </DropdownMenuItem>
              )}
              {onArchive && (
                <DropdownMenuItem onClick={() => onArchive(id)}>
                  Archive Task
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
