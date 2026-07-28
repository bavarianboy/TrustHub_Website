import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Download } from "lucide-react";
import {
  useAdminListLeads,
  useAdminUpdateLeadStatus,
  getAdminListLeadsQueryKey,
  LeadStatus,
  type Lead,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";

const STATUS_FILTERS = ["all", ...Object.values(LeadStatus)] as const;

const STATUS_VARIANT: Record<string, string> = {
  new: "bg-primary text-primary-foreground",
  contacted: "bg-amber-500 text-white",
  closed: "bg-muted text-muted-foreground",
};

function toCsvValue(value: string | null | undefined): string {
  const s = (value ?? "").replace(/"/g, '""');
  return `"${s}"`;
}

function downloadCsv(leads: Lead[]) {
  const header = ["Name", "Email", "Phone", "Company", "Service", "Message", "Locale", "Status", "Created At"];
  const rows = leads.map((l) =>
    [l.name, l.email, l.phone, l.company, l.service, l.message, l.locale, l.status, l.createdAt].map(toCsvValue).join(","),
  );
  const csv = [header.map(toCsvValue).join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `trust-hub-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function LeadsInbox() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]>("all");

  const { data: leads, isLoading, isError } = useAdminListLeads(
    statusFilter === "all" ? undefined : { status: statusFilter },
  );
  const updateStatus = useAdminUpdateLeadStatus();

  const sorted = useMemo(
    () => [...(leads ?? [])].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [leads],
  );

  const handleStatusChange = (id: string, status: string) => {
    updateStatus.mutate(
      { id, data: { status: status as (typeof LeadStatus)[keyof typeof LeadStatus] } },
      {
        onSuccess: () => {
          void queryClient.invalidateQueries({ queryKey: getAdminListLeadsQueryKey() });
        },
      },
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Leads</h1>
          <p className="text-muted-foreground text-sm">Contact form submissions from the public site.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={!sorted.length}
          onClick={() => downloadCsv(sorted)}
          data-testid="button-export-csv"
        >
          <Download size={14} className="me-2" />
          Export CSV
        </Button>
      </div>

      <div className="flex gap-2 mb-6" data-testid="leads-status-filter">
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            data-testid={`button-filter-${status}`}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border capitalize ${
              statusFilter === status
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      )}

      {isError && <p className="text-destructive">Couldn't load leads. You may need to log in again.</p>}

      {!isLoading && !isError && sorted.length === 0 && (
        <p className="text-muted-foreground text-center py-16">No leads yet.</p>
      )}

      {!isLoading && !isError && sorted.length > 0 && (
        <div className="bg-background border border-border rounded-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((lead) => (
                <TableRow key={lead.id} data-testid={`row-lead-${lead.id}`}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {lead.name}
                    {lead.company && <div className="text-xs text-muted-foreground">{lead.company}</div>}
                  </TableCell>
                  <TableCell className="whitespace-nowrap" dir="ltr">
                    <div>{lead.email}</div>
                    {lead.phone && <div className="text-xs text-muted-foreground">{lead.phone}</div>}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{lead.service || "—"}</TableCell>
                  <TableCell className="max-w-xs">
                    <p className="line-clamp-2 text-sm text-muted-foreground">{lead.message}</p>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Select value={lead.status} onValueChange={(status) => handleStatusChange(lead.id, status)}>
                      <SelectTrigger className="w-32 h-8" data-testid={`select-lead-status-${lead.id}`}>
                        <SelectValue>
                          <Badge className={`${STATUS_VARIANT[lead.status]} border-0 capitalize`}>{lead.status}</Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(LeadStatus).map((status) => (
                          <SelectItem key={status} value={status} className="capitalize">
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
