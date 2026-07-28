import { useEffect } from "react";
import { Router as WouterRouter, Switch, Route } from "wouter";
import { useGetCurrentUser, getGetCurrentUserQueryKey } from "@workspace/api-client-react";
import { AdminLayout } from "./AdminLayout";
import { Login } from "./pages/Login";
import { LeadsInbox } from "./pages/LeadsInbox";
import { ArticlesList } from "./pages/ArticlesList";
import { ArticleEditor } from "./pages/ArticleEditor";

function AdminGate() {
  // A normal, expected state for a fresh visitor is "not logged in" — don't
  // let react-query's default retries turn that into a multi-second spinner
  // before the login form appears.
  const { data: user, isLoading, isError } = useGetCurrentUser({
    query: { retry: false, queryKey: getGetCurrentUserQueryKey() },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (isError || !user) {
    return <Login />;
  }

  return (
    <AdminLayout user={user}>
      <Switch>
        <Route path="/" component={LeadsInbox} />
        <Route path="/leads" component={LeadsInbox} />
        <Route path="/articles" component={ArticlesList} />
        <Route path="/articles/new" component={ArticleEditor} />
        <Route path="/articles/:id" component={ArticleEditor} />
        <Route>
          <p className="text-muted-foreground">Page not found.</p>
        </Route>
      </Switch>
    </AdminLayout>
  );
}

export default function AdminApp() {
  const appBase = import.meta.env.BASE_URL.replace(/\/$/, "");

  // robots.txt disallows /admin, but that only stops well-behaved crawlers —
  // this belt-and-suspenders tag keeps the admin panel out of the index even
  // if a page is fetched directly.
  useEffect(() => {
    const tag = document.querySelector('meta[name="robots"]');
    const previous = tag?.getAttribute("content") ?? null;
    if (tag) tag.setAttribute("content", "noindex, nofollow");
    return () => {
      if (tag && previous) tag.setAttribute("content", previous);
    };
  }, []);

  return (
    <WouterRouter base={`${appBase}/admin`}>
      <AdminGate />
    </WouterRouter>
  );
}
