export type MessageType = "text" | "image" | "code" | "file"
export type SenderType = "user" | "bot"

export interface Message {
  id: string
  content: string
  timestamp: Date
  sender: SenderType
  senderName: string
  type: MessageType
  caption?: string
}
