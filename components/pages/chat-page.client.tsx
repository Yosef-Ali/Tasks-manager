"use client"

import ChatPage from "@/components/chat/chat-page"

export default function ChatPageClient() {
    return (
        <div className="h-[calc(100vh-130px)] overflow-hidden border-2">
            <ChatPage />
        </div>
    )
}