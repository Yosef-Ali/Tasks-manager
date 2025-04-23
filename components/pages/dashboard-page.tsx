"use client";

import { useState, useEffect } from "react";
import type React from "react";
import { FileText, Clock, AlertCircle, ChevronUp, ChevronDown, MoreVertical, GripVertical, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusCard } from "@/components/dashboard/status-card";
import { DraggableTableRow, ActivityItem } from "@/components/dashboard/draggable-table-row";
import { TaskOverviewChart } from "@/components/dashboard/total-visitors-chart";
import { RecentDocumentsCard } from "@/components/dashboard/recent-documents-card";
import { PriorityBreakdownCard } from "@/components/dashboard/priority-breakdown-card";
import { DepartmentActivityCard } from "@/components/dashboard/department-activity-card";
import SeedButton from "@/components/SeedButton";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  // Fetch tasks and documents from Convex
  const convexTasks = useQuery(api.tasks.getTasks, {});
  const convexDocuments = useQuery(api.documents.getDocuments, {});

  const [activityItems, setActivityItems] = useState<ActivityItem[]>([]);
  const [pendingCount, setPendingCount] = useState("0");
  const [inProgressCount, setInProgressCount] = useState("0");
  const [completedCount, setCompletedCount] = useState("0");
  const [departmentStats, setDepartmentStats] = useState<{ name: string, count: number }[]>([]);
  const [priorityStats, setPriorityStats] = useState<{ priority: string, count: number }[]>([]);
  const [totalTasks, setTotalTasks] = useState(0);

  // Calculate document stats
  const [documentStats, setDocumentStats] = useState({
    required: 0,
    uploaded: 0,
    verified: 0,
    total: 0
  });

  // Transform Convex data to ActivityItems when it changes
  useEffect(() => {
    if (convexTasks) {
      // Count tasks by status, department, and priority
      const counts = {
        pending: 0,
        "in-progress": 0,
        completed: 0
      };

      const departments: Record<string, number> = {};
      const priorities: Record<string, number> = {};

      // Map Convex tasks to ActivityItems
      const items = convexTasks.map((task) => {
        // Count tasks by status
        if (task.status in counts) {
          counts[task.status as keyof typeof counts]++;
        }

        // Count by department
        const dept = task.location || "General";
        departments[dept] = (departments[dept] || 0) + 1;

        // Count by priority
        const priority = task.priority || "medium";
        priorities[priority] = (priorities[priority] || 0) + 1;

        // Format the created time as a relative time string
        const timeAgo = task.createdAt
          ? formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })
          : "Recently";

        // Format assignee data
        const assignee = typeof task.assignee === 'object' && task.assignee
          ? task.assignee
          : { name: task.assignee || 'Unassigned', avatarUrl: "/placeholder.svg?height=40&width=40" };

        return {
          id: task._id,
          avatar: assignee.avatarUrl || "/placeholder.svg?height=40&width=40",
          name: assignee.name || "Unknown",
          action: task.description || "",
          department: dept,
          time: timeAgo.replace("about ", "").replace("less than ", ""), // Simplify the time string
          status: task.status as "pending" | "in-progress" | "completed",
          priority: task.priority || "medium"
        };
      });

      // Sort by most recent first (items with "minutes" or "hours" come before "days")
      items.sort((a, b) => {
        if (a.time.includes("minute") && !b.time.includes("minute")) return -1;
        if (!a.time.includes("minute") && b.time.includes("minute")) return 1;
        if (a.time.includes("hour") && !b.time.includes("hour") && !b.time.includes("minute")) return -1;
        if (!a.time.includes("hour") && !a.time.includes("minute") && b.time.includes("hour")) return 1;
        return 0;
      });

      // Process department stats
      const deptStats = Object.entries(departments)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

      // Process priority stats
      const priorityStats = Object.entries(priorities)
        .map(([priority, count]) => ({ priority, count }))
        .sort((a, b) => {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return (priorityOrder[a.priority as keyof typeof priorityOrder] || 99) -
            (priorityOrder[b.priority as keyof typeof priorityOrder] || 99);
        });

      // Update state
      setActivityItems(items);
      setPendingCount(counts.pending.toString());
      setInProgressCount(counts["in-progress"].toString());
      setCompletedCount(counts.completed.toString());
      setDepartmentStats(deptStats);
      setPriorityStats(priorityStats);
      setTotalTasks(items.length);
    }
  }, [convexTasks]);

  // Process document stats when documents change
  useEffect(() => {
    if (convexDocuments) {
      const docStats = {
        required: 0,
        uploaded: 0,
        verified: 0,
        total: convexDocuments.length
      };

      convexDocuments.forEach(doc => {
        if (doc.status === "required") docStats.required++;
        if (doc.status === "uploaded") docStats.uploaded++;
        if (doc.status === "verified") docStats.verified++;
      });

      setDocumentStats(docStats);
    }
  }, [convexDocuments]);

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

      {/* Seed Data Button */}
      <div className="mt-4 mb-2">
        <SeedButton />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <StatusCard
          title="Pending Tasks"
          value={pendingCount}
          percentage={totalTasks > 0 ? Math.round((parseInt(pendingCount) / totalTasks) * 100) : 0}
        />
        <StatusCard
          title="In Progress"
          value={inProgressCount}
          percentage={totalTasks > 0 ? Math.round((parseInt(inProgressCount) / totalTasks) * 100) : 0}
        />
        <StatusCard
          title="Completed"
          value={completedCount}
          percentage={totalTasks > 0 ? Math.round((parseInt(completedCount) / totalTasks) * 100) : 0}
        />
        <StatusCard
          title="Total Documents"
          value={documentStats.total.toString()}
          percentage={documentStats.verified / (documentStats.total || 1) * 100}
        />
      </div>

      {/* Charts and Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Task Overview Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Task Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskOverviewChart />
          </CardContent>
        </Card>

        {/* Department Activity */}
        <DepartmentActivityCard stats={departmentStats} totalTasks={totalTasks} />
      </div>

      {/* Priority Breakdown and Recent Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Priority Breakdown */}
        <PriorityBreakdownCard stats={priorityStats} totalTasks={totalTasks} />

        {/* Recent Documents */}
        <RecentDocumentsCard documents={convexDocuments || []} />
      </div>

      {/* Activity Table */}
      <div className="bg-card rounded-lg border border-border shadow-sm mt-6">
        <div className="p-4 border-b border-border">
          <h3 className="font-medium text-foreground">Recent Activity</h3>
          <p className="text-sm text-muted-foreground mt-1">{convexTasks?.length || 0} tasks in total</p>
        </div>

        <div className="p-4 border-b border-border">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="text-sm font-medium mb-1 text-foreground">Pending</div>
              <div className="h-2 bg-yellow-100 rounded-full dark:bg-yellow-900/20">
                <div className="h-2 bg-yellow-500 rounded-full" style={{ width: `${totalTasks ? (parseInt(pendingCount) / totalTasks) * 100 : 0}%` }}></div>
              </div>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium mb-1 text-foreground">In Progress</div>
              <div className="h-2 bg-blue-100 rounded-full dark:bg-blue-900/20">
                <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${totalTasks ? (parseInt(inProgressCount) / totalTasks) * 100 : 0}%` }}></div>
              </div>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium mb-1 text-foreground">Completed</div>
              <div className="h-2 bg-green-100 rounded-full dark:bg-green-900/20">
                <div className="h-2 bg-green-500 rounded-full" style={{ width: `${totalTasks ? (parseInt(completedCount) / totalTasks) * 100 : 0}%` }}></div>
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
                  {activityItems.slice(0, 10).map(item => (
                    <DraggableTableRow key={item.id} item={item} />
                  ))}
                </SortableContext>
              </tbody>
            </table>
          </DndContext>
        </div>

        <div className="px-6 py-3 flex items-center justify-between border-t border-border">
          <div className="text-sm text-muted-foreground">Showing {Math.min(activityItems.length, 10)} of {activityItems.length} tasks</div>
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
