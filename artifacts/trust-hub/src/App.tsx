import { Suspense, lazy } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { MainLayout } from "@/components/layout/MainLayout";
import { Home } from "@/pages/Home";
import { About } from "@/pages/About";
import { Services } from "@/pages/Services";
import { Contact } from "@/pages/Contact";
import { News } from "@/pages/News";
import { NewsArticle } from "@/pages/NewsArticle";
import { Workspace } from "@/pages/Workspace";
import { LegalPage } from "@/pages/LegalPage";
import { useLocale } from "@/hooks/useLocale";

// Admin isn't part of the public, bilingual marketing site — it's English-only
// and excluded from robots.txt — so it's lazy-loaded rather than shipped in
// every visitor's bundle.
const AdminApp = lazy(() => import("@/admin/AdminApp"));

const queryClient = new QueryClient();

function MarketingRouter() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/services" component={Services} />
        <Route path="/news" component={News} />
        <Route path="/news/:slug" component={NewsArticle} />
        <Route path="/workspace" component={Workspace} />
        <Route path="/contact" component={Contact} />
        <Route path="/privacy">
          <LegalPage page="privacy" path="/privacy" />
        </Route>
        <Route path="/terms">
          <LegalPage page="terms" path="/terms" />
        </Route>
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function MarketingSite() {
  const { localeBase } = useLocale();
  const appBase = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <WouterRouter base={`${appBase}${localeBase}`}>
      <MarketingRouter />
    </WouterRouter>
  );
}

function App() {
  const [rawLocation] = useLocation();
  const isAdmin = rawLocation === "/admin" || rawLocation.startsWith("/admin/");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {isAdmin ? (
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                Loading…
              </div>
            }
          >
            <AdminApp />
          </Suspense>
        ) : (
          <MarketingSite />
        )}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
