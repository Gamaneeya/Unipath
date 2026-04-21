import { useState } from "react";
import { X, Plus, Check, Search, TrendingUp } from "lucide-react";
import { JOB_ROLES } from "../data/mockData";
import { useApp } from "../contexts/AppContext";

interface AddRolesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddRolesModal({ isOpen, onClose }: AddRolesModalProps) {
  const { getRoleMatch, saveRole, isRoleSaved } = useApp();
  const [search, setSearch] = useState("");
  const [recentlyAdded, setRecentlyAdded] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const handleAddRole = (roleId: string) => {
    saveRole(roleId);
    setRecentlyAdded((prev) => new Set([...prev, roleId]));
    // Clear the "added" state after animation
    setTimeout(() => {
      setRecentlyAdded((prev) => {
        const next = new Set(prev);
        next.delete(roleId);
        return next;
      });
    }, 2000);
  };

  // Filter to show only unsaved roles
  const availableRoles = JOB_ROLES.filter((role) => !isRoleSaved(role.id))
    .filter((role) => {
      if (!search) return true;
      return (
        role.title.toLowerCase().includes(search.toLowerCase()) ||
        role.category.toLowerCase().includes(search.toLowerCase()) ||
        role.requiredSkills.some((s) => s.toLowerCase().includes(search.toLowerCase()))
      );
    })
    .map((role) => ({ ...role, match: getRoleMatch(role.id) }))
    .sort((a, b) => b.match.percentage - a.match.percentage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card dark:bg-card rounded-3xl border-4 border-border shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-4 border-border">
          <div>
            <h2 className="text-foreground" style={{ fontSize: "1.75rem", fontWeight: 900 }}>
              Add Target Roles
            </h2>
            <p className="text-muted-foreground text-sm font-semibold mt-1">
              Select roles to track on your dashboard
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 pb-0">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-border text-sm focus:outline-none focus:ring-4 focus:ring-accent/20 focus:border-accent bg-muted font-bold text-foreground placeholder:text-muted-foreground"
              placeholder="Search roles or skills…"
              autoFocus
            />
          </div>
        </div>

        {/* Results count */}
        <div className="px-6 pt-4 text-xs text-muted-foreground font-bold uppercase tracking-widest">
          {availableRoles.length} available {availableRoles.length === 1 ? "role" : "roles"}
        </div>

        {/* Roles list */}
        <div className="flex-1 overflow-y-auto p-6 pt-4">
          {availableRoles.length === 0 ? (
            <div className="text-center py-16 bg-muted rounded-2xl border-2 border-dashed border-border">
              <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground font-bold">
                {search ? "No roles match your search" : "All roles are already saved!"}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {availableRoles.map(({ match, ...role }) => {
                const matchColor =
                  match.percentage >= 70
                    ? "text-accent-foreground bg-accent/30 dark:bg-accent/20 border-accent"
                    : match.percentage >= 50
                    ? "text-secondary-foreground bg-secondary/30 dark:bg-secondary/20 border-accent"
                    : "text-destructive-foreground bg-destructive/20 border-destructive/40";
                const barColor =
                  match.percentage >= 70
                    ? "bg-accent"
                    : match.percentage >= 50
                    ? "bg-secondary"
                    : "bg-destructive";

                const isAdded = recentlyAdded.has(role.id);

                return (
                  <div
                    key={role.id}
                    className="bg-card rounded-2xl border-2 border-border p-5 hover:border-accent hover:shadow-md transition-all"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3
                          className="text-foreground text-base truncate"
                          style={{ fontWeight: 900 }}
                        >
                          {role.title}
                        </h3>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide mt-0.5">
                          {role.category}
                        </p>
                      </div>
                      <span
                        className={`ml-3 text-xs px-2.5 py-1 rounded-lg border ${matchColor} flex-shrink-0`}
                        style={{ fontWeight: 900 }}
                      >
                        {match.percentage}%
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed mb-4 line-clamp-2">
                      {role.description}
                    </p>

                    {/* Match bar */}
                    <div className="mb-4">
                      <div className="h-2 bg-muted rounded-full overflow-hidden shadow-inner">
                        <div
                          className={`h-full ${barColor} rounded-full transition-all duration-500`}
                          style={{ width: `${match.percentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs font-bold text-muted-foreground mt-1.5">
                        <span>{match.acquired.length} acquired</span>
                        <span>{match.missing.length} missing</span>
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="flex items-center gap-1.5 text-xs font-black text-muted-foreground bg-muted border border-border px-2.5 py-1 rounded-lg">
                        <TrendingUp className="w-3.5 h-3.5" />
                        {role.avgSalary}
                      </span>
                      <span className={`text-xs font-black px-2.5 py-1 rounded-lg border ${
                        role.demand === "High"
                          ? "bg-accent/30 dark:bg-accent/20 text-accent-foreground border-accent"
                          : role.demand === "Medium"
                          ? "bg-secondary/30 dark:bg-secondary/20 text-secondary-foreground border-accent"
                          : "bg-muted text-muted-foreground border-border"
                      }`}>
                        {role.demand} Demand
                      </span>
                    </div>

                    {/* Add button */}
                    <button
                      onClick={() => handleAddRole(role.id)}
                      disabled={isAdded}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm transition-all ${
                        isAdded
                          ? "bg-accent text-foreground dark:text-background border-2 border-accent border-b-4"
                          : "bg-primary text-primary-foreground border-2 border-secondary border-b-4 hover:bg-secondary active:border-b-0 active:translate-y-1"
                      }`}
                      style={{ fontWeight: 900 }}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4" />
                          Added to Dashboard
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Add to Dashboard
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t-4 border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground font-bold">
            Tip: Use the Browse Roles page for full exploration and filtering
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl border-b-4 border-secondary hover:bg-primary/90 active:border-b-0 active:translate-y-1 transition-all text-sm"
            style={{ fontWeight: 900 }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}