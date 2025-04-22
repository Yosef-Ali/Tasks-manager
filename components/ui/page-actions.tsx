import { Search, Filter, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface PageActionsProps {
  searchPlaceholder: string
  buttonText: string
}

export function PageActions({ searchPlaceholder, buttonText }: PageActionsProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
        <Input
          type="text"
          placeholder={searchPlaceholder}
          className="pl-10 w-64"
        />
      </div>
      <Button
        variant="outline"
        size="sm"
      >
        <Filter className="h-4 w-4 mr-2" />
        Filters
      </Button>
      <Button size="sm">
        <Plus className="h-4 w-4 mr-2" />
        {buttonText}
      </Button>
    </div>
  )
}
