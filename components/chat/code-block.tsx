"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  code: string
  language?: string
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false)

  // Extract code content and language from markdown-style code blocks
  const codeContent = code.replace(/^```(\w+)?\n/, "").replace(/```$/, "")
  const detectedLanguage = language || code.match(/^```(\w+)/)?.[1] || "plaintext"

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeContent)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="relative rounded-lg overflow-hidden bg-secondary/50 dark:bg-secondary/30">
      <div className="flex items-center justify-between px-4 py-2 bg-secondary/70 dark:bg-secondary/50 text-secondary-foreground">
        <span className="text-xs font-medium">{detectedLanguage}</span>
        <button
          onClick={copyToClipboard}
          className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors"
          title="Copy code"
        >
          {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm">
        <code className={cn("language-" + detectedLanguage)}>{codeContent}</code>
      </pre>
    </div>
  )
}
