"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      visibleToasts={1}
      position="top-right"
      className="toaster group"
      richColors={false}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "alert",
          success: "alert alert-success",
          error: "alert alert-error",
          info: "alert alert-info",
          warning: "alert alert-warning",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
