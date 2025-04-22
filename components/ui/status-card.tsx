interface StatusCardProps {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative" | "neutral"
}

export function StatusCard({ title, value, change, changeType }: StatusCardProps) {
  return (
    <div className="bg-card rounded-lg border border-border shadow-sm p-6">
      <div className="text-sm text-muted-foreground font-medium">{title}</div>
      <div className="flex items-baseline mt-2">
        <div className="text-3xl font-bold text-foreground">{value}</div>
        <div
          className={`ml-2 text-xs font-medium ${
            changeType === "positive" ? "text-green-500" : changeType === "negative" ? "text-red-500" : "text-gray-500"
          }`}
        >
          {change}
        </div>
      </div>
    </div>
  )
}
