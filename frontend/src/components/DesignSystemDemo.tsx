import * as React from "react"
import { Button } from "./ui/Button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/Card"

export function DesignSystemDemo() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Buttons Showcase */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Buttons
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Buttons */}
            <Card variant="elevated" className="p-6">
              <h3 className="text-lg font-semibold mb-4">Primary Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <Button>Default</Button>
                <Button variant="gradient">Gradient</Button>
                <Button size="lg">Large</Button>
                <Button size="sm">Small</Button>
                <Button disabled>Disabled</Button>
              </div>
            </Card>

            {/* Secondary Buttons */}
            <Card variant="elevated" className="p-6">
              <h3 className="text-lg font-semibold mb-4">Secondary Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
            </Card>
          </div>
        </section>

        {/* Cards Showcase */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Cards
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Default Card */}
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Default Card</CardTitle>
                <CardDescription>With a simple border and subtle shadow</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p>This is a basic card with some sample content. Cards are great for grouping related content.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="mr-2">Cancel</Button>
                <Button size="sm">Action</Button>
              </CardFooter>
            </Card>

            {/* Gradient Card */}
            <Card variant="gradient" className="h-full">
              <CardHeader>
                <CardTitle>Gradient Card</CardTitle>
                <CardDescription>With a beautiful gradient background</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This card has a subtle gradient background that works well in both light and dark modes.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="mr-2">Learn More</Button>
              </CardFooter>
            </Card>

            {/* Elevated Card with Hover */}
            <Card variant="elevated" hoverable className="h-full">
              <CardHeader>
                <CardTitle>Elevated Card</CardTitle>
                <CardDescription>Hover over me!</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This card has a subtle elevation effect and hover animation. Try hovering over it!</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="mr-2">Dismiss</Button>
                <Button size="sm">Continue</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Color Palette */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Color Palette
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ColorSwatch name="Primary" color="bg-primary" textColor="text-primary-foreground" />
            <ColorSwatch name="Secondary" color="bg-secondary" textColor="text-secondary-foreground" />
            <ColorSwatch name="Accent" color="bg-accent" textColor="text-accent-foreground" />
            <ColorSwatch name="Destructive" color="bg-destructive" textColor="text-destructive-foreground" />
          </div>
        </section>
      </div>
    </div>
  )
}

function ColorSwatch({ name, color, textColor }: { name: string; color: string; textColor: string }) {
  return (
    <Card className="overflow-hidden">
      <div className={`h-20 ${color} flex items-end p-4`}>
        <span className={`text-sm font-medium ${textColor}`}>{name}</span>
      </div>
      <div className="p-4">
        <div className="text-sm font-mono">{color.replace('bg-', '')}</div>
        <div className="text-xs text-muted-foreground mt-1">{textColor.replace('text-', '')}</div>
      </div>
    </Card>
  )
}
