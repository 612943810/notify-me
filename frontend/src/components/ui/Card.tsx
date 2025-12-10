import * as React from "react"
import { cn } from "../utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'elevated' | 'gradient'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  hoverable?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant = 'default',
    rounded = 'lg',
    shadow = 'sm',
    hoverable = false,
    ...props 
  }, ref) => {
    const roundedClass = {
      'none': 'rounded-none',
      'sm': 'rounded-sm',
      'md': 'rounded-md',
      'lg': 'rounded-lg',
      'xl': 'rounded-xl',
      '2xl': 'rounded-2xl',
      '3xl': 'rounded-3xl',
      'full': 'rounded-full',
    }[rounded]

    const shadowClass = {
      'none': 'shadow-none',
      'sm': 'shadow-sm',
      'md': 'shadow',
      'lg': 'shadow-md',
      'xl': 'shadow-lg',
    }[shadow]

    const variantClass = {
      'default': 'bg-card border border-border/50',
      'outline': 'bg-transparent border-2 border-border/20',
      'elevated': 'bg-card/80 backdrop-blur-sm border border-border/10',
      'gradient': 'bg-gradient-to-br from-card to-card/80 border border-border/20',
    }[variant]

    return (
      <div
        ref={ref}
        className={cn(
          'transition-all duration-300',
          variantClass,
          roundedClass,
          shadowClass,
          hoverable && 'hover:shadow-lg hover:-translate-y-0.5',
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  withBorder?: boolean
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, withBorder = false, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn(
        "flex flex-col space-y-1.5 p-6 pb-3",
        withBorder && "border-b border-border/20",
        className
      )} 
      {...props} 
    />
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  }
>(({ className, as: Tag = 'h3', ...props }, ref) => (
  <Tag
    ref={ref}
    className={cn(
      "text-2xl font-bold leading-tight tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground/80 leading-relaxed", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn("p-6 pt-0", className)} 
    {...props} 
  />
))
CardContent.displayName = "CardContent"

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  withBorder?: boolean
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, withBorder = true, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center p-6 pt-4",
        withBorder && "border-t border-border/20",
        className
      )}
      {...props}
    />
  )
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
