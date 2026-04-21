import { useState } from "react";
import { Search, Users, BarChart3, TrendingUp, Filter, ShieldCheck } from "lucide-react";

const MOCK_STUDENTS = [
  { id: "STD001", year: 3, topRole: "Frontend Developer", matchPct: 72, status: "Active" },
  { id: "STD002", year: 2, topRole: "Data Analyst", matchPct: 58, status: "Active" },
  { id: "STD003", year: 4, topRole: "Product Manager", matchPct: 81, status: "Active" },
  { id: "STD004", year: 1, topRole: "UX Designer", matchPct: 45, status: "Active" },
  { id: "STD005", year: 3, topRole: "Backend Developer", matchPct: 66, status: "Inactive" },
  { id: "STD006", year: 4, topRole: "Data Scientist", matchPct: 89, status: "Active" },
  { id: "STD007", year: 2, topRole: "ML Engineer", matchPct: 52, status: "Active" },
  { id: "STD008", year: 3, topRole: "DevOps Engineer", matchPct: 44, status: "Inactive" },
];

export default function UniStudents() {
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("All");

  const filtered = MOCK_STUDENTS.filter((s) => {
    const matchesSearch = s.id.includes(search) || s.topRole.toLowerCase().includes(search.toLowerCase());
    const matchesYear = yearFilter === "All" || s.year.toString() === yearFilter;
    return matchesSearch && matchesYear;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-foreground" style={{ fontSize: "1.75rem", fontWeight: 800 }}>Students</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Enrolled students actively using UniPath. Aggregated match data shown.
        </p>
      </div>

      {/* Privacy notice */}
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-center gap-3 text-sm text-foreground">
        <ShieldCheck className="w-4 h-4 flex-shrink-0 text-primary" />
        Student identities are protected. Only anonymized IDs and academic data are displayed in compliance with PDPA.
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total enrolled", value: "1,247", icon: Users, colorClass: "bg-primary/10 text-primary" },
          { label: "Active this month", value: "892", icon: BarChart3, colorClass: "bg-secondary/20 text-secondary" },
          { label: "Avg match score", value: "63%", icon: TrendingUp, colorClass: "bg-success/10 text-success" },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-2xl border border-border p-5 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${s.colorClass} flex items-center justify-center flex-shrink-0`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-foreground" style={{ fontWeight: 700, fontSize: "1.25rem" }}>{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-muted text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            placeholder="Search by student ID or target role…"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="text-sm border border-border rounded-xl px-3 py-2 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="All">All years</option>
            {["1", "2", "3", "4"].map((y) => <option key={y} value={y}>Year {y}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted border-b border-border">
              <tr>
                {["Student ID", "Year", "Top Target Role", "Match %", "Status"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs text-muted-foreground uppercase tracking-wide" style={{ fontWeight: 600 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map((student) => (
                <tr key={student.id} className="hover:bg-muted/40 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-primary" style={{ fontWeight: 700 }}>
                          #
                        </span>
                      </div>
                      <span className="text-foreground font-mono text-xs" style={{ fontWeight: 600 }}>{student.id}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">Year {student.year}</td>
                  <td className="px-5 py-4 text-muted-foreground">{student.topRole}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${student.matchPct >= 70 ? "bg-success" : student.matchPct >= 50 ? "bg-warning" : "bg-destructive"}`}
                          style={{ width: `${student.matchPct}%` }}
                        />
                      </div>
                      <span className="text-xs text-foreground" style={{ fontWeight: 600 }}>
                        {student.matchPct}%
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full border text-foreground ${student.status === "Active" ? "bg-success/10 border-success/30" : "bg-muted border-border"}`} style={{ fontWeight: 500 }}>
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-4 border-t border-border text-xs text-muted-foreground">
          Showing {filtered.length} of 1,247 enrolled students · Personal data is protected — individual identities are never revealed
        </div>
      </div>
    </div>
  );
}