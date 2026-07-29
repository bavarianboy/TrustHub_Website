import { Link } from "wouter";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";

const PAGES = [
  { path: "/pages/about", name: "About", description: "Our story, legacy, and values" },
  { path: "/pages/services", name: "Services", description: "The 6 service categories and their details" },
  { path: "/pages/workspace", name: "Workspace", description: "Workspace types, amenities, location, and FAQ" },
];

export function PagesList() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-foreground">Pages</h1>
        <p className="text-muted-foreground text-sm">
          Content for the About, Services, and Workspace marketing pages, in English and Arabic.
        </p>
      </div>

      <div className="bg-background border border-border rounded-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Page</TableHead>
              <TableHead>Contents</TableHead>
              <TableHead className="text-end">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PAGES.map((page) => (
              <TableRow key={page.path} data-testid={`row-page-${page.name.toLowerCase()}`}>
                <TableCell className="font-medium">{page.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{page.description}</TableCell>
                <TableCell className="text-end">
                  <Button variant="ghost" size="icon" asChild data-testid={`button-edit-page-${page.name.toLowerCase()}`}>
                    <Link href={page.path}>
                      <Pencil size={16} />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
