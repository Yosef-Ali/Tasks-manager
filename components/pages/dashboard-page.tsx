"use client"

import { useState } from "react"
import type React from "react"
import { FileText, Clock, AlertCircle, ChevronUp, ChevronDown, MoreVertical, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { SortableTableRow } from "@/components/ui/sortable-table-row"

// For drag-and-drop functionality
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

function DashboardPage() {
  const [activityItems, setActivityItems] = useState([
    {
      id: "activity-1",
      avatar: "/placeholder.svg?height=40&width=40",
      name: "Bethel Admin",
      action: "submitted license renewal application",
      department: "License Processing",
      time: "2 minutes ago",
      status: "pending" as const
    },
    {
      id: "activity-2",
      avatar: "/placeholder.svg?height=40&width=40",
      name: "Kalkidan",
      action: "generated support letter",
      department: "Document Processing",
      time: "1 hour ago",
      status: "completed" as const
    },
    {
      id: "activity-3",
      avatar: "/placeholder.svg?height=40&width=40",
      name: "Samuel",
      action: "uploaded authenticated documents",
      department: "Document Authentication",
      time: "3 hours ago",
      status: "in-progress" as const
    }
  ])

  // Set up sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setActivityItems((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id)
        const newIndex = items.findIndex(item => item.id === over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  return (
    <div className="p-6 bg-background min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Administrative Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">Track document processing and administrative tasks</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <StatusCard title="Pending Tasks" value="12" change="+2.5%" changeType="positive" />
        <StatusCard title="In Progress" value="24" change="+5.0%" changeType="positive" />
        <StatusCard title="Completed" value="45" change="+12.5%" changeType="positive" />
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <MetricCard
          icon={<FileText className="h-5 w-5 text-foreground" />}
          title="Document Processing"
          value="156"
          subtext="Active documents"
          change="+12.5%"
          changeType="positive"
          items={[
            { label: "License Renewals", value: "45%" },
            { label: "Support Letters", value: "35%" },
            { label: "Authentication", value: "20%" },
          ]}
          footer="24 documents need review"
          buttonText="View Details"
        />

        <MetricCard
          icon={<Clock className="h-5 w-5 text-foreground" />}
          title="Processing Time"
          value="4.2"
          subtext="Processing duration"
          change="-2.3"
          changeType="positive"
          items={[
            { label: "License Processing", value: "3.5 days" },
            { label: "Document Auth", value: "4.8 days" },
            { label: "Letter Generation", value: "1.2 days" },
          ]}
          footer="8 tasks overdue"
          buttonText="View Details"
        />

        <MetricCard
          icon={<AlertCircle className="h-5 w-5 text-foreground" />}
          title="Pending Approvals"
          value="32"
          subtext="Awaiting review"
          change="-4.3%"
          changeType="negative"
          items={[
            { label: "Ministry Of Labor", value: "12" },
            { label: "HERQA", value: "8" },
            { label: "Internal", value: "12" },
          ]}
          footer="5 urgent approvals needed"
          buttonText="View Details"
        />
      </div>

      {/* Document Processing Status */}
      <div className="bg-card rounded-lg border border-border shadow-sm mt-6">
        <div className="p-4 border-b border-border">
          <h3 className="font-medium text-foreground">Document Processing Status</h3>
          <p className="text-sm text-muted-foreground mt-1">45 documents in process</p>
        </div>

        <div className="p-4 border-b border-border">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="text-sm font-medium mb-1 text-foreground">Authenticated</div>
              <div className="h-2 bg-primary/20 rounded-full">
                <div className="h-2 bg-primary rounded-full w-[40%]"></div>
              </div>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium mb-1 text-foreground">Under Review</div>
              <div className="h-2 bg-primary/20 rounded-full">
                <div className="h-2 bg-primary rounded-full w-[20%]"></div>
              </div>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium mb-1 text-foreground">Pending Submission</div>
              <div className="h-2 bg-primary/20 rounded-full">
                <div className="h-2 bg-primary rounded-full w-[10%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Table with Draggable Rows */}
        <div className="overflow-x-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="w-10 px-2"></th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                <SortableContext items={activityItems.map(item => item.id)} strategy={verticalListSortingStrategy}>
                  {activityItems.map(item => (
                    <SortableTableRow key={item.id} item={item} />
                  ))}
                </SortableContext>
              </tbody>
            </table>
          </DndContext>
        </div>

        <div className="px-6 py-3 flex items-center justify-between border-t border-border">
          <div className="text-sm text-muted-foreground">Showing 1-10 of 45 tasks</div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="text-sm font-normal">
              Previous
            </Button>
            <Button variant="outline" size="sm" className="text-sm font-normal">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Draggable Table Row Component
interface ActivityItem {
  id: string
  avatar: string
  name: string
  action: string
  department: string
  time: string
  status: "pending" | "completed" | "in-progress"
}

function DraggableTableRow({ item }: { item: ActivityItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? "opacity-50" : ""} hover:bg-secondary/20 transition-colors`}
    >
      <td className="px-2 py-4 w-10 text-center">
        <div
          className="flex items-center justify-center cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 rounded-full">
            <img src={item.avatar || "/placeholder.svg"} alt={item.name} />
          </Avatar>
          <div className="ml-3">
            <div className="text-sm font-medium text-muted-foreground">{item.name}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="text-sm text-muted-foreground">{item.action}</div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="text-sm text-muted-foreground">{item.department}</div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="text-sm text-muted-foreground">{item.time}</div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <span
          className={`px-2 py-1 inline-flex text-xs leading-4 font-medium rounded-full ${item.status === "pending"
            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
            : item.status === "completed"
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
            }`}
        >
          {item.status}
        </span>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button className="text-muted-foreground hover:text-foreground">
          <MoreVertical className="h-5 w-5" />
        </button>
      </td>
    </tr>
  )
}

interface StatusCardProps {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative" | "neutral"
}

function StatusCard({ title, value, change, changeType }: StatusCardProps) {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden hover:border-primary/20 transition-all duration-200 p-6">
      <div className="text-sm text-muted-foreground font-medium">{title}</div>
      <div className="flex items-baseline mt-2">
        <div className="text-3xl font-bold text-foreground">{value}</div>
        <div
          className={`ml-2 text-xs font-medium ${changeType === "positive" ? "text-green-500" : changeType === "negative" ? "text-red-500" : "text-muted-foreground"
            }`}
        >
          {change}
        </div>
      </div>
    </div>
  )
}

interface MetricCardProps {
  icon: React.ReactNode
  title: string
  value: string
  subtext: string
  change: string
  changeType: "positive" | "negative" | "neutral"
  items: { label: string; value: string }[]
  footer: string
  buttonText: string
}

function MetricCard({ icon, title, value, subtext, change, changeType, items, footer, buttonText }: MetricCardProps) {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden hover:border-primary/20 transition-all duration-200">
      <div className="p-6 border-b border-border">
        <div className="flex justify-between items-start">
          <div className="bg-secondary/50 p-2 rounded-md">{icon}</div>
          <div
            className={`flex items-center text-xs font-medium ${changeType === "positive"
              ? "text-green-500"
              : changeType === "negative"
                ? "text-red-500"
                : "text-muted-foreground"
              }`}
          >
            {changeType === "positive" ? (
              <ChevronUp className="h-3 w-3 mr-1" />
            ) : changeType === "negative" ? (
              <ChevronDown className="h-3 w-3 mr-1" />
            ) : null}
            {change}
          </div>
        </div>
        <div className="mt-4">
          <div className="text-sm text-muted-foreground font-medium">{title}</div>
          <div className="flex items-baseline mt-1">
            <div className="text-3xl font-bold text-foreground">{value}</div>
            <div className="ml-2 text-xs text-muted-foreground">{subtext}</div>
          </div>
        </div>
      </div>
      <div className="px-6 py-4">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between py-1">
            <div className="text-sm text-muted-foreground">{item.label}</div>
            <div className="text-sm text-muted-foreground">{item.value}</div>
          </div>
        ))}
      </div>
      <div className="px-6 py-4 border-t border-border">
        <div className="text-xs text-amber-600 mb-3">{footer}</div>
        <button className="text-xs text-primary font-medium hover:text-primary/80 transition-colors duration-200">{buttonText}</button>
      </div>
    </div>
  )
}

export default DashboardPage;
