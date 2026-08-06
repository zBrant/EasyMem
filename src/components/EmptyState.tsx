import { Card, CardContent } from "@/components/ui/card"

export function EmptyState({ message }: { message: string }) {
  return (
    <Card className="h-full">
      <CardContent className="flex h-full min-h-32 items-center justify-center p-6 text-sm text-muted-foreground">
        {message}
      </CardContent>
    </Card>
  )
}
