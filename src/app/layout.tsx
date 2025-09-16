import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { SidebarNavigation } from "@/components/sidebar-navigation";
import { Header } from "@/components/header";
import AuthGuard from "@/components/AuthGuard";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="bg-default-50 flex h-screen">
            {/* Sidebar */}
            <aside className="bg-background border-default-200 w-64 border-r">
              <SidebarNavigation />
            </aside>

            {/* Main Content */}
            <main className="flex flex-1 flex-col overflow-hidden">
              <Header />

              {/* Page Content */}
              <div className="flex-1 overflow-auto">
                <AuthGuard>{children}</AuthGuard>
              </div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
