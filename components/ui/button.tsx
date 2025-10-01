import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg"
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    { className, variant = "default", size = "default", asChild = false, children, ...props },
    ref
  ) => {
    const classes = cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      {
        "bg-blue-600 text-white hover:bg-blue-700": variant === "default",
        "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700": variant === "secondary",
        "hover:bg-gray-100 dark:hover:bg-gray-800": variant === "ghost",
        "text-blue-600 underline-offset-4 hover:underline": variant === "link",
      },
      {
        "h-10 px-4 py-2": size === "default",
        "h-9 rounded-md px-3": size === "sm",
        "h-11 rounded-md px-8": size === "lg",
      },
      className
    )

    if (asChild) {
      // Expect exactly one child element to render as the underlying component (e.g., Link or a)
      const child = React.Children.only(children) as React.ReactElement<any>
      return React.cloneElement(child, {
        className: cn(child.props?.className, classes),
        ref,
        ...props,
      })
    }

    return (
      <button className={classes} ref={ref as any} {...props}>
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }