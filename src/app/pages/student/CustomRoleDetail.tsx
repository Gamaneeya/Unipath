import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Lightbulb,
  BookOpen,
  FileSearch,
  Bookmark,
  BookmarkCheck,
  CalendarDays,
  AlertTriangle,
} from "lucide-react";
import { useApp } from "../../contexts/AppContext.tsx";
import { useEffect, useState } from "react";

const GENERATED_PROJECTS = [
  {
    id: "cp1",
    title: "Customer Churn Prediction Pipeline",
    description:
      "Build an end-to-end ML pipeline to predict customer churn using a telecom dataset. Include feature engineering, model training, and a Tableau dashboard for business stakeholders.",
    skills: ["Machine Learning", "Feature Engineering", "Tableau", "Python"],
    difficulty: "Intermediate",
    time: "3-4 weeks",
  },
  {
    id: "cp2",
    title: "NLP Sentiment Analysis API",
    description:
      "Train a deep learning model for sentiment analysis on product reviews. Deploy it as a REST API using FastAPI and Docker.",
    skills: ["Deep Learning", "Python", "Docker", "REST APIs"],
    difficulty: "Advanced",
    time: "4-5 weeks",
  },
  {
    id: "cp3",
    title: "Statistical A/B Testing Framework",
    description:
      "Implement a reusable A/B testing framework using Python and R. Document findings in an interactive Data Visualization report.",
    skills: ["Statistics", "R", "Python", "Data Visualization"],
    difficulty: "Intermediate",
    time: "2-3 weeks",
  },
];

