"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Download, Shield, Bell, Moon } from "lucide-react"

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [dataRetention, setDataRetention] = useState("30")
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated.",
    })
  }

  const handleExportData = () => {
    // In a real app, this would generate and download user data
    toast({
      title: "Data export initiated",
      description: "Your data will be prepared for download.",
    })
  }

  const handleDeleteAccount = () => {
    if (isDeleting) {
      // In a real app, this would delete the user's account
      toast({
        title: "Account deleted",
        description: "Your account and all associated data have been deleted.",
        variant: "destructive",
      })
      setIsDeleting(false)
    } else {
      setIsDeleting(true)
    }
  }

  return (
    <div className="container mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Moon className="mr-2 h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>Customize how the application looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Enable dark mode for a more comfortable experience in low light
                </p>
              </div>
              <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Mood Check-in Reminders</Label>
                <p className="text-sm text-muted-foreground">Receive daily reminders to check in with your mood</p>
              </div>
              <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Privacy & Data
            </CardTitle>
            <CardDescription>Control your data and privacy settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="data-retention">Data Retention Period</Label>
              <p className="text-sm text-muted-foreground mb-2">Choose how long to keep your mood and journal data</p>
              <Select value={dataRetention} onValueChange={setDataRetention}>
                <SelectTrigger id="data-retention">
                  <SelectValue placeholder="Select a retention period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                  <SelectItem value="forever">Forever</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 space-y-4">
              <div>
                <Button variant="outline" className="w-full" onClick={handleExportData}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Your Data
                </Button>
              </div>

              <div>
                <Button
                  variant={isDeleting ? "destructive" : "outline"}
                  className="w-full"
                  onClick={handleDeleteAccount}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {isDeleting ? "Confirm Deletion" : "Delete Account & Data"}
                </Button>
                {isDeleting && (
                  <p className="text-sm text-destructive mt-2">
                    This action is permanent and cannot be undone. All your data will be permanently deleted.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSaveSettings}>Save Settings</Button>
        </div>
      </div>
    </div>
  )
}
