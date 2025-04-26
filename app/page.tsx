import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { MessageSquare, BarChart3, BookOpen } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto max-w-5xl">
      <div className="flex flex-col items-center text-center py-12 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Mental Health Assistant</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Your private, AI-powered companion for mental wellness and emotional support.
        </p>

        <div className="flex gap-4 mt-6">
          <Link href="/chat">
            <Button size="lg">Start Chatting</Button>
          </Link>
          <Link href="/mood-tracker">
            <Button size="lg" variant="outline">
              Track Your Mood
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader>
            <MessageSquare className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>AI Chat Support</CardTitle>
            <CardDescription>Talk about your feelings and get supportive responses</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Our AI assistant is available 24/7 to listen, provide coping strategies, and offer emotional support.
            </p>
            <Link href="/chat">
              <Button variant="link" className="p-0 mt-4">
                Start a conversation →
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <BarChart3 className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Mood Tracking</CardTitle>
            <CardDescription>Monitor your emotional wellbeing over time</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Track your daily mood patterns to gain insights into your emotional health and identify triggers.
            </p>
            <Link href="/mood-tracker">
              <Button variant="link" className="p-0 mt-4">
                Track your mood →
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <BookOpen className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Journal</CardTitle>
            <CardDescription>Express yourself through private journaling</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Write down your thoughts and feelings in a secure, private journal to process emotions.
            </p>
            <Link href="/journal">
              <Button variant="link" className="p-0 mt-4">
                Write in journal →
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-16 text-center">
        <p className="text-sm text-muted-foreground">
          If you're experiencing a mental health emergency, please call your local crisis line or emergency services.
        </p>
        <Link href="/crisis-resources">
          <Button variant="link" className="text-sm">
            View crisis resources
          </Button>
        </Link>
      </div>
    </div>
  )
}
