"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Plus, Calendar, SortAsc, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TaskCard } from "@/components/ui/task-card"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { formatDistanceToNow, parseISO } from "date-fns"
import { Id } from "@/convex/_generated/dataModel"
import { Card, CardContent } from "@/components/ui/card"
import dynamic from 'next/dynamic'
import { Task, TaskSchema } from "@/types/task"
import { z } from "zod"

// Use dynamic import for task-sheet to prevent circular dependencies
const TaskSheet = dynamic(() => import("../sheets/task-sheet").then(mod => mod.TaskSheet), {
  ssr: false,
  loading: () => <div>Loading task form...</div>
})

// Use dynamic import for task-action-sheet
const TaskActionSheet = dynamic(() => import("../sheets/task-action-sheet").then(mod => mod.TaskActionSheet), {
  ssr: false,
  loading: () => <div>Loading actions...</div>
})

export function TasksPage() {
  // Fetch tasks from Convex
  const convexTasks = useQuery(api.tasks.getTasks, {});
  const updateTask = useMutation(api.tasks.updateTask);

  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTaskId, setSelectedTaskId] = useState<Id<"tasks"> | null>(null)
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false)
  const [isTaskSheetOpen, setIsTaskSheetOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const createTask = useMutation(api.tasks.createTask)

  // Handle loading state
  useEffect(() => {
    setIsLoading(convexTasks === undefined);
  }, [convexTasks]);

  // Handler for changing task status
  const handleStatusChange = async (id: Id<"tasks">, newStatus: string) => {
    try {
      await updateTask({
        id,
        status: newStatus
      });
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  // Handler for editing a task
  const handleEditTask = (id: Id<"tasks">) => {
    // Find the task to edit
    const taskToEdit = convexTasks?.find(task => task._id === id) || null;
    setEditingTask(taskToEdit);
    setIsTaskSheetOpen(true);
  };

  // Handler for creating a new task
  const handleCreateTask = () => {
    setEditingTask(null);
    setIsTaskSheetOpen(true);
  };

  // Handler for submitting a task (create or update)
  const handleTaskSubmit = async (formData: z.infer<typeof TaskSchema>) => {
    try {
      if (editingTask) {
        // Update existing task - combine form data with existing task data
        await updateTask({
          id: editingTask._id,
          title: formData.title,
          description: formData.description ?? "", // Use nullish coalescing to provide a default value
          status: formData.status,
          priority: formData.priority,
          dueDate: formData.dueDate ? formData.dueDate.toISOString() : "",
          taskType: formData.taskType,
          location: formData.location ?? "", // Use nullish coalescing to provide a default value
          // Keep existing values for fields not in the form
          assigneeId: editingTask.assigneeId
        });
      } else {
        // Create new task with required fields
        await createTask({
          title: formData.title,
          description: formData.description ?? "", // Use nullish coalescing to provide a default value
          status: formData.status,
          priority: formData.priority,
          dueDate: formData.dueDate ? formData.dueDate.toISOString() : "",
          taskType: formData.taskType,
          location: formData.location ?? "", // Use nullish coalescing to provide a default value
          // Add required fields not in the form
          assigneeId: "dummy_assignee_id" as Id<"users">, // Replace with actual user ID
          completedSteps: [],
          totalSteps: 0,
          creatorId: "dummy_creator_id" as Id<"users">, // Replace with actual user ID
          createdAt: new Date().toISOString()
        });
      }

      // Close the task sheet after successful submission
      setIsTaskSheetOpen(false);
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  };

  // Handler for viewing task details
  const handleViewTask = (id: string) => {
    // Open the action sheet with the selected task
    console.log("Opening task details for:", id);
    setSelectedTaskId(id as Id<"tasks">);
    setIsActionSheetOpen(true);
    // Add console log to confirm state was updated
    console.log("Action sheet should be open:", true);
    console.log("Selected task ID:", id);
  };

  // Handler for closing the action sheet
  const handleCloseActionSheet = () => {
    setIsActionSheetOpen(false);
  };

  // Handler for deleting a task
  const handleDeleteTask = (id: Id<"tasks">) => {
    console.log("Delete task:", id);
    // Here you would implement the actual delete functionality
    // and close the action sheet when done
    setIsActionSheetOpen(false);
  };

  // Filter tasks based on active tab and search query
  const filteredTasks = convexTasks ? convexTasks.filter((task) => {
    // Filter by tab
    if (activeTab !== "all" && task.status !== activeTab) {
      return false
    }

    // Filter by search query
    if (
      searchQuery &&
      !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !(task.description || "").toLowerCase().includes(searchQuery.toLowerCase()) &&
      !(task.assignee?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) &&
      !task.taskType.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    return true
  }) : [];

  // Count tasks by status
  const taskCounts = {
    all: convexTasks?.length || 0,
    pending: convexTasks?.filter((task) => task.status === "pending").length || 0,
    "in-progress": convexTasks?.filter((task) => task.status === "in-progress").length || 0,
    "under-review": convexTasks?.filter((task) => task.status === "under-review").length || 0,
    completed: convexTasks?.filter((task) => task.status === "completed").length || 0,
  }

  return (
    <div className="p-8">
      <PageHeader title="Tasks" description="Manage and track all your hospital administrative tasks in one place." />

      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="h-10">
            <TabsTrigger
              value="all"
              className="flex items-center gap-1.5"
            >
              All <Badge variant="outline" className="ml-0.5">{taskCounts.all}</Badge>
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="flex items-center gap-1.5"
            >
              Pending <Badge className="ml-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/20">{taskCounts.pending}</Badge>
            </TabsTrigger>
            <TabsTrigger
              value="in-progress"
              className="flex items-center gap-1.5"
            >
              In Progress <Badge className="ml-0.5 bg-blue-500/10 text-blue-500 border border-blue-500/20">{taskCounts["in-progress"]}</Badge>
            </TabsTrigger>
            <TabsTrigger
              value="under-review"
              className="flex items-center gap-1.5"
            >
              Under Review <Badge className="ml-0.5 bg-sky-500/10 text-sky-500 border border-sky-500/20">{taskCounts["under-review"]}</Badge>
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="flex items-center gap-1.5"
            >
              Completed <Badge className="ml-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">{taskCounts.completed}</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Search tasks..."
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
                Due Date
              </DropdownMenuItem>
              <DropdownMenuItem>
                <SortAsc className="h-4 w-4 mr-2" />
                Priority
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button size="sm" onClick={handleCreateTask}>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading tasks...</span>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="bg-card rounded-lg border border-border p-8 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No tasks found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? "No tasks match your search criteria. Try adjusting your search."
              : "There are no tasks in this category. Create a new task to get started."}
          </p>
          <Button onClick={handleCreateTask}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Task
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => {
            // Calculate document completion stats
            const documents = task.documents || [];
            const documentCount = documents.length;
            const completedDocuments = documents.filter(doc => doc.status === "verified").length;

            // Format assignee data for the TaskCard
            const assigneeData = task.assignee ? {
              id: task.assignee._id,
              name: task.assignee.name,
              avatarUrl: task.assignee.avatarUrl
            } : undefined;

            return (
              <TaskCard
                key={task._id}
                id={task._id}
                title={task.title}
                description={task.description}
                dueDate={new Date(task.dueDate)}
                status={task.status}
                taskType={task.taskType}
                priority={task.priority}
                assignee={assigneeData}
                location={task.location}
                documentCount={task.totalSteps}
                completedDocuments={task.completedSteps.length}
                onStatusChange={handleStatusChange}
                onEdit={handleEditTask}
                onViewDetails={handleViewTask}
                onArchive={(id) => console.log("Archive task:", id)}
                onShare={(id) => console.log("Share task:", id)}
              />
            );
          })}
        </div>
      )}

      {/* Action Sheet for task details and actions */}
      {!isLoading && convexTasks && (
        <TaskActionSheet
          isOpen={isActionSheetOpen}
          onClose={handleCloseActionSheet}
          task={convexTasks.find(task => task._id === selectedTaskId) || null}
          onStatusChange={handleStatusChange}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onShare={(id) => console.log("Share task:", id)}
        />
      )}

      {/* Task Sheet for creating/editing tasks */}
      <TaskSheet
        open={isTaskSheetOpen}
        onOpenChange={setIsTaskSheetOpen}
        onFormSubmit={handleTaskSubmit}
        initialData={editingTask ? {
          title: editingTask.title,
          description: editingTask.description,
          status: editingTask.status,
          priority: editingTask.priority,
          dueDate: editingTask.dueDate ? new Date(editingTask.dueDate) : undefined,
          taskType: editingTask.taskType,
          location: editingTask.location
        } : undefined}
      />
    </div>
  )
}
