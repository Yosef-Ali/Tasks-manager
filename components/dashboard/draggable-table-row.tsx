import type React from "react";
import { MoreVertical, GripVertical } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Draggable Table Row Component
export interface ActivityItem {
    id: string;
    avatar: string;
    name: string;
    action: string;
    department: string;
    time: string;
    status: "pending" | "completed" | "in-progress";
}

export function DraggableTableRow({ item }: { item: ActivityItem }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <tr
            ref={setNodeRef}
            style={style}
            className={`${isDragging ? "opacity-50" : ""
                } hover:bg-secondary/20 transition-colors`}
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
                        <div className="text-sm font-medium text-muted-foreground">
                            {item.name}
                        </div>
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
    );
}