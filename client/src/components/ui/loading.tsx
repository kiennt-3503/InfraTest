import * as React from "react";
import { cn } from "@/lib/utils";

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
  fullscreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  className,
  size = "xl",
  fullscreen = true,
  ...props
}) => {
  const sizeClass = {
    sm: "loading-sm",
    md: "loading-md",
    lg: "loading-lg",
    xl: "loading-xl",
  }[size];

  return (
    <div
      className={cn(
        "flex items-center justify-center w-full",
        fullscreen ? "h-screen" : "h-full",
        className
      )}
      {...props}
    >
      <span className={cn("loading loading-spinner", sizeClass)} />
    </div>
  );
};
