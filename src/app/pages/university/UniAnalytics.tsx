import { useState } from "react";
import { UNI_MOCK_DATA } from "../../data/mockData";
import { AlertCircle, TrendingUp, CheckCircle, XCircle, Download, ChevronLeft, ChevronRight } from "lucide-react";

// ─── Custom Horizontal Bar Chart (replaces recharts BarChart) ────────────────
function HorizontalBarChart({ data }: { data: { role: string; count: number; trend: string }[] }) {
  const [tooltip, setTooltip] = useState<{ index: number } | null>(null);
  const maxVal = Math.max(...data.map((d) => d.count), 1);

  const svgW = 600;
  const barH = 22;
  const gap = 14;
  const padL = 120;
  const padR = 50;
  const padT = 10;
  const chartW = svgW - padL - padR;
  const svgH = padT + data.length * (barH + gap);

  const getBarW = (v: number) => (v / maxVal) * chartW;
  const getBarY = (i: number) => padT + i * (barH + gap);

  return (
    <div className="relative w-full h-full">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} width="100%" height="100%" style={{ overflow: "visible" }}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
          const x = padL + t * chartW;
          return (
            <g key={`grid-${i}`}>
              <line x1={x} y1={padT} x2={x} y2={svgH} stroke="var(--color-border)" strokeDasharray="3 3" />
              <text x={x} y={svgH + 12} textAnchor="middle" fontSize={9} fill="var(--color-muted-foreground)">
                {Math.round(maxVal * t)}
              </text>
            </g>
          );
        })}

        {data.map((d, i) => {
          const bw = getBarW(d.count);
          const by = getBarY(i);
          const isHovered = tooltip?.index === i;

          return (
            <g key={`bar-${i}`}>
              {/* Role label */}
              <text x={padL - 8} y={by + barH / 2 + 4} textAnchor="end" fontSize={10} fill="var(--color-muted-foreground)" fontWeight={500}>
                {d.role}
              </text>
              {/* Background track */}
              <rect x={padL} y={by} width={chartW} height={barH} fill="var(--color-muted)" rx={4} />
              {/* Bar */}
              <rect
                x={padL} y={by} width={bw} height={barH}
                fill={isHovered ? "var(--color-secondary)" : "var(--color-primary)"} rx={4}
                style={{ cursor: "pointer", transition: "fill 0.15s" }}
                onMouseEnter={() => setTooltip({ index: i })}
                onMouseLeave={() => setTooltip(null)}
              />
              {/* Count label */}
              <text x={padL + bw + 6} y={by + barH / 2 + 4} fontSize={9.5} fill="var(--color-muted-foreground)" fontWeight={600}>
                {d.count}
              </text>

              {/* Tooltip */}
              {isHovered && (
                <g>
                  <rect x={padL + bw / 2 - 54} y={by - 38} width={108} height={34} rx={6}
                    fill="var(--color-card)" stroke="var(--color-border)" strokeWidth={1}
                    style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.08))" }} />
                  <text x={padL + bw / 2} y={by - 22} textAnchor="middle" fontSize={9} fill="var(--color-foreground)" fontWeight={600}>{d.role}</text>
                  <text x={padL + bw / 2} y={by - 11} textAnchor="middle" fontSize={8.5} fill="var(--color-primary)">{d.count} students · {d.trend}</text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function UniAnalytics() {
  const [period, setPeriod] = useState("2025-1");
  const [skillFilter, setSkillFilter] = useState<"All" | "Not in Curriculum" | "Covered">("All");
  const [skillPage, setSkillPage] = useState(1);
  const skillsPerPage = 10;

  // Filter skills based on selected filter
  const filteredSkills = UNI_MOCK_DATA.highDemandMissingSkills.filter((item) => {
    if (skillFilter === "Covered") return item.coveredByCurriculum;
    if (skillFilter === "Not in Curriculum") return !item.coveredByCurriculum;
    return true;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredSkills.length / skillsPerPage);
  const startIndex = (skillPage - 1) * skillsPerPage;
  const endIndex = startIndex + skillsPerPage;
  const paginatedSkills = filteredSkills.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  const handleFilterChange = (filter: "All" | "Not in Curriculum" | "Covered") => {
    setSkillFilter(filter);
    setSkillPage(1);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-foreground" style={{ fontSize: "1.75rem", fontWeight: 800 }}>Interest Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Aggregate data on student career interests — no individual identities are shown (PDPA compliant).
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="text-sm border border-border rounded-xl px-3 py-2 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="2025-1">Semester 1/2025</option>
            <option value="2024-2">Semester 2/2024</option>
            <option value="2024-1">Semester 1/2024</option>
          </select>
          <button className="flex items-center gap-2 text-sm text-muted-foreground border border-border px-3 py-2 rounded-xl hover:bg-muted transition-colors">
            <Download className="w-4 h-4" />
            Export report
          </button>
        </div>
      </div>

      {/* Privacy notice */}
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-center gap-3 text-sm text-foreground">
        <AlertCircle className="w-4 h-4 flex-shrink-0 text-primary" />
        All data is aggregated. Individual student identities are never revealed in compliance with PDPA.
      </div>

      {/* Charts row */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="text-foreground mb-1" style={{ fontWeight: 700 }}>Top Job Roles by Interest</h2>
        <p className="text-xs text-muted-foreground mb-4">Number of students who saved each role</p>
        <div className="h-64">
          <HorizontalBarChart data={UNI_MOCK_DATA.topRoles} />
        </div>
      </div>

      {/* Skill Gap Analysis */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-start justify-between mb-5 flex-wrap gap-4">
          <div>
            <h2 className="text-foreground" style={{ fontWeight: 700 }}>High-Demand Skills</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Skills your students frequently need for their target roles, compared to your curriculum coverage
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            {/* Filter buttons */}
            <div className="flex gap-2">
              {(["All", "Not in Curriculum", "Covered"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => handleFilterChange(f)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-bold ${
                    skillFilter === f
                      ? f === "Covered"
                        ? "bg-success text-success-foreground border-success/80 shadow-sm"
                        : f === "Not in Curriculum"
                        ? "bg-destructive text-destructive-foreground border-destructive/80 shadow-sm"
                        : "bg-primary text-primary-foreground border-primary/80 shadow-sm"
                      : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-success inline-block" />In curriculum</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-destructive inline-block" />Gap identified</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 text-xs text-muted-foreground uppercase tracking-wide" style={{ fontWeight: 600 }}>Skill</th>
                <th className="pb-3 text-xs text-muted-foreground uppercase tracking-wide" style={{ fontWeight: 600 }}>Students Needing</th>
                <th className="pb-3 text-xs text-muted-foreground uppercase tracking-wide" style={{ fontWeight: 600 }}>Demand</th>
                <th className="pb-3 text-xs text-muted-foreground uppercase tracking-wide" style={{ fontWeight: 600 }}>Curriculum Coverage</th>
                <th className="pb-3 text-xs text-muted-foreground uppercase tracking-wide" style={{ fontWeight: 600 }}>Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {paginatedSkills.map((item) => (
                <tr key={item.skill} className="hover:bg-muted/50 transition-colors">
                  <td className="py-3 text-foreground" style={{ fontWeight: 500 }}>{item.skill}</td>
                  <td className="py-3 text-muted-foreground">{item.demand} students</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${item.coveredByCurriculum ? "bg-success" : "bg-warning"}`} style={{ width: `${(item.demand / 312) * 100}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{Math.round((item.demand / 312) * 100)}%</span>
                    </div>
                  </td>
                  <td className="py-3">
                    {item.coveredByCurriculum ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-foreground bg-success/10 border border-success/30 px-2.5 py-1 rounded-full">
                        <CheckCircle className="w-3.5 h-3.5 text-success" />
                        Covered
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-foreground bg-destructive/10 border border-destructive/30 px-2.5 py-1 rounded-full">
                        <XCircle className="w-3.5 h-3.5 text-destructive" />
                        Not covered
                      </span>
                    )}
                  </td>
                  <td className="py-3">
                    {!item.coveredByCurriculum && (
                      <button className="text-xs text-primary hover:text-primary/80 flex items-center gap-1" style={{ fontWeight: 500 }}>
                        <TrendingUp className="w-3.5 h-3.5" />
                        Add to curriculum
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredSkills.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No skills match the selected filter.
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-border">
            <button
              onClick={() => setSkillPage((prev) => Math.max(prev - 1, 1))}
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
            
            <span className="px-4 py-2 text-sm text-muted-foreground" style={{ fontWeight: 600 }}>
              <span className="text-primary">{startIndex + 1}–{Math.min(endIndex, filteredSkills.length)}</span>
              {" "}of{" "}
              <span className="text-primary">{filteredSkills.length}</span> skills
            </span>

            <button
              onClick={() => setSkillPage((prev) => Math.min(prev + 1, totalPages))}
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

      {/* Growth Trends */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="text-foreground mb-1" style={{ fontWeight: 700 }}>Role Interest Growth Trends</h2>
        <p className="text-xs text-muted-foreground mb-4">Month-over-month trend for top roles this semester</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {UNI_MOCK_DATA.topRoles.slice(0, 6).map((role) => (
            <div key={role.role} className="border border-border rounded-xl p-4">
              <div className="text-sm text-foreground mb-1" style={{ fontWeight: 600 }}>{role.role}</div>
              <div className="flex items-center justify-between">
                <div className="text-foreground" style={{ fontWeight: 700, fontSize: "1.25rem" }}>
                  {role.count}
                </div>
                <span className="text-xs text-foreground flex items-center gap-1 bg-success/10 border border-success/30 px-2 py-0.5 rounded-full">
                  <TrendingUp className="w-3 h-3 text-success" />
                  {role.trend}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">students tracking this role</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}