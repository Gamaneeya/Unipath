import { useParams, useNavigate, useLocation } from "react-router";
import { useEffect } from "react";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  CheckCircle,
  XCircle,
  Lightbulb,
  TrendingUp,
  BookOpen,
  Bookmark as BookmarkIcon,
  CalendarDays,
  Briefcase,
} from "lucide-react";
import { JOB_ROLES, PROJECT_IDEAS } from "../../data/mockData.ts";
import { useApp } from "../../contexts/AppContext.tsx";

export default function RoleDetail() {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { getRoleMatch, saveRole, removeSavedRole, isRoleSaved, savedRoles, saveProject, isProjectSaved, addRoleToHistory } = useApp();

  const role = JOB_ROLES.find((r) => r.id === roleId);
  if (!role) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Role not found.{" "}
        <button onClick={() => navigate("/student/roles")} className="text-primary hover:underline">
          Back to roles
        </button>
      </div>
    );
  }

  // Add role to history when viewed from search
  useEffect(() => {
    const from = (location.state as { from?: string })?.from;
    if (from === "browse-search" && roleId) {
      addRoleToHistory(roleId, "searched");
    }
  }, [roleId, location.state, addRoleToHistory]);

  const match = getRoleMatch(role.id);
  const saved = isRoleSaved(role.id);
  const savedRole = savedRoles.find((r) => r.roleId === role.id);

  const projectIdeas = PROJECT_IDEAS.filter(
    (p) =>
      p.roleId === role.id ||
      p.skills.some((s) => match.missing.some((m) => m.toLowerCase() === s.toLowerCase()))
  ).slice(0, 3);

  // Use CSS variable strings for SVG (supported in modern browsers via style attr)
  const matchColorVar =
    match.percentage >= 70
      ? "var(--color-success)"
      : match.percentage >= 50
      ? "var(--color-warning)"
      : "var(--color-destructive)";

  // Determine back navigation based on where user came from
  const handleBack = () => {
    const from = (location.state as { from?: string })?.from;
    if (from === "career-matches") {
      navigate("/student/career-matches");
    } else if (from === "dashboard") {
      navigate("/student");
    } else {
      navigate("/student/roles");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Back */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Header card */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            {/* Role badge */}
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-primary-foreground bg-primary border border-primary/50 px-2.5 py-1 rounded-full mb-3">
              <Briefcase className="w-3.5 h-3.5" />
              Career Role
            </div>
            <h1
              className="text-foreground"
              style={{ fontSize: "1.75rem", fontWeight: 800 }}
            >
              {role.title}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {role.description}
            </p>
            <div className="flex flex-wrap gap-3 mt-3">
              <span className="text-xs px-2.5 py-1 rounded-full bg-accent/20 text-accent-foreground flex items-center gap-1 font-bold border border-accent/30">
                <TrendingUp className="w-3 h-3" />
                {role.avgSalary}
              </span>
              {savedRole && (
                <div className="flex items-center gap-1.5 mt-0 text-xs text-muted-foreground">
                  <CalendarDays className="w-3.5 h-3.5" />
                  Saved on {savedRole.savedAt}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {/* Match circle */}
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" style={{ stroke: "var(--color-border)" }} strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                style={{ stroke: matchColorVar }}
                strokeWidth="8"
                strokeDasharray={`${(match.percentage / 100) * 2 * Math.PI * 42} ${2 * Math.PI * 42}`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
              <text x="50" y="46" textAnchor="middle" style={{ fill: matchColorVar }} fontSize="18" fontWeight="800">
                {match.percentage}%
              </text>
              <text x="50" y="60" textAnchor="middle" style={{ fill: "var(--color-muted-foreground)" }} fontSize="10">
                match
              </text>
            </svg>

            {/* Save/Unsave button */}
            <button
              onClick={() => saved ? removeSavedRole(role.id) : saveRole(role.id)}
              className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl border-2 transition-all font-black ${
                saved
                  ? "text-primary bg-primary/10 border-primary/30 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                  : "text-primary bg-card border-accent/50 hover:bg-primary/10"
              }`}
              title={saved ? "Remove from tracked roles" : "Add to tracked roles"}
            >
              {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              {saved ? "Saved" : "Save role"}
            </button>
          </div>
        </div>
      </div>

      {/* Skills grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Acquired */}
        <div className="bg-success/10 rounded-2xl border border-success/30 p-5">
          <h3
            className="text-foreground mb-3 flex items-center gap-2"
            style={{ fontWeight: 700 }}
          >
            <CheckCircle className="w-5 h-5 text-success" />
            Acquired Skills ({match.acquired.length})
          </h3>
          {match.acquired.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              None of the required skills are in your profile yet.
            </p>
          ) : (
            <div className="space-y-1.5">
              {match.acquired.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-2 text-sm text-foreground"
                >
                  <CheckCircle className="w-4 h-4 flex-shrink-0 text-success" />
                  {skill}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Missing */}
        <div className="bg-destructive/10 rounded-2xl border border-destructive/30 p-5">
          <h3
            className="text-foreground mb-3 flex items-center gap-2"
            style={{ fontWeight: 700 }}
          >
            <XCircle className="w-5 h-5 text-destructive" />
            Missing Skills ({match.missing.length})
          </h3>
          {match.missing.length === 0 ? (
            <p className="text-sm text-muted-foreground">You have all the required skills!</p>
          ) : (
            <div className="space-y-1.5">
              {match.missing.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-2 text-sm text-foreground"
                >
                  <XCircle className="w-4 h-4 flex-shrink-0 text-destructive" />
                  {skill}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* All required skills */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <h2
          className="text-foreground mb-3 flex items-center gap-2"
          style={{ fontWeight: 700 }}
        >
          <BookOpen className="w-5 h-5 text-primary" />
          All Required Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {role.requiredSkills.map((skill) => {
            const has = match.acquired.some((s) => s.toLowerCase() === skill.toLowerCase());
            return (
              <span
                key={skill}
                className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border text-foreground ${
                  has
                    ? "bg-success/10 border-success/30"
                    : "bg-destructive/10 border-destructive/30"
                }`}
              >
                {has ? <CheckCircle className="w-3 h-3 text-success" /> : <XCircle className="w-3 h-3 text-destructive" />}
                {skill}
              </span>
            );
          })}
        </div>
      </div>

      {/* Project Recommendations */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h2
          className="text-foreground mb-1 flex items-center gap-2"
          style={{ fontWeight: 700 }}
        >
          <Lightbulb className="w-5 h-5 text-warning" />
          Recommended Projects to Close Gaps
        </h2>
        <p className="text-xs text-muted-foreground mb-5">
          AI-generated projects targeting your missing skills
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {projectIdeas.length === 0 ? (
            <p className="text-sm text-muted-foreground col-span-3">No project ideas yet for this role.</p>
          ) : (
            projectIdeas.map((project) => {
              const projSaved = isProjectSaved(project.id);
              return (
                <div
                  key={project.id}
                  className="border border-border rounded-xl p-4 hover:border-warning/40 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-sm text-foreground" style={{ fontWeight: 600 }}>
                      {project.title}
                    </div>
                    <button
                      onClick={() => !projSaved && saveProject(project.id, role.id)}
                      className={`p-1.5 rounded-lg flex-shrink-0 ml-2 transition-colors ${
                        projSaved
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                      }`}
                    >
                      <BookmarkIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.skills.map((s) => (
                      <span
                        key={s}
                        className="text-xs bg-warning/10 text-foreground border border-warning/30 px-1.5 py-0.5 rounded-full"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 text-xs">
                    <span
                      className={`px-2 py-0.5 rounded-full border text-foreground ${
                        project.difficulty === "Beginner"
                          ? "bg-success/10 border-success/30"
                          : project.difficulty === "Intermediate"
                          ? "bg-warning/10 border-warning/30"
                          : "bg-destructive/10 border-destructive/30"
                      }`}
                    >
                      {project.difficulty}
                    </span>
                    <span className="text-muted-foreground">⏱ {project.estimatedTime}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}