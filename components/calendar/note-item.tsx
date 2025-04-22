import { cn } from "@/lib/utils"
import type { Note } from "@/types/calendar"

interface NoteItemProps {
  note: Note
  isCompact?: boolean
}

export function NoteItem({ note, isCompact = false }: NoteItemProps) {
  return (
    <div
      className={cn(
        "rounded-md overflow-hidden border-l-4 bg-card shadow-sm hover:shadow transition-all",
        isCompact ? "p-1" : "p-2",
        `border-l-${note.color}-500`,
      )}
      style={{ borderLeftColor: getColorValue(note.color) }}
    >
      <div className={cn("font-medium truncate text-card-foreground", isCompact ? "text-xs" : "text-sm")}>{note.title}</div>
      {!isCompact && note.description && (
        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{note.description}</div>
      )}
    </div>
  )
}

// Helper function to get actual color values
function getColorValue(color: string): string {
  const colorMap: Record<string, string> = {
    blue: "#3b82f6",
    red: "#ef4444",
    green: "#10b981",
    yellow: "#f59e0b",
    purple: "#8b5cf6",
    pink: "#ec4899",
    indigo: "#6366f1",
  }

  return colorMap[color] || colorMap.blue
}
