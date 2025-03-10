import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import "./globals.css";
import { ThemeProvider } from "@/components/dark-mode/theme-provider";
import { SessionProvider } from "next-auth/react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Separator } from "@radix-ui/react-separator";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { ModeToggle } from "@/components/dark-mode/ModeToggle";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <SessionProvider>
        <body className="antialiased">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                  <div className="flex flex-1 items-center justify-between h-full">
                    <div className="flex items-center gap-2 px-4">
                      <SidebarTrigger className="-ml-1" />
                      <Separator orientation="vertical" className="mr-2 h-4" />
                      <Breadcrumbs />
                    </div>
                    <div className="p-8">
                      <ModeToggle />
                    </div>
                  </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                  <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-4 2xl:p-6">
                    {children}
                  </div>
                  <Toaster />
                </div>
              </SidebarInset>
            </SidebarProvider>
          </ThemeProvider>
        </body>
      </SessionProvider>
    </html>
  );
}
