import ChatPageClient from "@/components/pages/chat-page.client"

export default function ChatRoute() {
  try {
    return <ChatPageClient />
  } catch (error) {
    console.error("Error rendering ChatPageClient:", error)
    return <div>Error loading chat. Please check the console for details.</div>
  }
}
