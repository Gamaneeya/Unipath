import { useNavigate } from "react-router";
import {
  ArrowRight,
  BarChart3,
  Bookmark,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  FileText,
  Link2,
  LockKeyhole,
  Plus,
  RefreshCw,
  Target,
  Trophy,
  Trash2,
  Zap,
  AlertTriangle,
  Signal,
} from "lucide-react";
import { useApp } from "../../contexts/AppContext.tsx";
import { JOB_ROLES } from "../../data/mockData.ts";
import { AddRolesModal } from "../../components/AddRolesModal.tsx";
import { useState } from "react";
import { AnalysisFlowModal } from "../../components/AnalysisFlowModal.tsx";

function MatchRing({ percentage }: { percentage: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const fill = (percentage / 100) * circ;
  const color =
    percentage >= 70
      ? "var(--secondary)"
      : percentage >= 50
        ? "var(--accent)"
        : "var(--destructive)";
  const bgColor = "var(--muted)";

  return (
    <svg width="96" height="96" viewBox="0 0 96 96">
      <circle
        cx="48"
        cy="48"
        r={r}
        fill="none"
        stroke={bgColor}
        strokeWidth="8"
      />
      <circle
        cx="48"
        cy="48"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeDasharray={`${fill} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 48 48)"
      />
      <text
        x="48"
        y="53"
        textAnchor="middle"
        fill={color}
        fontSize="16"
        fontWeight="700"
      >
        {percentage}%
      </text>
    </svg>
  );
}

function LockedCard({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted border-2 border-dashed border-border">
      <div className="w-10 h-10 rounded-xl bg-muted border-2 border-border flex items-center justify-center flex-shrink-0">
        <LockKeyhole className="w-4 h-4 text-muted-foreground/50" />
      </div>
      <span className="text-sm text-muted-foreground font-bold">
        {label}
      </span>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    studentProfile,
    savedRoles,
    removeSavedRole,
    getRoleMatch,
    getTop3Recommendations,
    studentSkills,
    savedCustomAnalyses,
    removeSavedCustomAnalysis,
    hasAnalyzedProfile,
    userName,
  } = useApp();

  const [isAddRolesModalOpen, setIsAddRolesModalOpen] =
    useState(false);
  const [isAnalysisFlowOpen, setIsAnalysisFlowOpen] =
    useState(false);
  const [unsaveCustomJD, setUnsaveCustomJD] = useState<{
    roleId: string;
    title: string;
    isLegacy?: boolean;
    legacyId?: string;
  } | null>(null);

  const top3 = getTop3Recommendations();
  const totalCourses = studentProfile.courses.length;
  const totalSkills = studentSkills.length;

  const hasUploadedCurriculum =
    studentProfile.courses.length > 0;
  const hasAddedSkills = studentSkills.length > 0;
  const isPartner = studentProfile.accountType === "partner";
  const canAnalyzeProfile = isPartner
    ? true
    : hasUploadedCurriculum && hasAddedSkills;

  const displayName = (userName || studentProfile.name).split(
    " ",
  )[0];

  const syncedSkillCount = isPartner
    ? [
        ...new Set(
          studentProfile.courses.flatMap((c) => c.skills),
        ),
      ].length
    : 0;

  const matchBarStyle = (pct: number) => ({
    backgroundColor:
      pct >= 70
        ? "var(--secondary)"
        : pct >= 50
          ? "var(--accent)"
          : "var(--destructive)",
    width: `${pct}%`,
  });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 font-sans">
      <div>
        <h1
          className="text-foreground"
          style={{ fontSize: "2rem", fontWeight: 900 }}
        >
          Welcome back, {displayName} !
        </h1>
        <p className="text-muted-foreground mt-1 text-sm font-bold tracking-wide uppercase">
          Dashboard ·{" "}
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {!hasAnalyzedProfile && (
        <div className="space-y-5">
          <div
           className={`rounded-3xl p-8 border-2 shadow-xl ${
  isPartner
    ? "bg-gradient-to-br from-secondary to-primary border-primary/50 text-white dark:bg-card dark:border-secondary/40 dark:text-foreground"
    : "bg-gradient-to-br from-primary to-secondary border-secondary/50 text-white dark:bg-card dark:border-primary/40 dark:text-foreground"
}`}
          >
            <div className="flex items-start gap-5">
<div className="w-16 h-16 rounded-2xl bg-white/20 dark:bg-primary/15 flex items-center justify-center flex-shrink-0 backdrop-blur-sm border-2 border-white/30 dark:border-primary/30">                {isPartner ? (
                  <Link2 className="w-8 h-8" />
                ) : (
                  <Zap className="w-8 h-8" />
                )}
              </div>
              <div className="flex-1">
                <h2
                  className="text-white dark:text-foreground mb-2"
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: 900,
                  }}
                >
                  {isPartner
                    ? "Your Profile is Ready!"
                    : "Let's Build Your Career Profile"}
                </h2>
                <p className="text-white/90 dark:text-foreground text-base font-medium leading-relaxed">
                  {isPartner
                    ? `Your academic data has been automatically synced from ${studentProfile.university}. Review your synced data below, then click "Analyze My Profile" to generate your personalized career matches.`
                    : "Complete the two steps below to unlock personalized career matching, skill gap analysis, and project recommendations. Takes just a few minutes!"}
                </p>
              </div>
            </div>
          </div>

          {isPartner && (
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="bg-card rounded-3xl border-2 border-secondary/40 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary/15 border-2 border-secondary/30 flex items-center justify-center flex-shrink-0">
                    <RefreshCw className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-foreground font-black text-sm">
                      Curriculum Synced
                    </h3>
                    <p className="text-muted-foreground text-xs font-bold">
                      Live from {studentProfile.university}
                    </p>
                  </div>
                  <span className="ml-auto text-[10px] uppercase tracking-wider font-black bg-secondary/20 text-secondary px-2 py-1 rounded-lg border border-secondary/30">
                    ✓ Synced
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-secondary/10 rounded-2xl border border-secondary/20 p-3 text-center">
                    <div
                      className="text-foreground"
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: 900,
                      }}
                    >
                      {totalCourses}
                    </div>
                    <div className="text-muted-foreground text-xs font-bold uppercase tracking-wide mt-0.5">
                      Courses
                    </div>
                  </div>
                  <div className="bg-secondary/10 rounded-2xl border border-secondary/20 p-3 text-center">
                    <div
                      className="text-foreground"
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: 900,
                      }}
                    >
                      {syncedSkillCount}
                    </div>
                    <div className="text-muted-foreground text-xs font-bold uppercase tracking-wide mt-0.5">
                      Skills Detected
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-3xl border-2 border-accent/50 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/25 border-2 border-accent/40 flex items-center justify-center flex-shrink-0">
                    <LockKeyhole className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="text-foreground font-black text-sm">
                      Analysis Pending
                    </h3>
                    <p className="text-accent-foreground text-xs font-bold">
                      Waiting for you to trigger it
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    "Top 3 career matches",
                    "Match percentages",
                    "Saved roles",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-xs text-muted-foreground font-bold"
                    >
                      <div className="w-4 h-4 rounded-full border-2 border-border flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
                <p className="text-muted-foreground text-xs font-medium mt-3 leading-relaxed">
                  None of these will appear until you run the
                  analysis below.
                </p>
              </div>
            </div>
          )}

          {!isPartner && (
            <div className="grid md:grid-cols-2 gap-5">
              <div
                className={`bg-card rounded-3xl border-2 p-6 transition-all shadow-sm ${
                  hasUploadedCurriculum
                    ? "border-secondary/40 bg-secondary/5"
                    : "border-border hover:border-primary hover:shadow-md"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border-2 ${
                      hasUploadedCurriculum
                        ? "bg-secondary/15 border-secondary/30 text-secondary"
                        : "bg-primary/10 border-primary/20 text-primary"
                    }`}
                  >
                    {hasUploadedCurriculum ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <FileText className="w-6 h-6" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-foreground font-black text-base">
                        Step 1: Upload Curriculum
                      </h3>
                      {hasUploadedCurriculum && (
                        <span className="text-[10px] uppercase tracking-wider font-black bg-secondary/20 text-secondary px-2 py-0.5 rounded-lg">
                          Done
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-4">
                      Upload your course PDF to automatically
                      extract skills and build your academic
                      profile.
                    </p>
                    {hasUploadedCurriculum ? (
                      <div className="flex items-center gap-2 text-foreground text-sm font-bold">
                        <Trophy className="w-4 h-4 text-secondary" />
                        <span>
                          {totalCourses} courses detected
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          navigate("/student/upload")
                        }
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl border-b-4 border-secondary hover:bg-primary/90 active:border-b-0 active:translate-y-1 transition-all text-sm font-black"
                      >
                        Upload Now{" "}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div
                className={`bg-card rounded-3xl border-2 p-6 transition-all shadow-sm ${
                  hasAddedSkills
                    ? "border-secondary/40 bg-secondary/5"
                    : "border-border hover:border-secondary hover:shadow-md"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border-2 ${
                      hasAddedSkills
                        ? "bg-secondary/15 border-secondary/30 text-secondary"
                        : "bg-secondary/10 border-secondary/20 text-secondary"
                    }`}
                  >
                    {hasAddedSkills ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <Target className="w-6 h-6" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-foreground font-black text-base">
                        Step 2: Add Your Skills
                      </h3>
                      {hasAddedSkills && (
                        <span className="text-[10px] uppercase tracking-wider font-black bg-secondary/20 text-secondary px-2 py-0.5 rounded-lg">
                          Done
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-4">
                      Add your technical and soft skills to
                      improve the accuracy of your career
                      matching.
                    </p>
                    {hasAddedSkills ? (
                      <div className="flex items-center gap-2 text-foreground text-sm font-bold">
                        <Trophy className="w-4 h-4 text-secondary" />
                        <span>{totalSkills} skills added</span>
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          navigate("/student/profile")
                        }
                        className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-xl border-b-4 border-primary hover:bg-secondary/90 active:border-b-0 active:translate-y-1 transition-all text-sm font-black"
                      >
                        Add Skills{" "}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div
            className={`bg-card rounded-3xl border-2 p-8 text-center shadow-sm ${
              canAnalyzeProfile
                ? "border-primary/30"
                : "border-border"
            }`}
          >
            <div className="max-w-2xl mx-auto">
              {!isPartner && (
                <div className="flex items-center justify-center gap-2 mb-5">
                  {[
                    {
                      label: "Upload Curriculum",
                      done: hasUploadedCurriculum,
                    },
                    {
                      label: "Add Skills",
                      done: hasAddedSkills,
                    },
                    {
                      label: "Analyze Profile",
                      done: false,
                      active: canAnalyzeProfile,
                    },
                  ].map((step, i, arr) => (
                    <div
                      key={step.label}
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs transition-all ${
                            step.done
                              ? "bg-secondary border-secondary text-secondary-foreground"
                              : step.active
                                ? "bg-primary border-primary text-primary-foreground"
                                : "bg-muted border-border text-muted-foreground"
                          }`}
                          style={{ fontWeight: 900 }}
                        >
                          {step.done ? "✓" : i + 1}
                        </div>
                        <span
                          className={`text-xs font-bold hidden sm:block ${
                            step.done
                              ? "text-secondary"
                              : step.active
                                ? "text-primary"
                                : "text-muted-foreground"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                      {i < arr.length - 1 && (
                        <div
                          className={`w-8 h-0.5 rounded-full ${
                            step.done
                              ? "bg-secondary/50"
                              : "bg-border"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              <h3
                className="text-foreground text-xl mb-2"
                style={{ fontWeight: 900 }}
              >
                {canAnalyzeProfile
                  ? isPartner
                    ? "Ready to Discover Your Career Matches?"
                    : "All Set — Let's Find Your Best Matches!"
                  : "Complete the Steps Above to Continue"}
              </h3>
              <p className="text-muted-foreground text-sm font-medium mb-6 leading-relaxed">
                {canAnalyzeProfile
                  ? "Our AI will analyze your profile and surface the top 3 roles that match your skills and academic background."
                  : "Please upload your curriculum and add at least one skill to unlock career matching."}
              </p>

              <button
                onClick={() => setIsAnalysisFlowOpen(true)}
                disabled={!canAnalyzeProfile}
                className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl border-b-4 text-base font-black transition-all ${
                  !canAnalyzeProfile
                    ? "bg-muted text-muted-foreground border-border cursor-not-allowed"
                    : isPartner
                      ? "bg-gradient-to-r from-secondary to-primary text-white border-primary hover:from-secondary/90 hover:to-primary/90 active:border-b-0 active:translate-y-1 shadow-lg hover:shadow-xl"
                      : "bg-gradient-to-r from-primary to-secondary text-white border-secondary hover:from-primary/90 hover:to-secondary/90 active:border-b-0 active:translate-y-1 shadow-lg hover:shadow-xl"
                }`}
              >
                <Zap className="w-5 h-5" />
                Analyze My Profile
              </button>

              {!canAnalyzeProfile && !isPartner && (
                <div className="mt-4 flex items-center justify-center gap-6 text-xs">
                  <div
                    className={`flex items-center gap-1.5 ${
                      hasUploadedCurriculum
                        ? "text-secondary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {hasUploadedCurriculum ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                    <span className="font-bold">
                      {hasUploadedCurriculum
                        ? "Curriculum uploaded"
                        : "Upload curriculum"}
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${
                      hasAddedSkills
                        ? "text-secondary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {hasAddedSkills ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Target className="w-4 h-4" />
                    )}
                    <span className="font-bold">
                      {hasAddedSkills
                        ? "Skills added"
                        : "Add skills"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {hasAnalyzedProfile && (
        <>
          {isPartner && (
            <div className="relative rounded-3xl overflow-hidden border-2 border-warning shadow-xl bg-warning/10">
              {" "}
              <div className="absolute left-3 top-3 bottom-3 w-0 bg-secondary" />
              <div className="pl-7 pr-5 py-5 flex items-start gap-4 bg-accent/30 dark:bg-accent/30">
                {" "}
                <div className="w-12 h-12 rounded-2xl bg-secondary/20 border-2 border-secondary/40 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Signal className="w-6 h-6 text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                    <h3 className="text-foreground font-black text-base">
                      Curriculum Auto-Synced with{" "}
                      {studentProfile.university}
                    </h3>
                    <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-black bg-secondary text-secondary-foreground px-2.5 py-1 rounded-lg shadow-sm flex-shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary-foreground/80 animate-pulse" />
                      Live
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm font-semibold leading-relaxed">
                    Your academic courses and skills are
                    automatically kept up-to-date.{" "}
                    <button
                      onClick={() =>
                        navigate("/student/profile")
                      }
                      className="underline font-black text-secondary hover:text-secondary/80 transition-colors"
                    >
                      Visit My Profile
                    </button>{" "}
                    to add extra courses, projects, or
                    experiences.
                  </p>
                </div>
                <button
                  onClick={() => setIsAnalysisFlowOpen(true)}
                  className="hidden sm:inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl border-b-4 border-secondary hover:bg-primary/90 active:border-b-0 active:translate-y-1 transition-all text-sm font-black flex-shrink-0 shadow-sm"
                >
                  <Zap className="w-4 h-4" />
                  Re-analyze
                </button>
              </div>
            </div>
          )}

          {!isPartner && (
            <div className="bg-accent/30 border-2 border-warning dark:bg-accent/30 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/15 border-2 border-primary/20 flex items-center justify-center flex-shrink-0">
                <RefreshCw className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-foreground font-black text-sm mb-0.5">
                  Updated your skills or curriculum?
                </h3>
                <p className="text-primary text-sm font-medium">
                  Re-run the analysis to refresh your Top 3
                  matches and match percentages.
                </p>
              </div>
              <button
                onClick={() => setIsAnalysisFlowOpen(true)}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl border-b-4 border-secondary hover:bg-primary/90 active:border-b-0 active:translate-y-1 transition-all text-sm font-black flex-shrink-0 shadow-sm"
              >
                <Zap className="w-4 h-4" />
                Re-analyze
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Courses Completed",
                value: totalCourses,
                icon: BookOpen,
                color:
                  "bg-primary/10 text-primary border-2 border-primary/20",
              },
              {
                label: "Skills Detected",
                value: totalSkills,
                icon: BarChart3,
                color:
                  "bg-secondary/15 text-secondary border-2 border-secondary/30",
              },
              {
                label: "Saved Roles",
                value:
                  savedRoles.length +
                  savedCustomAnalyses.length,
                icon: Bookmark,
                color:
                  "bg-accent/20 text-primary border-2 border-accent/40",
              },
              {
                label: "Top Match",
                value: `${
                  savedRoles.length > 0
                    ? Math.max(
                        ...savedRoles.map(
                          (r) =>
                            getRoleMatch(r.roleId).percentage,
                        ),
                      )
                    : (top3[0]?.percentage ?? 0)
                }%`,
                icon: Trophy,
                color:
                  "bg-accent/20 text-primary border-2 border-accent/40",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-card rounded-3xl p-5 border-2 border-border flex items-center gap-4 hover:-translate-y-1 hover:shadow-lg transition-all"
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${stat.color} shadow-sm`}
                >
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <div
                    className="text-foreground"
                    style={{
                      fontSize: "2rem",
                      fontWeight: 900,
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mt-1.5">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-card rounded-3xl border-2 border-border p-6 shadow-sm">
              <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
                <h2
                  className="text-foreground text-xl"
                  style={{ fontWeight: 900 }}
                >
                  👍 Recommended Roles
                </h2>
                <button
                  onClick={() => navigate("/student/roles")}
                  className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 font-black bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20"
                >
                  All Roles <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-4">
                {top3.map((rec, i) => {
                  const role = JOB_ROLES.find(
                    (r) => r.id === rec.roleId,
                  )!;
                  return (
                    <button
                      key={rec.roleId}
                      onClick={() =>
                        navigate(`/student/roles/${rec.roleId}`)
                      }
                      className="w-full flex items-center gap-4 p-4 rounded-2xl bg-background hover:bg-muted border-2 border-border/60 hover:border-primary/40 transition-all text-left group shadow-sm"
                    >
                      <div
                        className="text-muted-foreground/50 text-sm w-6 flex-shrink-0 group-hover:text-primary transition-colors"
                        style={{ fontWeight: 900 }}
                      >
                        #{i + 1}
                      </div>
                      <MatchRing percentage={rec.percentage} />
                      <div className="min-w-0">
                        <div
                          className="text-base text-foreground truncate"
                          style={{ fontWeight: 800 }}
                        >
                          {role.title}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-2 bg-card rounded-3xl border-2 border-border p-6 shadow-sm">
              <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
                <h2
                  className="text-foreground text-xl"
                  style={{ fontWeight: 900 }}
                >
                  📌 Saved Roles
                </h2>
                <button
                  onClick={() => setIsAddRolesModalOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 border-2 border-primary/20 px-4 py-2 rounded-xl font-black hover:bg-primary/10 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Role
                </button>
              </div>

              {savedRoles.length === 0 &&
              savedCustomAnalyses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center bg-muted rounded-2xl border-2 border-dashed border-border">
                  <Target className="w-12 h-12 text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground font-bold">
                    No roles saved yet.
                  </p>
                  <p className="text-muted-foreground/70 text-sm font-medium mt-1 mb-4">
                    Browse roles and bookmark ones you're
                    interested in.
                  </p>
                  <button
                    onClick={() => navigate("/student/roles")}
                    className="text-sm text-primary hover:text-primary/80 font-black bg-card px-4 py-2 rounded-xl shadow-sm border border-border"
                  >
                    Browse roles →
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedRoles.map((sr) => {
                    if (sr.isCustomJD) {
                      const pct = sr.customPercentage ?? 0;
                      const missingCount =
                        sr.customMissing?.length ?? 0;
                      const totalCount =
                        sr.customRequiredSkills?.length ?? 0;
                      return (
                        <div
                          key={sr.roleId}
                          onClick={() =>
                            navigate(
                              `/student/custom/${sr.roleId}`,
                            )
                          }
                          className="flex items-center gap-5 p-5 rounded-2xl border-2 border-secondary/20 hover:border-secondary/40 transition-all bg-secondary/5 hover:bg-card cursor-pointer group"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span
                                className="text-base text-foreground truncate group-hover:text-secondary transition-colors"
                                style={{ fontWeight: 800 }}
                              >
                                {sr.customTitle ??
                                  "Custom Role"}
                              </span>
                              <span className="text-[10px] uppercase tracking-wider font-black bg-secondary/20 text-secondary px-2 py-0.5 rounded-lg border border-secondary/30 flex-shrink-0">
                                JD Custom
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground font-medium mb-3">
                              {totalCount} skills detected ·{" "}
                              {missingCount} to acquire
                            </p>
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden max-w-48 shadow-inner">
                                <div
                                  className="h-full rounded-full transition-all duration-1000"
                                  style={matchBarStyle(pct)}
                                />
                              </div>
                              <span
                                className="text-sm text-foreground"
                                style={{ fontWeight: 900 }}
                              >
                                {pct}% match
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setUnsaveCustomJD({
                                  roleId: sr.roleId,
                                  title:
                                    sr.customTitle ??
                                    "Custom Role",
                                });
                              }}
                              className="p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-xl bg-card shadow-sm border border-border transition-all"
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    }

                    const role = JOB_ROLES.find(
                      (r) => r.id === sr.roleId,
                    );
                    if (!role) return null;
                    const match = getRoleMatch(sr.roleId);
                    return (
                      <div
                        key={sr.roleId}
                        onClick={() =>
                          navigate(
                            `/student/roles/${sr.roleId}`,
                            { state: { from: "dashboard" } },
                          )
                        }
                        className="flex items-center gap-5 p-5 rounded-2xl border-2 border-border hover:border-primary/50 transition-all bg-muted/30 hover:bg-card cursor-pointer group"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <span
                              className="text-base text-foreground truncate group-hover:text-primary transition-colors"
                              style={{ fontWeight: 800 }}
                            >
                              {role.title}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground font-medium leading-relaxed mb-3 line-clamp-1">
                            {role.description}
                          </p>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden max-w-48 shadow-inner">
                              <div
                                className="h-full rounded-full transition-all duration-1000"
                                style={matchBarStyle(
                                  match.percentage,
                                )}
                              />
                            </div>
                            <span
                              className="text-sm text-foreground"
                              style={{ fontWeight: 900 }}
                            >
                              {match.percentage}% match
                            </span>
                            <span className="text-xs text-muted-foreground font-bold">
                              {match.missing.length} to acquire
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSavedRole(sr.roleId);
                            }}
                            className="p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-xl bg-card shadow-sm border border-border transition-all"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {savedCustomAnalyses.map((ca) => (
                    <div
                      key={ca.id}
                      onClick={() =>
                        navigate(`/student/custom/${ca.id}`)
                      }
                      className="flex items-center gap-5 p-5 rounded-2xl border-2 border-secondary/20 hover:border-secondary/40 transition-all bg-secondary/5 hover:bg-card cursor-pointer group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className="text-base text-foreground truncate group-hover:text-secondary transition-colors"
                            style={{ fontWeight: 800 }}
                          >
                            {ca.title}
                          </span>
                          <span className="text-[10px] uppercase tracking-wider font-black bg-secondary/20 text-secondary px-2 py-0.5 rounded-lg border border-secondary/30 flex-shrink-0">
                            Custom JD
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground font-medium mb-3">
                          {ca.requiredSkills.length} skills
                          detected · {ca.missing.length} to
                          acquire
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden max-w-48 shadow-inner">
                            <div
                              className="h-full rounded-full transition-all duration-1000"
                              style={matchBarStyle(
                                ca.percentage,
                              )}
                            />
                          </div>
                          <span
                            className="text-sm text-foreground"
                            style={{ fontWeight: 900 }}
                          >
                            {ca.percentage}% match
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setUnsaveCustomJD({
                              roleId: ca.id,
                              title: ca.title,
                              isLegacy: true,
                              legacyId: ca.id,
                            });
                          }}
                          className="p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-xl bg-card shadow-sm border border-border transition-all"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <AddRolesModal
        isOpen={isAddRolesModalOpen}
        onClose={() => setIsAddRolesModalOpen(false)}
      />
      <AnalysisFlowModal
        isOpen={isAnalysisFlowOpen}
        onClose={() => setIsAnalysisFlowOpen(false)}
      />

      {unsaveCustomJD && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setUnsaveCustomJD(null)}
          />
          <div className="relative bg-card rounded-3xl border-2 border-border shadow-2xl w-full max-w-md p-8 z-10">
            <div className="flex items-center justify-center mb-5">
              <div className="w-16 h-16 rounded-2xl bg-destructive/10 border-2 border-destructive/30 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
            </div>
            <h2
              className="text-foreground text-center mb-2"
              style={{ fontSize: "1.25rem", fontWeight: 900 }}
            >
              Remove Custom JD Role?
            </h2>
            <p className="text-muted-foreground text-sm text-center font-medium leading-relaxed mb-2">
              You're about to remove{" "}
              <span className="text-foreground font-black">
                "{unsaveCustomJD.title}"
              </span>
              .
            </p>
            <div className="bg-destructive/8 border border-destructive/25 rounded-2xl px-4 py-3 mb-6 text-center">
              <p className="text-destructive text-sm font-black">
                ⚠️ This cannot be undone.
              </p>
              <p className="text-muted-foreground text-xs font-semibold mt-1">
                All match data, skill analysis, and history for
                this custom JD will be permanently deleted.
                You'll need to re-paste the job description to
                restore it.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setUnsaveCustomJD(null)}
                className="flex-1 py-3 rounded-2xl border-2 border-border text-foreground font-black text-sm hover:bg-muted transition-all"
              >
                Keep It
              </button>
              <button
                onClick={() => {
                  if (
                    unsaveCustomJD.isLegacy &&
                    unsaveCustomJD.legacyId
                  ) {
                    removeSavedCustomAnalysis(
                      unsaveCustomJD.legacyId,
                    );
                  } else {
                    removeSavedRole(unsaveCustomJD.roleId);
                  }
                  setUnsaveCustomJD(null);
                }}
                className="flex-1 py-3 rounded-2xl bg-destructive text-white font-black text-sm border-b-4 border-destructive/70 hover:bg-destructive/90 active:border-b-0 active:translate-y-1 transition-all"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}