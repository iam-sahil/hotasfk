import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SourceProvider } from "@/lib/source-context";
import { FavoritesProvider } from "@/lib/favorites-context";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { GlobalContextMenu } from "@/components/global-context-menu";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hot as fk | The hottest content from your favorite creators",
  description:
    "Discover the hottest content from your favorite creators across multiple platforms.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <GlobalContextMenu>
            <SourceProvider>
              <FavoritesProvider>
                <SidebarProvider>
                  <AppSidebar />
                  <SidebarInset>
                    <main className="px-3 md:px-6">{children}</main>
                  </SidebarInset>
                </SidebarProvider>
              </FavoritesProvider>
            </SourceProvider>
          </GlobalContextMenu>
        </ThemeProvider>
      </body>
    </html>
  );
}
