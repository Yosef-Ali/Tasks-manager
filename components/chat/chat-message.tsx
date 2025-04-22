import { format } from "date-fns"
import { Check, Copy } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Message } from "@/types/chat"
import { CodeBlock } from "./code-block"
import { useState } from "react"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ChatMessageProps {
  message: Message
  isConsecutive?: boolean
}

export function ChatMessage({ message, isConsecutive = false }: ChatMessageProps) {
  const isUser = message.sender === "user"
  const formattedTime = format(new Date(message.timestamp), "h:mm a")
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = () => {
    if (message.content) {
      navigator.clipboard.writeText(message.content).then(() => {
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      })
    }
  }

  return (
    <div
      className={cn(
        "flex items-start gap-3 group transition-opacity",
        isUser ? "justify-end" : "justify-start",
        isConsecutive ? "mt-1.5" : "mt-6",
      )}
    >
      {!isUser && !isConsecutive && (
        <Avatar className="h-9 w-9 mt-1 shadow-sm border border-primary/10">
          <AvatarFallback className="bg-primary/10 text-primary text-xs">AI</AvatarFallback>
          <AvatarImage src="/placeholder-logo.svg" alt="AI Assistant" />
        </Avatar>
      )}
      {!isUser && isConsecutive && <div className="w-9" />}

      <div className={cn(
        "flex flex-col max-w-[85%] relative",
        isUser ? "items-end" : "items-start"
      )}>
        {!isConsecutive && (
          <div className={cn(
            "flex items-center gap-2 mb-1.5",
            isUser ? "justify-end" : "justify-start"
          )}>
            <span className="text-sm font-medium">{message.senderName}</span>
            <span className="text-xs text-muted-foreground">{formattedTime}</span>
          </div>
        )}

        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 shadow-sm transition-colors",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-muted text-foreground dark:bg-secondary/50 rounded-tl-sm",
            isConsecutive && isUser
              ? "rounded-tr-2xl"
              : isConsecutive && !isUser
                ? "rounded-tl-2xl"
                : "",
            message.type === "code" && "p-0 bg-transparent shadow-none",
          )}
        >
          {message.type === "text" && (
            <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
          )}

          {message.type === "code" && <CodeBlock code={message.content} />}

          {message.type === "image" && (
            <div className="flex flex-col gap-2">
              <img
                src={message.content || "/placeholder.svg"}
                alt={message.caption || "Image"}
                className="rounded-md max-w-full max-h-[300px] object-contain"
              />
              {message.caption && <span className="text-xs text-muted-foreground text-center">{message.caption}</span>}
            </div>
          )}
        </div>

        {/* Show copy button on hover for non-user messages that are not images */}
        {!isUser && message.type !== "image" && (
          // <TooltipProvider delayDuration={300}>
          //   <Tooltip>
          //     <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute -right-9 top-0 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity",
              isCopied ? "text-green-500" : "text-muted-foreground"
            )}
            onClick={handleCopy}
            title={isCopied ? "Copied!" : "Copy message"} // Add title as fallback
          >
            {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
          //     </TooltipTrigger>
          //     <TooltipContent side="right" align="center" className="text-xs">
          //       {isCopied ? "Copied!" : "Copy message"}
          //     </TooltipContent>
          //   </Tooltip>
          // </TooltipProvider>
        )}

        {/* Time indicator for consecutive messages */}
        {isConsecutive && (
          <span className="text-[10px] text-muted-foreground px-2 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {formattedTime}
          </span>
        )}
      </div>

      {isUser && !isConsecutive && (
        <Avatar className="h-9 w-9 mt-1 shadow-sm">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">DS</AvatarFallback>
          <AvatarImage src="/placeholder-user.jpg" alt="Dr. Samuel" />
        </Avatar>
      )}
      {isUser && isConsecutive && <div className="w-9" />}
    </div>
  )
}
