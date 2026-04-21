import { useNavigate } from "react-router";
import {
  Users,
  TrendingUp,
  BarChart3,
  FileUp,
  ChevronRight,
  ArrowUp,
  Activity,
  ChevronLeft,
} from "lucide-react";
import { UNI_MOCK_DATA } from "../../data/mockData";
import { useState } from "react";

function MiniLineChart({
  data,
}: {
  data: { month: string; users: number }[];
}) {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    month: string;
    users: number;
  } | null>(null);
  const svgW = 460;
  const svgH = 190;
  const padL = 42;
  const padR = 12;
  const padT = 12;
  const padB = 28;
  const chartW = svgW - padL - padR;
  const chartH = svgH - padT - padB;

  const maxV = Math.max(...data.map((d) => d.users));
  const minV = Math.min(...data.map((d) => d.users)) * 0.85;
  const range = maxV - minV || 1;

  const getX = (i: number) =>
    padL + (i / (data.length - 1)) * chartW;
  const getY = (v: number) =>
    padT + chartH - ((v - minV) / range) * chartH;

  const polyline = data
    .map((d, i) => `${getX(i)},${getY(d.users)}`)
    .join(" ");

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
    y: padT + t * chartH,
    val: Math.round(maxV - t * (maxV - minV)),
  }));

  return (
    <div className="relative w-full h-full">
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        width="100%"
        height="100%"
        style={{ overflow: "visible" }}
      >
        {yTicks.map((t, i) => (
          <g key={`ytick-${i}`}>
            <line
              x1={padL}
              y1={t.y}
              x2={svgW - padR}
              y2={t.y}
              stroke="var(--border)"
              strokeDasharray="3 3"
            />
            <text
              x={padL - 6}
              y={t.y + 4}
              textAnchor="end"
              fontSize={9}
              fill="var(--muted-foreground)"
            >
              {t.val}
            </text>
          </g>
        ))}

        <polygon
          points={`${padL},${padT + chartH} ${polyline} ${svgW - padR},${padT + chartH}`}
          fill="var(--primary)"
          fillOpacity={0.07}
        />

        <polyline
          points={polyline}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {data.map((d, i) => {
          const cx = getX(i);
          const cy = getY(d.users);
          return (
            <g key={`dot-${i}`}>
              <circle
                cx={cx}
                cy={cy}
                r={4}
                fill="var(--primary)"
              />
              <circle
                cx={cx}
                cy={cy}
                r={12}
                fill="transparent"
                style={{ cursor: "pointer" }}
                onMouseEnter={() =>
                  setTooltip({
                    x: cx,
                    y: cy,
                    month: d.month,
                    users: d.users,
                  })
                }
                onMouseLeave={() => setTooltip(null)}
              />
            </g>
          );
        })}

        {data.map((d, i) => (
          <text
            key={`xlabel-${i}`}
            x={getX(i)}
            y={svgH - 4}
            textAnchor="middle"
            fontSize={10}
            fill="var(--muted-foreground)"
          >
            {d.month}
          </text>
        ))}

        {tooltip && (
          <g>
            <rect
              x={tooltip.x - 44}
              y={tooltip.y - 40}
              width={88}
              height={34}
              rx={6}
              fill="var(--card)"
              stroke="var(--border)"
              strokeWidth={1}
              style={{
                filter:
                  "drop-shadow(0 2px 4px rgba(0,0,0,0.08))",
              }}
            />
            <text
              x={tooltip.x}
              y={tooltip.y - 22}
              textAnchor="middle"
              fontSize={9}
              fill="var(--foreground)"
              fontWeight={600}
            >
              {tooltip.month}
            </text>
            <text
              x={tooltip.x}
              y={tooltip.y - 11}
              textAnchor="middle"
              fontSize={9}
              fill="var(--primary)"
            >
              {tooltip.users} active users
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

function SkillBarChart({
  data,
}: {
  data: {
    skill: string;
    demand: number;
    coveredByCurriculum: boolean;
  }[];
}) {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    skill: string;
    demand: number;
    covered: boolean;
  } | null>(null);

  const svgW = 700;
  const svgH = 172;
  const padL = 10;
  const padR = 10;
  const padT = 10;
  const padB = 44;
  const chartW = svgW - padL - padR;
  const chartH = svgH - padT - padB;

  const maxV = Math.max(...data.map((d) => d.demand), 1);
  const barCount = data.length;
  const totalGap = barCount > 1 ? (barCount - 1) * 8 : 0;
  const barW =
    barCount > 0
      ? Math.max(20, (chartW - totalGap) / barCount)
      : 0;

  const getX = (i: number) => padL + i * (barW + 8);
  const getBarH = (v: number) => (v / maxV) * chartH;

  const yTicks = [0, 0.5, 1].map((t) => ({
    y: padT + t * chartH,
    val: Math.round(maxV * (1 - t)),
  }));

  return (
    <div className="relative w-full h-full">
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        width="100%"
        height="100%"
        style={{ overflow: "visible" }}
      >
        {yTicks.map((t, i) => (
          <g key={`yg-${i}`}>
            <line
              x1={padL}
              y1={t.y}
              x2={svgW - padR}
              y2={t.y}
              stroke="var(--border)"
              strokeDasharray="3 3"
            />
            <text
              x={padL - 2}
              y={t.y + 3}
              textAnchor="end"
              fontSize={8}
              fill="var(--muted-foreground)"
            >
              {t.val}
            </text>
          </g>
        ))}

        {data.map((d, i) => {
          const bh = getBarH(d.demand);
          const bx = getX(i);
          const by = padT + chartH - bh;
          const fill = d.coveredByCurriculum
            ? "var(--secondary)"
            : "var(--warning)";
          const midX = bx + barW / 2;

          return (
            <g key={`bar-${d.skill}-${i}`}>
              <rect
                x={bx}
                y={by}
                width={barW}
                height={bh}
                fill={fill}
                rx={3}
                ry={3}
                style={{ cursor: "pointer" }}
                onMouseEnter={() =>
                  setTooltip({
                    x: midX,
                    y: by,
                    skill: d.skill,
                    demand: d.demand,
                    covered: d.coveredByCurriculum,
                  })
                }
                onMouseLeave={() => setTooltip(null)}
              />
              <text
                x={midX}
                y={padT + chartH + 8}
                textAnchor="end"
                fontSize={8.5}
                fill="var(--muted-foreground)"
                transform={`rotate(-28 ${midX} ${padT + chartH + 8})`}
              >
                {d.skill}
              </text>
            </g>
          );
        })}

        {tooltip && (
          <g>
            <rect
              x={Math.min(tooltip.x - 50, svgW - 106)}
              y={Math.max(tooltip.y - 52, 4)}
              width={106}
              height={48}
              rx={6}
              fill="var(--card)"
              stroke="var(--border)"
              strokeWidth={1}
              style={{
                filter:
                  "drop-shadow(0 2px 4px rgba(0,0,0,0.08))",
              }}
            />
            <text
              x={Math.min(tooltip.x, svgW - 53)}
              y={Math.max(tooltip.y - 36, 18)}
              textAnchor="middle"
              fontSize={9}
              fill="var(--foreground)"
              fontWeight={600}
            >
              {tooltip.skill}
            </text>
            <text
              x={Math.min(tooltip.x, svgW - 53)}
              y={Math.max(tooltip.y - 24, 30)}
              textAnchor="middle"
              fontSize={8.5}
              fill="var(--primary)"
            >
              {tooltip.demand} students need this
            </text>
            <text
              x={Math.min(tooltip.x, svgW - 53)}
              y={Math.max(tooltip.y - 13, 41)}
              textAnchor="middle"
              fontSize={8.5}
              fill={
                tooltip.covered
                  ? "var(--secondary)"
                  : "var(--destructive)"
              }
            >
              {tooltip.covered
                ? "✓ In curriculum"
                : "✗ Not in curriculum"}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

export default function UniDashboard() {
  const navigate = useNavigate();
  const [skillFilter, setSkillFilter] = useState<
    "all" | "missing" | "covered"
  >("all");
  const [skillPage, setSkillPage] = useState(1);
  const skillsPerPage = 10;

  const filteredSkills =
    UNI_MOCK_DATA.highDemandMissingSkills.filter((s) => {
      if (skillFilter === "missing")
        return !s.coveredByCurriculum;
      if (skillFilter === "covered")
        return s.coveredByCurriculum;
      return true;
    });

  const totalPages = Math.ceil(
    filteredSkills.length / skillsPerPage,
  );
  const startIndex = (skillPage - 1) * skillsPerPage;
  const endIndex = startIndex + skillsPerPage;
  const paginatedSkills = filteredSkills.slice(
    startIndex,
    endIndex,
  );

  const handleFilterChange = (
    filter: "all" | "missing" | "covered",
  ) => {
    setSkillFilter(filter);
    setSkillPage(1);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-foreground"
            style={{ fontSize: "1.75rem", fontWeight: 800 }}
          >
            University Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Thammasat University · Partner Portal
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/university/upload")}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors text-sm"
            style={{ fontWeight: 600 }}
          >
            <FileUp className="w-4 h-4" />
            Upload data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Enrolled Students",
            value:
              UNI_MOCK_DATA.enrolledStudents.toLocaleString(),
            icon: Users,
            iconColor: "text-primary",
            iconBg: "bg-primary/10 border-primary/20",
            sub: "Total enrollment",
          },
          {
            label: "Active Users",
            value: UNI_MOCK_DATA.activeUsers.toLocaleString(),
            icon: Activity,
            iconColor: "text-secondary",
            iconBg: "bg-secondary/15 border-secondary/30",
            sub: "This month",
          },
          {
            label: "Top Tracked Role",
            value: "Frontend Dev",
            icon: TrendingUp,
            iconColor: "text-primary",
            iconBg: "bg-accent/20 border-accent/40",
            sub: "312 students",
          },
          {
            label: "Skill Gaps Found",
            value: "8",
            icon: BarChart3,
            iconColor: "text-destructive",
            iconBg: "bg-destructive/10 border-destructive/30",
            sub: "Missing from curriculum",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-card rounded-2xl border-2 border-border p-5 flex items-center gap-4 hover:-translate-y-1 hover:shadow-md transition-all"
          >
            <div
              className={`w-12 h-12 rounded-xl ${stat.iconBg} border-2 ${stat.iconColor} flex items-center justify-center flex-shrink-0 shadow-sm`}
            >
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div
                className="text-foreground truncate"
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 900,
                  lineHeight: 1.1,
                }}
                title={stat.value}
              >
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground font-semibold mt-1">
                {stat.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-card rounded-2xl border border-border p-6">
          <h2
            className="text-foreground mb-1"
            style={{ fontWeight: 700 }}
          >
            Monthly Active Users
          </h2>
          <p className="text-xs text-muted-foreground font-bold mb-4">
            Students actively using UniPath this academic year
          </p>
          <div className="h-52">
            <MiniLineChart
              data={UNI_MOCK_DATA.monthlyActiveUsers}
            />
          </div>
        </div>

        <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-foreground"
              style={{ fontWeight: 700 }}
            >
              Top Interest Roles
            </h2>
            <button
              onClick={() => navigate("/university/analytics")}
              className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
              style={{ fontWeight: 500 }}
            >
              Full report <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {UNI_MOCK_DATA.topRoles.map((role, i) => (
              <div
                key={role.role}
                className="flex items-center gap-3"
              >
                <span
                  className="text-xs text-muted-foreground w-4"
                  style={{ fontWeight: 700 }}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1 min-w-0">
                    <span
                      className="text-xs text-foreground truncate flex-1 min-w-0"
                      style={{ fontWeight: 600 }}
                      title={role.role}
                    >
                      {role.role}
                    </span>
                    <span className="text-xs text-foreground flex items-center gap-0.5 flex-shrink-0 ml-2">
                      <ArrowUp className="w-3 h-3 text-success" />
                      {role.trend}
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{
                        width: `${(role.count / 312) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {role.count} students
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2
              className="text-foreground"
              style={{ fontWeight: 700 }}
            >
              High-Demand Skills
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Skills frequently required by students' target
              roles — showing curriculum coverage status
            </p>
          </div>
          <button
            onClick={() => navigate("/university/analytics")}
            className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80"
            style={{ fontWeight: 500 }}
          >
            View all <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          {(["all", "missing", "covered"] as const).map((f) => (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                skillFilter === f
                  ? f === "missing"
                    ? "bg-destructive text-destructive-foreground"
                    : f === "covered"
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {f === "all"
                ? "All Skills"
                : f === "missing"
                  ? "Not in Curriculum"
                  : "Covered"}
            </button>
          ))}
        </div>

        <div className="h-48">
          <SkillBarChart data={paginatedSkills} />
        </div>

        <div className="flex gap-4 text-xs text-muted-foreground mt-2">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-warning inline-block" />
            Not in curriculum
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-secondary inline-block" />
            Covered by curriculum
          </span>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-border">
            <button
              onClick={() =>
                setSkillPage((prev) => Math.max(prev - 1, 1))
              }
              disabled={skillPage === 1}
              className={`p-2 rounded-lg border transition-all ${
                skillPage === 1
                  ? "border-border text-muted-foreground/40 cursor-not-allowed"
                  : "border-border text-muted-foreground hover:bg-muted hover:border-border"
              }`}
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span
              className="px-4 py-2 text-sm text-muted-foreground"
              style={{ fontWeight: 600 }}
            >
              <span className="text-primary">
                {startIndex + 1}–
                {Math.min(endIndex, filteredSkills.length)}
              </span>{" "}
              of{" "}
              <span className="text-primary">
                {filteredSkills.length}
              </span>{" "}
              skills
            </span>

            <button
              onClick={() =>
                setSkillPage((prev) =>
                  Math.min(prev + 1, totalPages),
                )
              }
              disabled={skillPage === totalPages}
              className={`p-2 rounded-lg border transition-all ${
                skillPage === totalPages
                  ? "border-border text-muted-foreground/40 cursor-not-allowed"
                  : "border-border text-muted-foreground hover:bg-muted hover:border-border"
              }`}
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}