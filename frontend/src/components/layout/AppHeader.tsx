// Top bar shown on every page inside the (main) route group.
export default function AppHeader() {
  return (
    <header className="app-header">
      <div className="app-header-inner">
        <span className="app-header-brand">
          <span className="app-header-mark" aria-hidden="true">
            SA
          </span>
          Student Admin
        </span>
        <span className="app-header-user" aria-label="Signed in as Pratiksha Patil">
          PP
        </span>
      </div>
    </header>
  );
}
