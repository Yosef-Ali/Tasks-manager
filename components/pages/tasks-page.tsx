"use client"

import { useState } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Plus, Calendar, SortAsc } from "lucide-react"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TaskCard } from "@/components/ui/task-card"

// Task type definition based on the instructions
export interface Task {
  id: string
  title: string
  description: string
  type: string
  assignedTo: string
  deadline: string
  placeOfWork: string
  status: "pending" | "in-progress" | "under-review" | "completed"
  requiredDocuments: string[]
  priority: "low" | "medium" | "high"
  createdAt: string
}

// Sample tasks data
const initialTasks: Task[] = [
  {
    id: "task-1",
    title: "License Renewal Processing",
    description: "Review and process hospital license renewal applications from various departments.",
    type: "Administrative",
    assignedTo: "Dr. Samuel",
    deadline: "2023-05-15",
    placeOfWork: "Main Office",
    status: "pending",
    requiredDocuments: ["Application Form", "Previous License", "Compliance Report"],
    priority: "high",
    createdAt: "2023-05-01",
  },
  {
    id: "task-2",
    title: "Patient Record Verification",
    description: "Verify and update patient records in the system to ensure accuracy and completeness.",
    type: "Records",
    assignedTo: "Nurse Johnson",
    deadline: "2023-05-20",
    placeOfWork: "Records Department",
    status: "in-progress",
    requiredDocuments: ["Patient Files", "Verification Form"],
    priority: "medium",
    createdAt: "2023-05-02",
  },
  {
    id: "task-3",
    title: "Medical Supply Inventory",
    description: "Conduct inventory check of medical supplies and update the procurement list.",
    type: "Inventory",
    assignedTo: "Store Manager",
    deadline: "2023-05-25",
    placeOfWork: "Storage Facility",
    status: "pending",
    requiredDocuments: ["Inventory Sheet", "Purchase Orders"],
    priority: "low",
    createdAt: "2023-05-03",
  },
  {
    id: "task-4",
    title: "Staff Training Documentation",
    description: "Update training records for all staff who completed the recent infection control workshop.",
    type: "Training",
    assignedTo: "HR Director",
    deadline: "2023-05-10",
    placeOfWork: "Training Center",
    status: "completed",
    requiredDocuments: ["Attendance Sheets", "Certification Records"],
    priority: "medium",
    createdAt: "2023-05-04",
  },
  {
    id: "task-5",
    title: "Equipment Maintenance Schedule",
    description: "Create maintenance schedule for all critical medical equipment for the next quarter.",
    type: "Maintenance",
    assignedTo: "Maintenance Head",
    deadline: "2023-05-18",
    placeOfWork: "Engineering Department",
    status: "under-review",
    requiredDocuments: ["Equipment List", "Maintenance History"],
    priority: "high",
    createdAt: "2023-05-05",
  },
  {
    id: "task-6",
    title: "Insurance Claim Processing",
    description: "Process pending insurance claims for patients treated in the last month.",
    type: "Finance",
    assignedTo: "Finance Officer",
    deadline: "2023-05-22",
    placeOfWork: "Finance Department",
    status: "in-progress",
    requiredDocuments: ["Claim Forms", "Patient Billing Records"],
    priority: "medium",
    createdAt: "2023-05-06",
  },
]

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter tasks based on active tab and search query
  const filteredTasks = tasks.filter((task) => {
    // Filter by tab
    if (activeTab !== "all" && task.status !== activeTab) {
      return false
    }

    // Filter by search query
    if (
      searchQuery &&
      !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !task.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !task.type.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    return true
  })

  // Count tasks by status
  const taskCounts = {
    all: tasks.length,
    pending: tasks.filter((task) => task.status === "pending").length,
    "in-progress": tasks.filter((task) => task.status === "in-progress").length,
    "under-review": tasks.filter((task) => task.status === "under-review").length,
    completed: tasks.filter((task) => task.status === "completed").length,
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

          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
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
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New Task
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              title={task.title}
              description={task.description}
              status={task.status}
              dueDate={task.deadline}
              assignee={task.assignedTo}
              category={task.type}
              priority={task.priority}
              requiredDocuments={task.requiredDocuments}
            />
          ))}
        </div>
      )}
    </div>
  )
}
