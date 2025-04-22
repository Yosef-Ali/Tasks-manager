"use client"

import { useState, useRef, useEffect } from "react"
import { Send, X, History, Loader2 } from "lucide-react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { ChatMessage } from "./chat-message"
import { useToast } from "@/hooks/use-toast"

const ChatPage = () => {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive"
      })
    }
  })

  const [showHistory, setShowHistory] = useState(false)
  const messageEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Mock chat history - this would normally come from a database
  const chatHistory = [
    { id: 1, title: "General Questions", lastUpdated: "10 min ago" },
    { id: 2, title: "Patient Inquiries", lastUpdated: "2h ago" },
    { id: 3, title: "Lab Results Discussion", lastUpdated: "Yesterday" },
    { id: 4, title: "Treatment Options", lastUpdated: "2 days ago" }
  ]

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex h-full overflow-hidden">
      {/* History panel - only shown when toggled */}
      {showHistory && (
        <div className="w-72 border-r h-full animate-in slide-in-from-left overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b h-[65px]">
            <h3 className="font-medium">Chat History</h3>
            <Button variant="ghost" size="icon" onClick={() => setShowHistory(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="h-[calc(100%-65px)]">
            <div className="p-2 space-y-1">
              {chatHistory.map((chat) => (
                <Button
                  key={chat.id}
                  variant="ghost"
                  className="w-full justify-start text-left h-auto py-2 px-3"
                >
                  <div>
                    <div className="font-medium">{chat.title}</div>
                    <div className="text-xs text-muted-foreground">{chat.lastUpdated}</div>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        <div className="border-b p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={() => setShowHistory(!showHistory)}
            >
              <History className="h-5 w-5" />
            </Button>
            <h2 className="font-medium">Sodo AI Assistant</h2>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                <h3 className="text-lg font-medium">Welcome to Sodo Hospital AI Assistant</h3>
                <p className="text-muted-foreground mt-2">
                  How can I help you with your healthcare questions today?
                </p>
              </div>
            )}
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={{
                  id: message.id,
                  content: message.content,
                  timestamp: message.createdAt || new Date(),
                  sender: message.role === 'user' ? 'user' : 'bot',
                  senderName: message.role === 'user' ? 'You' : 'Sodo Assistant',
                  type: 'text'
                }}
                isConsecutive={
                  index > 0 &&
                  messages[index - 1].role === message.role &&
                  message.createdAt && messages[index - 1].createdAt &&
                  new Date(message.createdAt).getTime() -
                  new Date(messages[index - 1].createdAt!).getTime() <
                  300000
                }
              />
            ))}
            {isLoading && (
              <div className="flex items-center space-x-2 p-4 bg-muted/50 rounded-lg">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Sodo Assistant is thinking...</p>
              </div>
            )}
            <div ref={messageEndRef} />
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="border-t bg-background p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-2 relative">
              <Input
                placeholder="Type a message..."
                value={input}
                onChange={handleInputChange}
                className="flex-1 py-6 px-4 text-base"
                disabled={isLoading}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && input.trim()) {
                    e.preventDefault();
                    handleSubmit(e as any);
                  }
                }}
              />
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="shrink-0 absolute right-1 bottom-1 rounded-full w-10 h-10"
                aria-label="Send message"
              >
                {isLoading ?
                  <Loader2 className="h-5 w-5 animate-spin" /> :
                  <Send className="h-5 w-5" />
                }
              </Button>
            </div>
            <div className="text-xs text-muted-foreground mt-2 text-center">
              Press Enter to send, Shift+Enter for new line
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChatPage