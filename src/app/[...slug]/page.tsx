import { AppShell } from "@/components/app-shell";
import { AuthPage } from "@/components/auth-page";
import { ProductPageRouter } from "@/components/page-router";
import { ToastProvider } from "@/components/ui";

type WorkspaceRouteProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function WorkspaceRoute({ params }: WorkspaceRouteProps) {
  const { slug } = await params;
  const path = slug.join("/");

  if (path === "login" || path === "register") {
    return (
      <ToastProvider>
        <AuthPage mode={path} />
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <AppShell>
        <ProductPageRouter path={path} />
      </AppShell>
    </ToastProvider>
  );
}
