import AppHeader from "@/components/layout/AppHeader";

// Shell for all app pages: top bar + centred content area.
export default function MainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <AppHeader />
      <main className="main-content">{children}</main>
    </>
  );
}
