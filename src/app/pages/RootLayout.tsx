import { Outlet, useLocation, useNavigate } from "react-router";
import { useEffect, Component, ReactNode } from "react";
import { AppProvider } from "../contexts/AppContext.tsx";
import { ThemeProvider } from "../contexts/ThemeContext.tsx";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

// Simple error boundary to keep errors inside the provider tree
interface ErrorBoundaryState { hasError: boolean; error: Error | null }
class RouteErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-8">
          <div className="bg-card border-2 border-destructive/30 rounded-3xl p-8 max-w-md w-full text-center shadow-lg">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 border-2 border-destructive/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-foreground mb-2" style={{ fontWeight: 900, fontSize: "1.25rem" }}>
              Something went wrong
            </h2>
            <p className="text-muted-foreground text-sm font-medium mb-6">
              {this.state.error?.message ?? "An unexpected error occurred."}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = "/";
              }}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-black text-sm hover:bg-primary/90 transition-all border-b-4 border-secondary active:border-b-0 active:translate-y-1"
            >
              Back to Login
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppProvider>
        <RouteErrorBoundary>
          <ScrollToTop />
          <Outlet />
        </RouteErrorBoundary>
      </AppProvider>
    </ThemeProvider>
  );
}