export default function CustomRoleDetail() {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  const {
    savedRoles,
    removeSavedRole,
    isRoleSaved,
    saveProject,
    isProjectSaved,
    savedCustomAnalyses,
    removeSavedCustomAnalysis,
  } = useApp();

  const [showUnsaveWarning, setShowUnsaveWarning] = useState(false);

  // Check both savedRoles (with isCustomJD flag) and savedCustomAnalyses
  const savedRole = savedRoles.find((r) => r.roleId === roleId && r.isCustomJD);
  const savedAnalysis = savedCustomAnalyses.find((a) => a.id === roleId);

  // Redirect to custom analysis page if no data is found (e.g., after logout or account switch)
  useEffect(() => {
    if (!savedRole && !savedAnalysis) {
      navigate("/student/custom", { replace: true });
    }
  }, [savedRole, savedAnalysis, navigate]);

  if (!savedRole && !savedAnalysis) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <p className="mb-3">Analysis not found or no longer saved.</p>
        <button
          onClick={() => navigate("/student/custom")}
          className="text-primary hover:text-primary/80 font-bold"
        >
          Go to Custom JD Analysis
        </button>
      </div>
    );
  }

  // Use data from either source
  const title = savedRole?.customTitle ?? savedAnalysis?.title ?? roleId ?? "Custom JD";
  const percentage = savedRole?.customPercentage ?? savedAnalysis?.percentage ?? 0;
  const acquired = savedRole?.customAcquired ?? savedAnalysis?.acquired ?? [];
  const missing = savedRole?.customMissing ?? savedAnalysis?.missing ?? [];
  const requiredSkills = savedRole?.customRequiredSkills ?? savedAnalysis?.requiredSkills ?? [];
  const savedAt = savedRole?.savedAt ?? savedAnalysis?.savedAt ?? "";
  const isSaved = savedRole ? isRoleSaved(roleId ?? "") : !!savedAnalysis;

  const matchColorVar =
    percentage >= 70
      ? "var(--color-success)"
      : percentage >= 50
      ? "var(--color-warning)"
      : "var(--color-destructive)";

  return (
    <>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Back */}
        <button
          onClick={() => navigate("/student/custom")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Custom JD Analysis
        </button>

        {/* Header card */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              {/* JD badge */}
              <div className="inline-flex items-center gap-1.5 text-xs font-black text-primary bg-primary/10 border border-primary/30 px-2.5 py-1 rounded-full mb-3">
                <FileSearch className="w-3.5 h-3.5" />
                JD Analysis
              </div>
              <h1
                className="text-foreground"
                style={{ fontSize: "1.75rem", fontWeight: 800 }}
              >
                {title}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {requiredSkills.length} required skills extracted from job description
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                <CalendarDays className="w-3.5 h-3.5" />
                Saved on {savedAt}
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
                  strokeDasharray={`${(percentage / 100) * 2 * Math.PI * 42} ${2 * Math.PI * 42}`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
                <text x="50" y="46" textAnchor="middle" style={{ fill: matchColorVar }} fontSize="18" fontWeight="800">
                  {percentage}%
                </text>
                <text x="50" y="60" textAnchor="middle" style={{ fill: "var(--color-muted-foreground)" }} fontSize="10">
                  match
                </text>
              </svg>

              {/* Unsave button */}
              <button
                onClick={() => setShowUnsaveWarning(true)}
                className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl border-2 transition-all font-black text-primary bg-primary/10 border-primary/30 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                title="Remove from tracked roles"
              >
                <BookmarkCheck className="w-4 h-4" />
                Saved
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
              You have ({acquired.length})
            </h3>
            {acquired.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                None of the detected skills are in your profile.
              </p>
            ) : (
              <div className="space-y-1.5">
                {acquired.map((skill) => (
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
              Skills to gain ({missing.length})
            </h3>
            {missing.length === 0 ? (
              <p className="text-sm text-muted-foreground">You have all the detected skills!</p>
            ) : (
              <div className="space-y-1.5">
                {missing.map((skill) => (
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
        {requiredSkills.length > 0 && (
          <div className="bg-card rounded-2xl border border-border p-5">
            <h2
              className="text-foreground mb-3 flex items-center gap-2"
              style={{ fontWeight: 700 }}
            >
              <BookOpen className="w-5 h-5 text-primary" />
              All Required Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {requiredSkills.map((skill) => {
                const has = acquired.some((s) => s.toLowerCase() === skill.toLowerCase());
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
        )}

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
            {GENERATED_PROJECTS.map((project) => {
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
                      onClick={() => !projSaved && saveProject(project.id, roleId ?? "custom")}
                      className={`p-1.5 rounded-lg flex-shrink-0 ml-2 transition-colors ${
                        projSaved
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
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
                    <span className="text-muted-foreground">⏱ {project.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Unsave Warning Modal ── */}
      {showUnsaveWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowUnsaveWarning(false)} />
          <div className="relative bg-card rounded-3xl border-2 border-border shadow-2xl w-full max-w-md p-8 z-10">
            <div className="flex items-center justify-center mb-5">
              <div className="w-16 h-16 rounded-2xl bg-destructive/10 border-2 border-destructive/30 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
            </div>
            <h2 className="text-foreground text-center mb-2" style={{ fontSize: "1.25rem", fontWeight: 900 }}>
              Remove Custom JD Role?
            </h2>
            <p className="text-muted-foreground text-sm text-center font-medium leading-relaxed mb-2">
              You're about to remove{" "}
              <span className="text-foreground font-black">"{title}"</span>.
            </p>
            <div className="bg-destructive/8 border border-destructive/25 rounded-2xl px-4 py-3 mb-6 text-center">
              <p className="text-destructive text-sm font-black">
                ⚠️ This cannot be undone.
              </p>
              <p className="text-muted-foreground text-xs font-semibold mt-1">
                All match data, skill analysis, and history for this custom JD will be permanently deleted. You'll need to re-paste the job description to restore it.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUnsaveWarning(false)}
                className="flex-1 py-3 rounded-2xl border-2 border-border text-foreground font-black text-sm hover:bg-muted transition-all"
              >
                Keep It
              </button>
              <button
                onClick={() => {
                  if (savedRole) {
                    removeSavedRole(roleId ?? "");
                  } else if (savedAnalysis) {
                    removeSavedCustomAnalysis(roleId ?? "");
                  }
                  navigate("/student/custom");
                }}
                className="flex-1 py-3 rounded-2xl bg-destructive text-white font-black text-sm border-b-4 border-destructive/70 hover:bg-destructive/90 active:border-b-0 active:translate-y-1 transition-all"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}