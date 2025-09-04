import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/providers/QueryProvider";
import { ActionCableProvider } from "@/providers/ActionCableProvider";
import { AuthProvider } from "@/providers/AuthProvider";

export const metadata = {
  title: {
    default: "Sun*タッチ",
  },
  icons: {
    icon: "susti-sunbear.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ActionCableProvider>
          <QueryProvider>
            <AuthProvider>{children}</AuthProvider>
          </QueryProvider>
        </ActionCableProvider>
        <Toaster />
      </body>
    </html>
  );
}
