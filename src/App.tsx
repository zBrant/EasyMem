import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Cache &amp; Memory Simulator</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Bootstrap complete. Ready to build.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
