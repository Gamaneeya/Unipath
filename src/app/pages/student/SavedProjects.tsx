import { useNavigate } from "react-router";
import { Lightbulb, Trash2, ArrowRight, BookOpen } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { PROJECT_IDEAS } from "../../data/mockData";

const CUSTOM_PROJECTS = [
  {
    id: "cp1",
    title: "Customer Churn Prediction Pipeline",
    description: "Build an end-to-end ML pipeline to predict customer churn using a telecom dataset. Include feature engineering, model training, and a Tableau dashboard.",
    skills: ["Machine Learning", "Feature Engineering", "Tableau", "Python"],
    difficulty: "Intermediate" as const,
    estimatedTime: "3-4 weeks",
    roleId: "custom",
  },
  {
    id: "cp2",
    title: "NLP Sentiment Analysis API",
    description: "Train a deep learning model for sentiment analysis. Deploy as a REST API using FastAPI and Docker.",
    skills: ["Deep Learning", "Python", "Docker", "REST APIs"],
    difficulty: "Advanced" as const,
    estimatedTime: "4-5 weeks",
    roleId: "custom",
  },
  {
    id: "cp3",
    title: "Statistical A/B Testing Framework",
    description: "Implement a reusable A/B testing framework using Python and R with interactive visualization.",
    skills: ["Statistics", "R", "Python", "Data Visualization"],
    difficulty: "Intermediate" as const,
    estimatedTime: "2-3 weeks",
    roleId: "custom",
  },
];

const ALL_PROJECTS = [...PROJECT_IDEAS, ...CUSTOM_PROJECTS];

export default function SavedProjects() {
  const navigate = useNavigate();
  const { savedProjects, removeSavedProject } = useApp();

  const projects = savedProjects
    .map((sp) => {
      const found = ALL_PROJECTS.find((p) => p.id === sp.projectId);
      if (!found) return null;
      return { ...found, savedAt: sp.savedAt, roleId: sp.roleId };
    })
    .filter(Boolean) as (typeof ALL_PROJECTS[0] & { savedAt: string; roleId: string })[];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground" style={{ fontSize: "1.75rem", fontWeight: 800 }}>
            Saved Projects
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Your bookmarked side-project ideas to close skill gaps.
          </p>
        </div>
        {projects.length > 0 && (
          <div className="text-sm text-muted-foreground">
            {projects.length} project{projects.length !== 1 ? "s" : ""} saved
          </div>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-warning/10 flex items-center justify-center mx-auto mb-4">
            <Lightbulb className="w-8 h-8 text-warning" />
          </div>
          <h2 className="text-foreground mb-2" style={{ fontWeight: 700 }}>
            No saved projects yet
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
            When you browse role gap analyses or use the Custom JD Analyzer, you can bookmark project ideas here for later.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate("/student/roles")}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors text-sm border-b-4 border-secondary active:border-b-0 active:translate-y-1"
              style={{ fontWeight: 600 }}
            >
              Browse roles
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/student/custom")}
              className="flex items-center gap-2 border border-border text-foreground px-5 py-2.5 rounded-xl hover:bg-muted transition-colors text-sm"
            >
              Custom JD analysis
            </button>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="bg-card rounded-2xl border border-border hover:border-warning/40 hover:shadow-sm transition-all p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-5 h-5 text-warning" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-foreground" style={{ fontWeight: 600 }}>
                    {project.title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Saved {project.savedAt}
                    {project.roleId !== "custom" && (
                      <> · for <span className="text-primary capitalize">{project.roleId.replace(/-/g, " ")}</span></>
                    )}
                    {project.roleId === "custom" && (
                      <> · from <span className="text-secondary">Custom JD</span></>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => removeSavedProject(project.id)}
                  className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors flex-shrink-0"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {project.skills.map((s) => (
                  <span key={s} className="text-xs bg-warning/10 text-foreground border border-warning/30 px-2 py-0.5 rounded-full">
                    {s}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-xs px-2.5 py-1 rounded-full border text-foreground ${
                  project.difficulty === "Beginner"
                    ? "bg-success/10 border-success/30"
                    : project.difficulty === "Intermediate"
                    ? "bg-warning/10 border-warning/30"
                    : "bg-destructive/10 border-destructive/30"
                }`} style={{ fontWeight: 500 }}>
                  {project.difficulty}
                </span>
                <span className="text-xs text-muted-foreground">⏱ {project.estimatedTime}</span>
                {project.roleId && project.roleId !== "custom" && (
                  <button
                    onClick={() => navigate(`/student/roles/${project.roleId}`)}
                    className="ml-auto flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                    style={{ fontWeight: 500 }}
                  >
                    <BookOpen className="w-3 h-3" />
                    View role
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}