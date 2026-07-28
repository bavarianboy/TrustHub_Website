import { type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, Inbox, Newspaper } from "lucide-react";
import { useLogout, getGetCurrentUserQueryKey, type AdminUser } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Leads", path: "/leads", icon: Inbox },
  { label: "Articles", path: "/articles", icon: Newspaper },
];

export function AdminLayout({ user, children }: { user: AdminUser; children: ReactNode }) {
  const [location] = useLocation();
  const queryClient = useQueryClient();
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSettled: () => {
        void queryClient.invalidateQueries({ queryKey: getGetCurrentUserQueryKey() });
      },
    });
  };

  return (
    <div className="min-h-screen flex bg-secondary">
      <aside className="w-64 shrink-0 bg-foreground text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <span className="font-serif font-bold text-lg">TRUST HUB</span>
          <span className="block text-xs text-white/60 uppercase tracking-wider">Admin</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location === item.path || (item.path === "/leads" && location === "/");
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-sm text-sm font-medium transition-colors ${
                  active ? "bg-primary text-primary-foreground" : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
                data-testid={`link-admin-nav-${item.label.toLowerCase()}`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-white/50 mb-3 truncate">{user.email}</p>
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
            onClick={handleLogout}
            disabled={logout.isPending}
            data-testid="button-admin-logout"
          >
            <LogOut size={14} className="me-2" />
            Log Out
          </Button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 overflow-x-hidden">
        <div className="p-6 md:p-10 max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
