import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import {
  BarChart3,
  Building2,
  FileUp,
  Compass,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
  X,
} from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { ThemeDropdown } from "../../components/ThemeDropdown";

const NAV_ITEMS = [
  { path: "/university", label: "Overview", icon: LayoutDashboard, exact: true },
  { path: "/university/upload", label: "Data Upload", icon: FileUp },
  { path: "/university/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/university/students", label: "Students", icon: Users },
];

export default function UniversityLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (item: (typeof NAV_ITEMS)[0]) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background flex">
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`fixed top-0 left-0 h-full w-64 bg-card dark:bg-card border-r border-border dark:border-border z-50 flex flex-col transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}>
        <div className="flex items-center justify-between px-5 h-16 border-b-4 border-border dark:border-border bg-card dark:bg-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary border-b-4 border-secondary flex items-center justify-center">
              <Compass className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-foreground dark:text-foreground" style={{ fontWeight: 900, fontSize: "1.125rem" }}>UniPath</span>
          </div>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-4 border-b border-border dark:border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent/30 dark:bg-accent/20 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-accent-foreground dark:text-accent" />
            </div>
            <div className="min-w-0">
              <div className="text-sm text-foreground dark:text-foreground truncate" style={{ fontWeight: 600 }}>Thammasat U.</div>
              <div className="text-xs text-muted-foreground">Partner Admin</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item);
            return (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setMobileOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${active ? "bg-primary dark:bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted dark:hover:bg-muted hover:text-foreground"}`}
                style={{ fontWeight: active ? 600 : 400 }}
              >
                <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-primary-foreground" : "text-muted-foreground"}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-border dark:border-border">
          <ThemeDropdown />
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all mt-2"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden sticky top-0 z-30 bg-card dark:bg-card border-b border-border h-14 flex items-center px-4 gap-3">
          <button onClick={() => setMobileOpen(true)} className="text-muted-foreground hover:text-foreground">
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-foreground" style={{ fontWeight: 700 }}>University Portal</span>
        </header>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}