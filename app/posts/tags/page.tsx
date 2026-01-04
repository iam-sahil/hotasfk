import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

export default async function TagsPage() {
  // Mock tags since we don't have a confirmed endpoint format
  const tags = [
    "cosplay",
    "bikini",
    "lingerie",
    "video",
    "photo",
    "exclusive",
    "outdoor",
    "indoor",
    "selfie",
    "professional",
    "bts",
    "chat",
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Tags</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              Popular Tags
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Browse content by category and style.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center max-w-4xl mx-auto">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="px-4 py-2 text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
