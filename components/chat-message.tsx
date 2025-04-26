import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  // Don't render system messages
  if (message.role === "system") return null

  return (
    <div className={cn("flex items-start gap-3 max-w-[80%]", isUser ? "ml-auto" : "mr-auto")}>
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary/10 text-primary">AI</AvatarFallback>
        </Avatar>
      )}

      <div className={cn("rounded-lg p-3", isUser ? "bg-primary text-primary-foreground" : "bg-muted")}>
        <p className="whitespace-pre-wrap">{message.content}</p>
        <div className="mt-1 text-xs opacity-70">{formatTime(message.timestamp)}</div>
      </div>

      {isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-secondary">U</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date)
}
