import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Phone, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function CrisisResourcesPage() {
  return (
    <div className="container mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Crisis Resources</h1>
        <p className="text-muted-foreground mt-2">
          If you're experiencing a mental health emergency, please reach out to one of these resources for immediate
          help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center text-red-700 dark:text-red-400">
              <Phone className="mr-2 h-5 w-5" />
              Emergency Services
            </CardTitle>
            <CardDescription>For immediate danger to yourself or others</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold mb-2">Call 999 (Kenya) or your local emergency number</p>
            <p className="text-sm mb-4">
              If you or someone you know is in immediate danger or at risk of harming themselves or others, call
              emergency services right away.
            </p>
            <Button variant="destructive" className="w-full">
              <Phone className="mr-2 h-4 w-4" />
              Call Emergency Services
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="mr-2 h-5 w-5" />
              Crisis Hotlines
            </CardTitle>
            <CardDescription>24/7 support for mental health crises</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">National Suicide Prevention Lifeline (Kenya)</h3>
              <p className="text-lg font-bold">999</p>
              <p className="text-sm text-muted-foreground">
                24/7, free and confidential support for people in distress
              </p>
            </div>

            <div>
              <h3 className="font-medium">Crisis Text Line (Kenya)</h3>
              <p className="text-lg font-bold">Text HOME to 741741</p>
              <p className="text-sm text-muted-foreground">24/7 text support with a trained crisis counselor</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Online Resources
            </CardTitle>
            <CardDescription>Websites and apps for support and information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Nairobi Mental Health Services (NMHS)</h3>
              <Link href="https://www.nmhs.or.ke" target="_blank" rel="noopener noreferrer">
                <Button variant="link" className="p-0 h-auto text-primary">
                  www.nmhs.or.ke
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">
                Information, resources, and support for individuals and families
              </p>
            </div>

            <div>
              <h3 className="font-medium">Mental Health Kenya</h3>
              <Link href="https://www.mhanational.org" target="_blank" rel="noopener noreferrer">
                <Button variant="link" className="p-0 h-auto text-primary">
                  www.mhanational.org
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">Mental health screening tools and resources</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>International Resources</CardTitle>
            <CardDescription>Crisis support services around the world</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">International Association for Suicide Prevention</h3>
              <Link href="https://www.iasp.info/resources/Crisis_Centres/" target="_blank" rel="noopener noreferrer">
                <Button variant="link" className="p-0 h-auto text-primary">
                  Find a Crisis Center
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">Directory of crisis centers around the world</p>
            </div>

            <div>
              <h3 className="font-medium">Befrienders Worldwide</h3>
              <Link href="https://www.befrienders.org" target="_blank" rel="noopener noreferrer">
                <Button variant="link" className="p-0 h-auto text-primary">
                  www.befrienders.org
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">
                Volunteer support to people in emotional distress or at risk of suicide
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 p-4 bg-muted rounded-lg text-center">
        <p className="text-sm">
          Remember, it's okay to ask for help. These resources are available to support you through difficult times.
        </p>
        <Link href="/chat">
          <Button variant="link" className="text-sm">
            Return to AI Assistant
          </Button>
        </Link>
      </div>
    </div>
  )
}
