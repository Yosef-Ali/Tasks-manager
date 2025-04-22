import { MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"

export function ActivityTable() {
  return (
    <div className="bg-card rounded-lg border border-border shadow-sm">
      <div className="p-4 border-b border-border">
        <h3 className="font-medium text-foreground">Document Processing Status</h3>
        <p className="text-sm text-muted-foreground mt-1">45 documents in process</p>
      </div>

      <div className="p-4 border-b border-border">
        <div className="flex space-x-4">
          <div className="flex-1">
            <div className="text-sm font-medium mb-1 text-foreground">Authenticated</div>
            <div className="h-2 bg-secondary rounded-full">
              <div className="h-2 bg-primary rounded-full w-[40%]"></div>
            </div>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium mb-1 text-foreground">Under Review</div>
            <div className="h-2 bg-secondary rounded-full">
              <div className="h-2 bg-primary rounded-full w-[20%]"></div>
            </div>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium mb-1 text-foreground">Pending Submission</div>
            <div className="h-2 bg-secondary rounded-full">
              <div className="h-2 bg-primary rounded-full w-[10%]"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-secondary/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            <ActivityRow
              avatar="/placeholder.svg?height=40&width=40"
              name="Bethel Admin"
              action="submitted license renewal application"
              department="License Processing"
              time="2 minutes ago"
              status="pending"
            />
            <ActivityRow
              avatar="/placeholder.svg?height=40&width=40"
              name="Kalkidan"
              action="generated support letter"
              department="Document Processing"
              time="1 hour ago"
              status="completed"
            />
            <ActivityRow
              avatar="/placeholder.svg?height=40&width=40"
              name="Samuel"
              action="uploaded authenticated documents"
              department="Document Authentication"
              time="3 hours ago"
              status="in-progress"
            />
          </tbody>
        </table>
      </div>

      <div className="px-6 py-3 flex items-center justify-between border-t border-border">
        <div className="text-sm text-muted-foreground">Showing 1-10 of 45 tasks</div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="text-sm font-normal border-border bg-card hover:bg-secondary text-foreground"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-sm font-normal border-border bg-card hover:bg-secondary text-foreground"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

interface ActivityRowProps {
  avatar: string
  name: string
  action: string
  department: string
  time: string
  status: "pending" | "completed" | "in-progress"
}

function ActivityRow({ avatar, name, action, department, time, status }: ActivityRowProps) {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 rounded-full">
            <img src={avatar || "/placeholder.svg"} alt={name} />
          </Avatar>
          <div className="ml-3">
            <div className="text-sm font-medium text-foreground">{name}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-foreground">{action}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-foreground">{department}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-muted-foreground">{time}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 py-1 inline-flex text-xs leading-4 font-medium rounded-full ${
            status === "pending"
              ? "bg-yellow-900 text-yellow-300"
              : status === "completed"
                ? "bg-green-900 text-green-300"
                : "bg-blue-900 text-blue-300"
          }`}
        >
          {status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button className="text-muted-foreground hover:text-foreground">
          <MoreVertical className="h-5 w-5" />
        </button>
      </td>
    </tr>
  )
}
