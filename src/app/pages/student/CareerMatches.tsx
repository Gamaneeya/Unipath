import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Target,
  Trophy,
  LayoutDashboard,
} from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { JOB_ROLES } from "../../data/mockData";

function MatchRing({
  percentage,
  size = 80,
}: {
  percentage: number;
  size?: number;
}) {
  const r = (size / 2) * 0.75;
  const circ = 2 * Math.PI * r;
  const fill = (percentage / 100) * circ;
  const color =
    percentage >= 70
      ? "var(--secondary)"
      : percentage >= 50
        ? "var(--accent)"
        : "var(--destructive)";
  const cx = size / 2;
  const cy = size / 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
    >
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="var(--muted)"
        strokeWidth="7"
      />
      <motion.circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="7"
        strokeDasharray={`${circ} ${circ}`}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - fill }}
        transition={{
          duration: 1.4,
          ease: "easeOut",
          delay: 0.3,
        }}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      <text
        x={cx}
        y={cy + 5}
        textAnchor="middle"
        fill={color}
        fontSize={size * 0.18}
        fontWeight="900"
        fontFamily="Nunito, sans-serif"
      >
        {percentage}%
      </text>
    </svg>
  );
}

const RANK_COLORS = [
  {
    bg: "bg-card",
    border: "border-accent/50",
    hoverBorder: "hover:border-accent",
    badge:
      "bg-accent/20 text-accent-foreground border-accent/40",
    label: "🥇 Best Match",
  },
  {
    bg: "bg-card",
    border: "border-primary/30",
    hoverBorder: "hover:border-primary",
    badge: "bg-primary/15 text-primary border-primary/30",
    label: "🥈 2nd Match",
  },
  {
    bg: "bg-card",
    border: "border-secondary/30",
    hoverBorder: "hover:border-secondary",
    badge: "bg-secondary/15 text-secondary border-secondary/30",
    label: "🥉 3rd Match",
  },
];

export default function CareerMatches() {
  const navigate = useNavigate();
  const {
    getTop3Recommendations,
    getRoleMatch,
    userName,
    studentProfile,
  } = useApp();

  const top3 = getTop3Recommendations();
  const displayName = (userName || studentProfile.name).split(
    " ",
  )[0];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-start py-10 px-4 font-sans">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10 max-w-2xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 bg-secondary/15 text-secondary border-2 border-secondary px-4 py-1.5 rounded-full mb-5">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-black uppercase tracking-wider">
            Analysis Complete
          </span>
        </div>
        <h1
          className="text-foreground mb-3"
          style={{ fontSize: "2.25rem", fontWeight: 900 }}
        >
          Your Top Career Matches
        </h1>
        <p className="text-muted-foreground font-bold text-base">
          Hey {displayName}! Based on your skills and
          experience, here are your best-fit roles. Click any
          card to explore the full analysis.
        </p>
      </motion.div>

      {/* Role Cards */}
      <div className="w-full max-w-3xl space-y-5 mb-10">
        {top3.map((rec, i) => {
          const role = JOB_ROLES.find(
            (r) => r.id === rec.roleId,
          );
          if (!role) return null;
          const match = getRoleMatch(rec.roleId);
          const colors = RANK_COLORS[i];

          return (
            <motion.button
              key={rec.roleId}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.5,
                delay: i * 0.18,
                ease: "easeOut",
              }}
              whileHover={{ scale: 1.015, y: -3 }}
              whileTap={{ scale: 0.99 }}
              onClick={() =>
                navigate(`/student/roles/${rec.roleId}`, {
                  state: { from: "career-matches" },
                })
              }
              className={`w-full ${colors.bg} rounded-3xl p-6 border-2 ${colors.border} ${colors.hoverBorder} hover:shadow-xl transition-all text-left flex items-center gap-6 group cursor-pointer`}
            >
              {/* Rank Badge */}
              <div className="flex-shrink-0 flex flex-col items-center gap-2">
                <MatchRing
                  percentage={rec.percentage}
                  size={90}
                />
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-xl border ${colors.badge}`}
                >
                  {colors.label}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1.5">
                  <h2
                    className="text-foreground truncate"
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: 900,
                    }}
                  >
                    {role.title}
                  </h2>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-card/70 text-muted-foreground px-2 py-0.5 rounded-lg border border-border flex-shrink-0">
                    {role.category}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-4 line-clamp-2">
                  {role.description}
                </p>

                {/* Skills preview */}
                <div className="flex flex-wrap gap-2">
                  {match.acquired.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] font-black uppercase tracking-wider bg-secondary/15 text-secondary border border-secondary/30 px-2 py-0.5 rounded-lg flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {skill}
                    </span>
                  ))}
                  {match.missing.length > 0 && (
                    <span className="text-[10px] font-black uppercase tracking-wider bg-warning/15 text-warning border border-warning/30 px-2 py-0.5 rounded-lg flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {match.missing.length} to learn
                    </span>
                  )}
                </div>
              </div>

              {/* Arrow */}
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-card/60 border border-border flex items-center justify-center group-hover:bg-card group-hover:border-border transition-all shadow-sm">
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Continue to Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="text-center space-y-4"
      >
        <button
          onClick={() => navigate("/student")}
          className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-10 py-4 rounded-2xl border-b-4 border-secondary hover:bg-primary/90 active:border-b-0 active:translate-y-1 transition-all shadow-lg hover:shadow-xl"
          style={{ fontWeight: 900, fontSize: "1rem" }}
        >
          <LayoutDashboard className="w-5 h-5" />
          Continue to Dashboard
          <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-sm text-muted-foreground font-bold">
          Your results are saved and will appear on your
          dashboard
        </p>
      </motion.div>

      {/* Floating trophy decoration */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.4,
          delay: 0.9,
          type: "spring",
        }}
        className="fixed bottom-8 right-8 w-14 h-14 bg-accent/25 border-2 border-accent/50 rounded-2xl flex items-center justify-center shadow-lg hidden lg:flex"
      >
        <Trophy className="w-7 h-7 text-accent-foreground" />
      </motion.div>
    </div>
  );
}