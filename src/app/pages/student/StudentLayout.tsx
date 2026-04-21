import { useState, useRef, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import {
  ChevronDown,
  ChevronUp,
  GraduationCap,
  FileSearch,
  FileText,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  Menu,
  Search,
  Target,
  User,
  X,
  Link,
} from "lucide-react";
import { useApp } from "../../contexts/AppContext.tsx";
import { ThemeDropdown } from "../../components/ThemeDropdown.tsx";

const NAV_ITEMS = [
  { path: "/student", label: "Dashboard", icon: LayoutDashboard, exact: true, partnerOnly: false },
  { path: "/student/profile", label: "My Profile", icon: User, partnerOnly: false },
  { path: "/student/upload", label: "Upload Curriculum", icon: FileText, partnerOnly: false, hideForPartner: true },
  { path: "/student/roles", label: "Browse Roles", icon: Search, partnerOnly: false },
  { path: "/student/custom", label: "Custom Analysis", icon: Target, partnerOnly: false },
  { path: "/student/projects", label: "Saved Projects", icon: Lightbulb, partnerOnly: false },
];

/** Animated expand/collapse container */
function ExpandSection({ expanded, children }: { expanded: boolean; children: React.ReactNode }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (innerRef.current) {
      setHeight(innerRef.current.scrollHeight);
    }
  }, [children, expanded]);

  return (
    <div
      style={{
        maxHeight: expanded ? height : 0,
        overflow: "hidden",
        transition: "max-height 320ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div ref={innerRef}>{children}</div>
    </div>
  );
}

export default function StudentLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, studentProfile, savedRoles, savedProjects, userName } = useApp();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [trackedExpanded, setTrackedExpanded] = useState(false);

  const isPartner = studentProfile.accountType === "partner";

  const isActive = (item: (typeof NAV_ITEMS)[0]) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const visibleNavItems = NAV_ITEMS.filter((item) => !(isPartner && item.hideForPartner));

  const VISIBLE_TRACKED = 3;
  const visibleRoles = savedRoles.slice(0, VISIBLE_TRACKED);
  const extraRoles = savedRoles.slice(VISIBLE_TRACKED);
  const hasMore = savedRoles.length > VISIBLE_TRACKED;

  const TrackedRoleButton = ({ sr }: { sr: (typeof savedRoles)[0] }) => {
    const isCustomActive = location.pathname === `/student/custom/${sr.roleId}`;
    const isRoleActive = location.pathname === `/student/roles/${sr.roleId}`;
    const active = sr.isCustomJD ? isCustomActive : isRoleActive;

    return (
      <button
        key={sr.roleId}
        onClick={() => {
          if (sr.isCustomJD) {
            navigate(`/student/custom/${sr.roleId}`);
          } else {
            navigate(`/student/roles/${sr.roleId}`);
          }
          setMobileOpen(false);
        }}
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all font-bold ${
          active
            ? sr.isCustomJD
              ? "bg-secondary/30 dark:bg-secondary/20 text-secondary-foreground border-2 border-accent"
              : "bg-accent/30 dark:bg-accent/20 text-accent-foreground border-2 border-accent"
            : "text-muted-foreground dark:text-muted-foreground hover:bg-muted dark:hover:bg-muted hover:text-foreground dark:hover:text-foreground border-2 border-transparent"
        }`}
      >
        {sr.isCustomJD ? (
          <FileSearch className="w-4 h-4 text-secondary-foreground dark:text-accent flex-shrink-0" />
        ) : (
          <Target className="w-4 h-4 text-muted-foreground dark:text-muted-foreground flex-shrink-0" />
        )}
        <span className="truncate">
          {sr.isCustomJD
            ? (sr.customTitle ?? sr.roleId)
            : sr.roleId
                .replace(/-/g, " ")
                .replace(/^jd__/, "")
                .replace(/\b\w/g, (c) => c.toUpperCase())}
        </span>
        {sr.isCustomJD && (
          <span className="ml-auto text-xs font-black text-secondary-foreground bg-secondary/50 dark:bg-secondary/30 px-1.5 py-0.5 rounded-md border border-accent flex-shrink-0">
            JD
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-card border-r border-gray-100 dark:border-border z-50 flex flex-col transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 h-16 border-b-4 border-accent bg-white dark:bg-card dark:border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary border-b-4 border-secondary flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-foreground" style={{ fontWeight: 900, fontSize: "1.125rem" }}>
              UniPath
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User info */}
        <div className="px-6 py-5 border-b-2 border-border bg-muted">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center flex-shrink-0 shadow-sm ${
                isPartner
                  ? "bg-accent/30 dark:bg-accent/20 border-accent"
                  : "bg-accent border-accent"
              }`}
            >
              <span
                className={`text-lg ${isPartner ? "text-accent-foreground dark:text-accent-foreground" : "text-secondary dark:text-foreground"}`}
                style={{ fontWeight: 900 }}
              >
                {(userName || studentProfile.name).charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <div className="text-sm text-foreground truncate" style={{ fontWeight: 800 }}>
                {userName || studentProfile.name}
              </div>
              <div
                className={`text-xs font-bold truncate flex items-center gap-1 ${
                  isPartner ? "text-accent-foreground" : "text-muted-foreground"
                }`}
              >
                {isPartner ? (
                  <>
                    <Link className="w-3 h-3" /> Partner Student
                  </>
                ) : (
                  "Personal Student"
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {visibleNavItems.map((item) => {
            const active = isActive(item);
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm transition-all font-bold ${
                  active
                    ? "bg-primary dark:bg-primary text-white shadow-md border-b-4 border-secondary dark:border-secondary hover:bg-primary/90 dark:hover:bg-accent"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground border-b-4 border-transparent hover:border-border"
                }`}
                style={{ fontWeight: active ? 800 : 700 }}
              >
                <item.icon
                  className={`w-5 h-5 flex-shrink-0 ${active ? "text-white" : "text-muted-foreground"}`}
                />
                {item.label}
                {item.label === "Saved Projects" && savedProjects.length > 0 && (
                  <span
                    className={`ml-auto text-xs px-2 py-0.5 rounded-lg ${
                      active ? "bg-primary dark:bg-secondary text-primary-foreground dark:text-secondary-foreground" : "bg-accent/30 dark:bg-accent/20 text-accent-foreground dark:text-accent"
                    }`}
                  >
                    {savedProjects.length}
                  </span>
                )}
              </button>
            );
          })}

          {/* ── Tracked Roles Section ── */}
          {savedRoles.length > 0 && (
            <div className="pt-6 mt-6 border-t-2 border-border">
              <div className="flex items-center justify-between px-4 mb-3">
                <div className="text-xs text-muted-foreground uppercase tracking-widest" style={{ fontWeight: 900 }}>
                  Tracked Roles
                </div>
                <span className="text-xs font-black text-muted-foreground bg-muted px-2 py-0.5 rounded-lg border border-border">
                  {savedRoles.length}
                </span>
              </div>

              {/* Always-visible first 3 */}
              <div className="space-y-0.5">
                {visibleRoles.map((sr) => (
                  <TrackedRoleButton key={sr.roleId} sr={sr} />
                ))}
              </div>

              {/* Expandable extra roles */}
              {hasMore && (
                <>
                  <ExpandSection expanded={trackedExpanded}>
                    <div className="space-y-0.5 pt-0.5">
                      {extraRoles.map((sr) => (
                        <TrackedRoleButton key={sr.roleId} sr={sr} />
                      ))}
                    </div>
                  </ExpandSection>

                  <button
                    onClick={() => setTrackedExpanded((v) => !v)}
                    className="mt-2 w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all text-primary dark:text-primary hover:bg-accent dark:hover:bg-secondary hover:text-accent-foreground dark:hover:text-secondary-foreground border-2 border-transparent hover:border-border dark:hover:border-accent"
                  >
                    {trackedExpanded ? (
                      <>
                        <ChevronUp className="w-3.5 h-3.5" />
                        See less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3.5 h-3.5" />
                        See {extraRoles.length} more
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          )}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t-2 border-border bg-muted space-y-2">
          {/* Theme Toggle */}
          <ThemeDropdown />
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 dark:hover:bg-destructive/20 dark:hover:text-destructive border-2 border-transparent transition-all font-bold"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-30 bg-card border-b-4 border-border h-16 flex items-center px-4 gap-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-muted-foreground hover:text-foreground bg-muted p-2 rounded-xl"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary border-b-2 border-primary/20 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-foreground" style={{ fontWeight: 900, fontSize: "1rem" }}>
              UniPath
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}