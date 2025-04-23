"use client";

import { useState } from "react";
import type React from "react";
import { FileText, Clock, AlertCircle, ChevronUp, ChevronDown, MoreVertical, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { StatusCard } from "@/components/dashboard/status-card";
import { MetricCard } from "@/components/dashboard/metric-card";
import { DraggableTableRow, ActivityItem } from "@/components/dashboard/draggable-table-row";
import { TaskOverviewChart } from "@/components/dashboard/total-visitors-chart"; // Updated import name

// For drag-and-drop functionality
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";

function DashboardPage() {
  const [activityItems, setActivityItems] = useState<ActivityItem[]>([
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
  ]);

  // Set up sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setActivityItems((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="p-6 bg-background min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Administrative Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">Track document processing and administrative tasks</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Updated props: replaced change and changeType with percentage */}
        <StatusCard title="Pending Tasks" value="12" percentage={25} />
        <StatusCard title="In Progress" value="24" percentage={50} />
        <StatusCard title="Completed" value="45" percentage={75} />
      </div>

      {/* Replace Metric Cards with Task Overview Chart */}
      <div className="mt-6">
        <TaskOverviewChart /> {/* Updated component name */}
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
                    <DraggableTableRow key={item.id} item={item} />
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
  );
}

export default DashboardPage;
