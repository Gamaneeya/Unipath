import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  TrendingUp,
  Trash2,
  Sparkles,
  History,
} from "lucide-react";
import { JOB_ROLES } from "../../data/mockData";
import { useApp } from "../../contexts/AppContext";

const EXAMPLE_ROLES = ["Backend Developer", "Data Analyst", "UX Designer"];

export default function RoleBrowser() {
  const navigate = useNavigate();
  const {
    getRoleMatch,
    saveRole,
    removeSavedRole,
    isRoleSaved,
    roleHistory,
    removeFromRoleHistory,
    hasAnalyzedProfile,
  } = useApp();

  const [search, setSearch] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  // History roles
  const historyRoleIds = roleHistory.map((r) => r.roleId);

  // Search results: roles matching query that are NOT already in history
  const searchResults =
    search.trim().length >= 1
      ? JOB_ROLES.filter(
          (role) =>
            !historyRoleIds.includes(role.id) &&
            (role.title.toLowerCase().includes(search.toLowerCase()) ||
              role.category.toLowerCase().includes(search.toLowerCase()) ||
              role.requiredSkills.some((s) =>
                s.toLowerCase().includes(search.toLowerCase())
              ))
        )
      : [];

  // History roles split by source
  const analyzedRoles = roleHistory.filter((r) => r.source === "analyzed");
  const searchedRoles = roleHistory.filter((r) => r.source === "searched");

  const handleExampleClick = (example: string) => {
    setSearch(example);
    setIsSearchActive(true);
  };

  // Navigate to detail page (will add to history from there)
  const handleViewDetails = (roleId: string) => {
    navigate(`/student/roles/${roleId}`, { state: { from: "browse-search" } });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 font-sans">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-foreground" style={{ fontSize: "2rem", fontWeight: 900 }}>
            Browse Roles
          </h1>
          <p className="text-muted-foreground text-base mt-1 font-bold">
            {hasAnalyzedProfile
              ? `Your ${roleHistory.length} role${roleHistory.length !== 1 ? "s" : ""} — analyzed matches + anything you've explored.`
              : "Analyze your profile first to see your matched roles here."}
          </p>
        </div>
        {hasAnalyzedProfile && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card border-2 border-border rounded-2xl px-4 py-2 font-bold">
            <History className="w-4 h-4 text-primary/60" />
            <span className="text-primary" style={{ fontWeight: 900 }}>
              {roleHistory.length}
            </span>
            roles tracked
          </div>
        )}
      </div>

      {/* ── Pre-analysis empty state ── */}
      {!hasAnalyzedProfile && (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-card rounded-3xl border-4 border-dashed border-border">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl border-2 border-primary/20 flex items-center justify-center mb-6">
            <Sparkles className="w-10 h-10 text-primary/40" />
          </div>
          <h2 className="text-foreground mb-2" style={{ fontSize: "1.5rem", fontWeight: 900 }}>
            No roles yet
          </h2>
          <p className="text-muted-foreground font-bold max-w-sm leading-relaxed mb-6">
            Your Top 3 career matches will appear here after you run your first analysis from the Dashboard.
          </p>
          <button
            onClick={() => navigate("/student")}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl border-b-4 border-secondary hover:bg-primary/90 active:border-b-0 active:translate-y-1 transition-all text-sm font-black shadow-md"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Post-analysis content ── */}
      {hasAnalyzedProfile && (
        <>
          {/* ── Search Section ── */}
          <div className="bg-card rounded-3xl border-4 border-border p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-xl border border-primary/20 flex items-center justify-center">
                <Search className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="text-foreground font-black text-sm">Search & Explore Roles</h3>
                <p className="text-muted-foreground text-xs font-bold">
                  Find roles by title, category, or skill — click any card to view full details
                </p>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setIsSearchActive(e.target.value.trim().length > 0);
                }}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-border text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary bg-muted font-bold text-foreground placeholder:text-muted-foreground transition-all"
                placeholder="Search roles, e.g. 'React', 'Machine Learning', 'Product Manager'…"
              />
            </div>

            {/* Example suggestions */}
            {!isSearchActive && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Try:</span>
                {EXAMPLE_ROLES.map((example) => (
                  <button
                    key={example}
                    onClick={() => handleExampleClick(example)}
                    className="text-xs font-black bg-primary/10 text-primary px-3 py-1.5 rounded-xl border border-primary/20 hover:bg-primary/20 hover:border-primary/30 transition-all"
                  >
                    {example}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Search Results ── */}
          {isSearchActive && searchResults.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-secondary/20 rounded-xl border border-secondary/30 flex items-center justify-center">
                  <Search className="w-4 h-4 text-secondary" />
                </div>
                <h2 className="text-foreground font-black text-base uppercase tracking-wider">
                  Search Results
                </h2>
                <span className="text-xs font-black text-secondary bg-secondary/15 border border-secondary/30 px-2.5 py-1 rounded-xl">
                  {searchResults.length} found
                </span>
              </div>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {searchResults.slice(0, 9).map((role) => (
                  <RoleCard
                    key={role.id}
                    roleId={role.id}
                    onDelete={null}
                    onViewDetail={() => handleViewDetails(role.id)}
                    getRoleMatch={getRoleMatch}
                    isRoleSaved={isRoleSaved}
                    saveRole={saveRole}
                    removeSavedRole={removeSavedRole}
                  />
                ))}
              </div>
            </section>
          )}

          {isSearchActive && searchResults.length === 0 && (
            <div className="text-center py-16 bg-card rounded-3xl border-4 border-dashed border-border">
              <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-muted-foreground font-bold">No roles found matching "{search}"</p>
              <p className="text-muted-foreground/70 text-sm mt-1">Try a different search term.</p>
            </div>
          )}

          {/* ── Role History Cards ── */}
          {!isSearchActive && (
            <>
              {roleHistory.length === 0 ? (
                <div className="text-center py-16 bg-card rounded-3xl border-4 border-dashed border-border">
                  <History className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
                  <p className="text-muted-foreground font-bold">No roles in your history yet.</p>
                  <p className="text-muted-foreground/70 text-sm mt-1">Search above to explore roles.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Analyzed Roles section */}
                  {analyzedRoles.length > 0 && (
                    <section>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-accent/25 rounded-xl border border-accent/40 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-accent-foreground" />
                        </div>
                        <h2 className="text-foreground font-black text-base uppercase tracking-wider">
                          Analyzed Roles
                        </h2>
                        <span className="text-xs font-black text-accent-foreground bg-accent/25 border border-accent/40 px-2.5 py-1 rounded-xl">
                          {analyzedRoles.length} matched
                        </span>
                      </div>
                      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {analyzedRoles.map(({ roleId }, rankIdx) => (
                          <RoleCard
                            key={roleId}
                            roleId={roleId}
                            rank={rankIdx + 1}
                            onDelete={() => removeFromRoleHistory(roleId)}
                            onViewDetail={() => navigate(`/student/roles/${roleId}`)}
                            getRoleMatch={getRoleMatch}
                            isRoleSaved={isRoleSaved}
                            saveRole={saveRole}
                            removeSavedRole={removeSavedRole}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Searched/Viewed Roles section */}
                  {searchedRoles.length > 0 && (
                    <section>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-primary/10 rounded-xl border border-primary/20 flex items-center justify-center">
                          <Search className="w-4 h-4 text-primary" />
                        </div>
                        <h2 className="text-foreground font-black text-base uppercase tracking-wider">
                          Explored Roles
                        </h2>
                        <span className="text-xs font-black text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-xl">
                          {searchedRoles.length} viewed
                        </span>
                      </div>
                      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {searchedRoles.map(({ roleId }) => (
                          <RoleCard
                            key={roleId}
                            roleId={roleId}
                            onDelete={() => removeFromRoleHistory(roleId)}
                            onViewDetail={() => navigate(`/student/roles/${roleId}`)}
                            getRoleMatch={getRoleMatch}
                            isRoleSaved={isRoleSaved}
                            saveRole={saveRole}
                            removeSavedRole={removeSavedRole}
                          />
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

// ── Role Card component ────────────────────────────────────────────────────────
interface RoleCardProps {
  roleId: string;
  rank?: number;
  onDelete: (() => void) | null;
  getRoleMatch: (id: string) => { percentage: number; acquired: string[]; missing: string[] };
  isRoleSaved: (id: string) => boolean;
  saveRole: (id: string) => void;
  removeSavedRole: (id: string) => void;
  onViewDetail: () => void;
}

function RoleCard({
  roleId,
  rank,
  onDelete,
  getRoleMatch,
  isRoleSaved,
  saveRole,
  removeSavedRole,
  onViewDetail,
}: RoleCardProps) {
  const role = JOB_ROLES.find((r) => r.id === roleId);
  if (!role) return null;

  const match = getRoleMatch(roleId);
  const saved = isRoleSaved(roleId);

  const matchBadgeClass =
    match.percentage >= 70
      ? "text-foreground bg-success/10 border-success/30"
      : match.percentage >= 50
      ? "text-foreground bg-accent/25 border-accent/40"
      : "text-foreground bg-destructive/10 border-destructive/30";

  const barStyle = {
    backgroundColor:
      match.percentage >= 70
        ? "var(--secondary)"
        : match.percentage >= 50
        ? "var(--accent)"
        : "var(--destructive)",
    width: `${match.percentage}%`,
  };

  return (
    <div className="bg-card rounded-3xl border-4 border-border hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col group">
      <div className="p-6 flex-1">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4 gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              {rank && (
                <span className="text-[10px] font-black uppercase tracking-wider text-accent-foreground bg-accent/25 border border-accent/40 px-2 py-0.5 rounded-lg flex-shrink-0">
                  #{rank}
                </span>
              )}
              <h3 className="text-foreground truncate" style={{ fontWeight: 900, fontSize: "1.1rem" }}>
                {role.title}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide">{role.category}</p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => (saved ? removeSavedRole(roleId) : saveRole(roleId))}
              className={`p-2 rounded-xl transition-all border-2 ${
                saved
                  ? "text-primary bg-primary/10 border-primary/30 hover:bg-primary/20"
                  : "text-muted-foreground bg-card border-border hover:text-primary hover:border-primary/20 hover:bg-muted"
              }`}
              title={saved ? "Unsave" : "Save"}
            >
              {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-2 rounded-xl transition-all border-2 text-muted-foreground/50 bg-card border-border hover:text-destructive hover:border-destructive/20 hover:bg-destructive/10"
                title="Remove from list"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-5 line-clamp-2">
          {role.description}
        </p>

        {/* Match score */}
        <div className="mb-5 bg-muted p-4 rounded-2xl border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Match Score
            </span>
            <span
              className={`text-sm px-2.5 py-1 rounded-lg border ${matchBadgeClass}`}
              style={{ fontWeight: 900 }}
            >
              {match.percentage}%
            </span>
          </div>
          <div className="h-2.5 bg-background rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={barStyle}
            />
          </div>
          <div className="flex justify-between text-xs font-bold text-muted-foreground mt-2">
            <span>{match.acquired.length} skills owned</span>
            <span>{match.missing.length} missing</span>
          </div>
        </div>

        {/* Skill tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {role.requiredSkills.slice(0, 4).map((skill) => {
            const has = match.acquired.some((s) => s.toLowerCase() === skill.toLowerCase());
            return (
              <span
                key={skill}
                className={`text-xs px-2.5 py-1 rounded-lg font-black border ${
                  has
                    ? "bg-secondary/15 text-secondary border-secondary/30"
                    : "bg-muted text-muted-foreground border-border"
                }`}
              >
                {skill}
              </span>
            );
          })}
          {role.requiredSkills.length > 4 && (
            <span className="text-xs font-black text-muted-foreground px-2 py-1 bg-muted rounded-lg border border-border">
              +{role.requiredSkills.length - 4}
            </span>
          )}
        </div>

        {/* Salary / demand */}
        <div className="flex items-center gap-3 text-xs font-black text-muted-foreground">
          <span className="flex items-center gap-1.5 bg-muted border border-border px-2.5 py-1 rounded-lg">
            <TrendingUp className="w-3.5 h-3.5" />
            {role.avgSalary}
          </span>
          <span
            className={`px-2.5 py-1 rounded-lg border ${
              role.demand === "High"
                ? "bg-secondary/15 text-secondary border-secondary/30"
                : role.demand === "Medium"
                ? "bg-accent/25 text-accent-foreground border-accent/40"
                : "bg-muted text-muted-foreground border-border"
            }`}
          >
            {role.demand} Demand
          </span>
        </div>
      </div>

      <div className="px-6 pb-6">
        <button
          onClick={onViewDetail}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-card border-2 border-primary/30 text-primary text-sm rounded-2xl hover:bg-primary/10 hover:border-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-secondary group-hover:border-b-4 group-hover:active:border-b-0 group-hover:active:translate-y-1"
          style={{ fontWeight: 900 }}
        >
          View Details
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}