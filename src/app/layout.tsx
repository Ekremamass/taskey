import "./globals.css";
import Navigation from "@/ui/navigation/Navigation";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionProvider>
        <body className="antialiased">
          <Navigation />
          <div className="pt-20">
            <div className="flex">
              <div className="flex-1 p-4">{children}</div>
            </div>
          </div>
        </body>
      </SessionProvider>
    </html>
  );
}
