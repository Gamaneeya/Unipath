import { useState } from "react";
import {
  Target,
  Sparkles,
  CheckCircle,
  XCircle,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { useApp } from "../../contexts/AppContext";

// Skill keywords to extract from JD text
const SKILL_KEYWORDS = [
  "Python", "JavaScript", "TypeScript", "React", "Node.js", "SQL", "Git", "Docker",
  "Kubernetes", "AWS", "Figma", "User Research", "Prototyping", "Machine Learning",
  "Deep Learning", "Statistics", "Data Visualization", "Tableau", "Power BI",
  "Excel", "Communication", "Agile", "REST APIs", "Testing", "Linux", "CI/CD",
  "Networking", "Security", "SEO", "Content Marketing", "Product Strategy",
  "Roadmapping", "Stakeholder Management", "Data Analysis", "Problem Solving",
  "HTML", "CSS", "MongoDB", "GraphQL", "Feature Engineering", "R", "Terraform",
  "System Design", "Databases", "Mobile", "Swift", "Kotlin",
];

function extractSkillsFromJD(text: string): string[] {
  const lower = text.toLowerCase();
  return SKILL_KEYWORDS.filter((skill) => lower.includes(skill.toLowerCase()));
}

const SAMPLE_JD = `We are looking for a talented Data Scientist to join our growing team.

Requirements:
- Strong proficiency in Python and R for data analysis
- Experience with Machine Learning and Deep Learning frameworks (TensorFlow, PyTorch)
- Solid understanding of Statistics and Feature Engineering
- Ability to write clean SQL for data querying
- Experience with Data Visualization tools (Tableau, Power BI)
- Strong Communication skills to present findings to non-technical stakeholders
- Familiarity with Docker for model deployment
- Problem Solving mindset with attention to detail

Nice to have:
- Experience with AWS cloud services
- Knowledge of CI/CD pipelines`;

const GENERATED_PROJECTS = [
  {
    id: "cp1",
    title: "Customer Churn Prediction Pipeline",
    description: "Build an end-to-end ML pipeline to predict customer churn using a telecom dataset. Include feature engineering, model training, and a Tableau dashboard for business stakeholders.",
    skills: ["Machine Learning", "Feature Engineering", "Tableau", "Python"],
    difficulty: "Intermediate",
    time: "3-4 weeks",
  },
  {
    id: "cp2",
    title: "NLP Sentiment Analysis API",
    description: "Train a deep learning model for sentiment analysis on product reviews. Deploy it as a REST API using FastAPI and Docker.",
    skills: ["Deep Learning", "Python", "Docker", "REST APIs"],
    difficulty: "Advanced",
    time: "4-5 weeks",
  },
  {
    id: "cp3",
    title: "Statistical A/B Testing Framework",
    description: "Implement a reusable A/B testing framework using Python and R. Document findings in an interactive Data Visualization report.",
    skills: ["Statistics", "R", "Python", "Data Visualization"],
    difficulty: "Intermediate",
    time: "2-3 weeks",
  },
];

// Derive a stable, unique roleId from a JD title for use in savedRoles
function jdRoleId(title: string): string {
  return `jd__${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
}

export default function CustomAnalysis() {
  const {
    studentSkills,
    saveProject,
    isProjectSaved,
    saveRole,
    removeSavedRole,
    isRoleSaved,
    currentCustomAnalysis,
    setCurrentCustomAnalysis,
  } = useApp();

  const [jdText, setJdText] = useState(currentCustomAnalysis?.jdText ?? "");
  const [jdTitle, setJdTitle] = useState(currentCustomAnalysis?.jdTitle ?? "");
  const [loading, setLoading] = useState(false);
  const [bookmarkPulse, setBookmarkPulse] = useState(false);

  const analysis = currentCustomAnalysis;

  const handleAnalyze = () => {
    if (!jdText.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const requiredSkills = extractSkillsFromJD(jdText);
      const normalized = studentSkills.map((s) => s.toLowerCase());
      const acquired = requiredSkills.filter((s) => normalized.includes(s.toLowerCase()));
      const missing = requiredSkills.filter((s) => !normalized.includes(s.toLowerCase()));
      const percentage = requiredSkills.length > 0
        ? Math.round((acquired.length / requiredSkills.length) * 100)
        : 0;
      setCurrentCustomAnalysis({
        jdTitle: jdTitle || "Custom Role",
        jdText,
        requiredSkills,
        acquired,
        missing,
        percentage,
      });
      setLoading(false);
    }, 1200);
  };

  const handleReset = () => {
    setCurrentCustomAnalysis(null);
  };

  const handleBookmark = () => {
    if (!analysis) return;
    const roleId = jdRoleId(analysis.jdTitle);
    if (isRoleSaved(roleId)) {
      removeSavedRole(roleId);
    } else {
      saveRole(roleId, {
        isCustomJD: true,
        customTitle: analysis.jdTitle,
        customPercentage: analysis.percentage,
        customAcquired: analysis.acquired,
        customMissing: analysis.missing,
        customRequiredSkills: analysis.requiredSkills,
      });
      setBookmarkPulse(true);
      setTimeout(() => setBookmarkPulse(false), 600);
    }
  };

  const matchColorVar =
    analysis && analysis.percentage >= 70
      ? "var(--color-success)"
      : analysis && analysis.percentage >= 50
      ? "var(--color-warning)"
      : "var(--color-destructive)";

  const isSavedAnalysis = analysis ? isRoleSaved(jdRoleId(analysis.jdTitle)) : false;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-foreground" style={{ fontSize: "1.75rem", fontWeight: 800 }}>
          Custom JD Analysis
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Paste any job description and instantly see your match score, skill gaps, and tailored project recommendations.
        </p>
      </div>

      {!analysis ? (
        <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
          <div>
            <label className="text-sm text-foreground block mb-1.5" style={{ fontWeight: 500 }}>
              Role / Position Title
            </label>
            <input
              value={jdTitle}
              onChange={(e) => setJdTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-card text-foreground"
              placeholder="e.g. Senior Data Scientist at Acme Corp"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm text-foreground" style={{ fontWeight: 500 }}>
                Job Description *
              </label>
              <button
                onClick={() => { setJdText(SAMPLE_JD); setJdTitle("Data Scientist – Sample JD"); }}
                className="text-xs text-primary hover:text-primary/80"
                style={{ fontWeight: 500 }}
              >
                Load sample JD
              </button>
            </div>
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              rows={10}
              className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-card resize-none text-foreground"
              placeholder="Paste the full job description here. We'll extract required skills and compare them against your profile…"
            />
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>{jdText.length} characters</span>
              {jdText.length > 0 && (
                <span className="text-primary">
                  ~{extractSkillsFromJD(jdText).length} skills detected (preview)
                </span>
              )}
            </div>
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm text-foreground">
              <strong>How it works:</strong> We extract skill keywords from the JD, then compare them to your full skill profile (courses + experiences + manual skills) to calculate your match score and identify gaps.
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!jdText.trim() || loading}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60 border-b-4 border-secondary active:border-b-0 active:translate-y-1"
            style={{ fontWeight: 600 }}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Analyzing…
              </>
            ) : (
              <>
                <Target className="w-4 h-4" />
                Analyze match
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Result header */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Analysis result for</div>
                <h2 className="text-foreground" style={{ fontWeight: 700, fontSize: "1.25rem" }}>
                  {analysis.jdTitle}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {analysis.requiredSkills.length} required skills detected from JD
                </p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="text-center">
                  <svg width="90" height="90" viewBox="0 0 90 90">
                    <circle cx="45" cy="45" r="38" fill="none" style={{ stroke: "var(--color-border)" }} strokeWidth="8" />
                    <circle
                      cx="45" cy="45" r="38" fill="none"
                      style={{ stroke: matchColorVar }}
                      strokeWidth="8"
                      strokeDasharray={`${(analysis.percentage / 100) * 2 * Math.PI * 38} ${2 * Math.PI * 38}`}
                      strokeLinecap="round"
                      transform="rotate(-90 45 45)"
                    />
                    <text x="45" y="42" textAnchor="middle" style={{ fill: matchColorVar }} fontSize="17" fontWeight="800">{analysis.percentage}%</text>
                    <text x="45" y="55" textAnchor="middle" style={{ fill: "var(--color-muted-foreground)" }} fontSize="9">match</text>
                  </svg>
                </div>
                <div className="flex flex-col gap-2">
                  {/* Bookmark button */}
                  <button
                    onClick={handleBookmark}
                    className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl border-2 transition-all font-black ${
                      isSavedAnalysis
                        ? "text-primary bg-primary/10 border-primary/30 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                        : "text-muted-foreground border-border hover:text-primary hover:bg-primary/10 hover:border-primary/30"
                    } ${bookmarkPulse ? "scale-110" : ""}`}
                    title={isSavedAnalysis ? "Remove from saved" : "Save this analysis"}
                  >
                    {isSavedAnalysis ? (
                      <><BookmarkCheck className="w-4 h-4" /> Saved</>
                    ) : (
                      <><Bookmark className="w-4 h-4" /> Save Role</>
                    )}
                  </button>
                  {/* Re-analyse button */}
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground border border-border px-4 py-2.5 rounded-xl transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Re-analyse
                  </button>
                </div>
              </div>
            </div>

            {/* Saved confirmation notice */}
            {isSavedAnalysis && (
              <div className="mt-4 flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-xl px-4 py-3">
                <BookmarkCheck className="w-4 h-4 text-primary flex-shrink-0" />
                <p className="text-xs text-primary font-bold">
                  This analysis is saved to your <span className="text-foreground">Dashboard</span> and <span className="text-foreground">sidebar</span>. Remove it by clicking the bookmark icon above.
                </p>
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Acquired */}
            <div className="bg-success/10 rounded-2xl border border-success/30 p-5">
              <h3 className="text-foreground mb-3 flex items-center gap-2" style={{ fontWeight: 700 }}>
                <CheckCircle className="w-5 h-5 text-success" />
                You have ({analysis.acquired.length})
              </h3>
              {analysis.acquired.length === 0 ? (
                <p className="text-sm text-muted-foreground">None of the detected skills are in your profile yet.</p>
              ) : (
                <div className="space-y-1.5">
                  {analysis.acquired.map((skill) => (
                    <div key={skill} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle className="w-4 h-4 flex-shrink-0 text-success" />
                      {skill}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Missing */}
            <div className="bg-destructive/10 rounded-2xl border border-destructive/30 p-5">
              <h3 className="text-foreground mb-3 flex items-center gap-2" style={{ fontWeight: 700 }}>
                <XCircle className="w-5 h-5 text-destructive" />
                Skills to gain ({analysis.missing.length})
              </h3>
              {analysis.missing.length === 0 ? (
                <p className="text-sm text-muted-foreground">You have all the detected skills!</p>
              ) : (
                <div className="space-y-1.5">
                  {analysis.missing.map((skill) => (
                    <div key={skill} className="flex items-center gap-2 text-sm text-foreground">
                      <XCircle className="w-4 h-4 flex-shrink-0 text-destructive" />
                      {skill}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Project Recommendations */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="text-foreground mb-1 flex items-center gap-2" style={{ fontWeight: 700 }}>
              <Lightbulb className="w-5 h-5 text-warning" />
              Recommended Projects to Close Gaps
            </h2>
            <p className="text-xs text-muted-foreground mb-5">
              AI-generated projects targeting your missing skills
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {GENERATED_PROJECTS.map((project) => {
                const isSaved = isProjectSaved(project.id);
                return (
                  <div key={project.id} className="border border-border rounded-xl p-4 hover:border-warning/40 transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-sm text-foreground" style={{ fontWeight: 600 }}>
                        {project.title}
                      </div>
                      <button
                        onClick={() => !isSaved && saveProject(project.id, "custom")}
                        className={`p-1.5 rounded-lg flex-shrink-0 ml-2 transition-colors ${
                          isSaved ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.skills.map((s) => (
                        <span key={s} className="text-xs bg-warning/10 text-foreground border border-warning/30 px-1.5 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                    <div className="flex gap-2 text-xs">
                      <span className={`px-2 py-0.5 rounded-full border text-foreground ${
                        project.difficulty === "Beginner" ? "bg-success/10 border-success/30" :
                        project.difficulty === "Intermediate" ? "bg-warning/10 border-warning/30" :
                        "bg-destructive/10 border-destructive/30"
                      }`}>
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
      )}
    </div>
  );
}