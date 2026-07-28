import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { LoginBody } from "@workspace/api-zod";
import { useLogin, getGetCurrentUserQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type LoginValues = z.infer<typeof LoginBody>;

export function Login() {
  const queryClient = useQueryClient();
  const login = useLogin();

  const form = useForm<LoginValues>({
    resolver: zodResolver(LoginBody),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: LoginValues) => {
    login.mutate(
      { data: values },
      {
        onSuccess: () => {
          void queryClient.invalidateQueries({ queryKey: getGetCurrentUserQueryKey() });
        },
      },
    );
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-secondary px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-serif text-2xl">Trust Hub Admin</CardTitle>
          <CardDescription>Sign in to manage leads and articles.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" autoComplete="username" data-testid="input-login-email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="current-password" data-testid="input-login-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {login.isError && (
                <p className="text-sm text-destructive" data-testid="text-login-error">
                  Invalid email or password.
                </p>
              )}
              <Button type="submit" className="w-full" disabled={login.isPending} data-testid="button-login-submit">
                {login.isPending ? "Signing in…" : "Sign In"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
