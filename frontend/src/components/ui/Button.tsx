import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-70",
  {
    variants: {
      variant: {
        default: "bg-gradient-primary text-primary-foreground hover:shadow-md hover:brightness-105 active:brightness-95 active:translate-y-0.5",
        destructive: "bg-destructive/90 text-destructive-foreground hover:bg-destructive shadow-sm hover:shadow-destructive/30 active:translate-y-0.5",
        outline: "border-2 border-input bg-transparent hover:bg-accent/10 hover:text-accent-foreground active:bg-accent/20 active:translate-y-0.5",
        secondary: "bg-gradient-secondary text-secondary-foreground hover:shadow-md hover:brightness-105 active:brightness-95 active:translate-y-0.5",
        ghost: "hover:bg-accent/10 hover:text-accent-foreground active:bg-accent/20",
        link: "text-primary underline-offset-4 hover:underline decoration-2",
        gradient: "bg-gradient-accent text-accent-foreground hover:shadow-md hover:brightness-105 active:brightness-95 active:translate-y-0.5",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base font-semibold",
        xl: "h-14 rounded-xl px-10 text-lg font-semibold",
        icon: "h-10 w-10 rounded-xl",
      },
      fullWidth: {
        true: "w-full"
      },
      rounded: {
        full: "rounded-full",
        lg: "rounded-xl",
        md: "rounded-lg",
        none: "rounded-none"
      },
      shadow: {
        none: "shadow-none",
        sm: "shadow-sm",
        md: "shadow",
        lg: "shadow-md",
        xl: "shadow-lg"
      }
    },
    compoundVariants: [
      {
        variant: "outline",
        className: "border-opacity-50"
      },
      {
        variant: ["default", "secondary", "gradient"],
        className: "shadow-md"
      }
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "md",
      shadow: "none",
      fullWidth: false
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
