import { useState } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  Briefcase,
  BookOpen,
  Tag,
  Check,
  AlertTriangle,
} from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { Course, Experience } from "../../data/mockData";

const SUGGESTED_SKILLS = [
  "Python", "JavaScript", "TypeScript", "React", "Node.js", "SQL", "Git",
  "Docker", "Figma", "Excel", "Communication", "Data Visualization",
  "Machine Learning", "Agile", "REST APIs", "Statistics", "Tableau",
  "User Research", "Product Strategy", "Linux", "AWS",
];

type Tab = "courses" | "experiences" | "skills";

export default function Profile() {
  const {
    studentProfile,
    addCourse,
    updateCourse,
    deleteCourse,
    addExperience,
    deleteExperience,
    addSkill,
    removeSkill,
    studentSkills,
  } = useApp();

  const [activeTab, setActiveTab] = useState<Tab>("courses");
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [editingCourse, setEditingCourse] = useState<string | null>(null);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showAddExp, setShowAddExp] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    code: "",
    name: "",
    description: "",
    semester: 1,
    skills: [],
  });

  const [editCourseData, setEditCourseData] = useState<Partial<Course>>({});

  const [newExp, setNewExp] = useState<Partial<Experience>>({
    title: "",
    role: "",
    description: "",
  });

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "courses", label: `Courses (${studentProfile.courses.length})`, icon: BookOpen },
    { id: "experiences", label: `Experiences (${studentProfile.experiences.length})`, icon: Briefcase },
    { id: "skills", label: `Skills (${studentProfile.skills.length})`, icon: Tag },
  ];

  const handleAddCourse = () => {
    if (!newCourse.code || !newCourse.name) return;
    addCourse({
      id: `c-${Date.now()}`,
      code: newCourse.code!,
      name: newCourse.name!,
      description: newCourse.description || "",
      semester: newCourse.semester || 1,
      skills: newCourse.skills || [],
    });
    setNewCourse({ code: "", name: "", description: "", semester: 1, skills: [] });
    setShowAddCourse(false);
  };

  const handleSaveEdit = (id: string) => {
    updateCourse(id, editCourseData);
    setEditingCourse(null);
    setEditCourseData({});
  };

  const startEdit = (course: Course) => {
    setEditingCourse(course.id);
    setEditCourseData({ ...course });
  };

  const handleAddExp = () => {
    if (!newExp.title || !newExp.role) return;
    addExperience({
      id: `e-${Date.now()}`,
      title: newExp.title!,
      role: newExp.role!,
      description: newExp.description || "",
    });
    setNewExp({ title: "", role: "", description: "" });
    setShowAddExp(false);
  };

  const handleAddSkill = () => {
    const s = newSkillInput.trim();
    if (s) { addSkill(s); setNewSkillInput(""); }
  };

  // Semesters
  const semesters = [...new Set(studentProfile.courses.map((c) => c.semester))].sort((a, b) => a - b);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-foreground" style={{ fontSize: "1.75rem", fontWeight: 800 }}>My Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your academic profile. All changes trigger a real-time re-analysis of your role matches.
        </p>
      </div>

      {/* Skills summary bar */}
      <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-primary" style={{ fontWeight: 600 }}>
            Total detected skills: {studentSkills.length}
          </span>
          <span className="text-xs text-primary/70">Auto-updated on every change</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {studentSkills.slice(0, 20).map((skill) => (
            <span key={skill} className="text-xs bg-card border border-primary/20 text-primary px-2 py-0.5 rounded-full">
              {skill}
            </span>
          ))}
          {studentSkills.length > 20 && (
            <span className="text-xs text-primary/60">+{studentSkills.length - 20} more</span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card rounded-2xl border border-border">
        <div className="flex border-b border-border">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm transition-all border-b-2 -mb-px ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              style={{ fontWeight: activeTab === tab.id ? 600 : 400 }}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* ── Courses Tab ── */}
          {activeTab === "courses" && (
            <div className="space-y-4">
              {/* Partner student sync notice */}
              {studentProfile.accountType === "partner" && (
                <div className="bg-primary/10 border-2 border-primary/20 rounded-2xl p-4 flex items-start gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <BookOpen className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-foreground text-sm" style={{ fontWeight: 700 }}>
                      Curriculum synced from {studentProfile.university}
                    </p>
                    <p className="text-primary/80 text-xs mt-0.5 font-medium leading-relaxed">
                      All course information below was automatically imported from your university's system. You can still add or remove courses manually to keep your profile accurate.
                    </p>
                  </div>
                </div>
              )}
              {semesters.map((sem) => (
                <div key={sem}>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-1" style={{ fontWeight: 600 }}>
                    Semester {sem}
                  </div>
                  <div className="space-y-2">
                    {studentProfile.courses
                      .filter((c) => c.semester === sem)
                      .map((course) => (
                        <div key={course.id} className="border border-border rounded-xl overflow-hidden">
                          {editingCourse === course.id ? (
                            <div className="p-4 space-y-3 bg-primary/5">
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="text-xs text-muted-foreground mb-1 block" style={{ fontWeight: 500 }}>Course Code</label>
                                  <input
                                    value={editCourseData.code || ""}
                                    onChange={(e) => setEditCourseData({ ...editCourseData, code: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs text-muted-foreground mb-1 block" style={{ fontWeight: 500 }}>Semester</label>
                                  <input
                                    type="number"
                                    min={1}
                                    max={12}
                                    value={editCourseData.semester || 1}
                                    onChange={(e) => setEditCourseData({ ...editCourseData, semester: +e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="text-xs text-muted-foreground mb-1 block" style={{ fontWeight: 500 }}>Course Name</label>
                                <input
                                  value={editCourseData.name || ""}
                                  onChange={(e) => setEditCourseData({ ...editCourseData, name: e.target.value })}
                                  className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-muted-foreground mb-1 block" style={{ fontWeight: 500 }}>Description</label>
                                <textarea
                                  value={editCourseData.description || ""}
                                  onChange={(e) => setEditCourseData({ ...editCourseData, description: e.target.value })}
                                  rows={3}
                                  className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground resize-none"
                                />
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleSaveEdit(course.id)}
                                  className="flex items-center gap-1.5 text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                  <Save className="w-3.5 h-3.5" /> Save
                                </button>
                                <button
                                  onClick={() => setEditingCourse(null)}
                                  className="flex items-center gap-1.5 text-sm text-muted-foreground px-3 py-1.5 rounded-lg hover:bg-muted transition-colors"
                                >
                                  <X className="w-3.5 h-3.5" /> Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <button
                                onClick={() =>
                                  setExpandedCourse(expandedCourse === course.id ? null : course.id)
                                }
                                className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted transition-colors text-left"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-md flex-shrink-0" style={{ fontWeight: 600 }}>
                                    {course.code}
                                  </span>
                                  <span className="text-sm text-foreground truncate" style={{ fontWeight: 500 }}>
                                    {course.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                  <span className="text-xs text-muted-foreground">{course.skills.length} skills</span>
                                  {expandedCourse === course.id ? (
                                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                  )}
                                </div>
                              </button>
                              {expandedCourse === course.id && (
                                <div className="px-4 pb-4 border-t border-border">
                                  <p className="text-sm text-muted-foreground mt-3 mb-3 leading-relaxed">
                                    {course.description || <span className="italic text-muted-foreground/60">No description</span>}
                                  </p>
                                  <div className="flex flex-wrap gap-1.5 mb-3">
                                    {course.skills.map((s) => (
                                      <span key={s} className="text-xs bg-secondary/10 text-secondary border border-secondary/20 px-2 py-0.5 rounded-full">
                                        {s}
                                      </span>
                                    ))}
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => startEdit(course)}
                                      className="flex items-center gap-1.5 text-xs text-muted-foreground px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
                                    >
                                      <Edit3 className="w-3 h-3" /> Edit
                                    </button>
                                    <button
                                      onClick={() => {
                                        setPendingAction(() => () => deleteCourse(course.id));
                                        setShowWarning(true);
                                      }}
                                      className="flex items-center gap-1.5 text-xs text-foreground px-3 py-1.5 rounded-lg border border-destructive/30 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
                                    >
                                      <Trash2 className="w-3 h-3" /> Delete
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ))}

              {/* Add Course */}
              {showAddCourse ? (
                <div className="border border-primary/30 rounded-xl p-4 bg-primary/5 space-y-3">
                  <div className="text-sm text-foreground" style={{ fontWeight: 600 }}>Add New Course</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block" style={{ fontWeight: 500 }}>Course Code *</label>
                      <input
                        value={newCourse.code}
                        onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground"
                        placeholder="CS401"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block" style={{ fontWeight: 500 }}>Semester</label>
                      <input
                        type="number"
                        min={1}
                        max={12}
                        value={newCourse.semester}
                        onChange={(e) => setNewCourse({ ...newCourse, semester: +e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block" style={{ fontWeight: 500 }}>Course Name *</label>
                    <input
                      value={newCourse.name}
                      onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground"
                      placeholder="e.g. Machine Learning"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block" style={{ fontWeight: 500 }}>Description</label>
                    <textarea
                      value={newCourse.description}
                      onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground resize-none"
                      placeholder="Manually paste course description if not parsed…"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleAddCourse} className="flex items-center gap-1.5 text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                      <Plus className="w-3.5 h-3.5" /> Add Course
                    </button>
                    <button onClick={() => setShowAddCourse(false)} className="text-sm text-muted-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddCourse(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-border rounded-xl text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add course manually
                </button>
              )}
            </div>
          )}

          {/* ── Experiences Tab ── */}
          {activeTab === "experiences" && (
            <div className="space-y-4">
              {studentProfile.experiences.map((exp) => (
                <div key={exp.id} className="border border-border rounded-xl p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-foreground" style={{ fontWeight: 600 }}>{exp.title}</div>
                      <div className="text-xs text-primary mt-0.5" style={{ fontWeight: 500 }}>{exp.role}</div>
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{exp.description}</p>
                    </div>
                    <button
                      onClick={() => {
                        setPendingAction(() => () => deleteExperience(exp.id));
                        setShowWarning(true);
                      }}
                      className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {showAddExp ? (
                <div className="border border-primary/30 rounded-xl p-4 bg-primary/5 space-y-3">
                  <div className="text-sm text-foreground" style={{ fontWeight: 600 }}>Add Experience / Project</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block" style={{ fontWeight: 500 }}>Title *</label>
                      <input
                        value={newExp.title}
                        onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground"
                        placeholder="e.g. Data Science Internship"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block" style={{ fontWeight: 500 }}>Role *</label>
                      <input
                        value={newExp.role}
                        onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground"
                        placeholder="e.g. Data Analyst Intern"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block" style={{ fontWeight: 500 }}>Description</label>
                    <textarea
                      value={newExp.description}
                      onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground resize-none"
                      placeholder="Describe what you did and what skills you used…"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleAddExp} className="flex items-center gap-1.5 text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                    <button onClick={() => setShowAddExp(false)} className="text-sm text-muted-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddExp(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-border rounded-xl text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add experience or project
                </button>
              )}
            </div>
          )}

          {/* ── Skills Tab ── */}
          {activeTab === "skills" && (
            <div className="space-y-6">
              <div>
                <div className="text-sm text-foreground mb-3" style={{ fontWeight: 600 }}>
                  Manually Added Skills
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {studentProfile.skills.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No manually added skills yet.</p>
                  ) : (
                    studentProfile.skills.map((skill) => (
                      <span key={skill} className="inline-flex items-center gap-1.5 text-sm bg-primary/10 text-foreground border border-primary/20 px-3 py-1 rounded-full">
                        {skill}
                        <button onClick={() => removeSkill(skill)} className="text-muted-foreground hover:text-destructive transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                    className="flex-1 px-3 py-2 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground"
                    placeholder="e.g. Public Speaking, Figma, Docker…"
                  />
                  <button
                    onClick={handleAddSkill}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors text-sm"
                    style={{ fontWeight: 600 }}
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <div className="text-sm text-foreground mb-3" style={{ fontWeight: 600 }}>Quick Add Suggestions</div>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_SKILLS.filter((s) => !studentProfile.skills.includes(s)).map((skill) => (
                    <button
                      key={skill}
                      onClick={() => addSkill(skill)}
                      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground border border-border px-3 py-1 rounded-full hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                    >
                      <Plus className="w-3 h-3" />
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm text-foreground mb-3" style={{ fontWeight: 600 }}>
                  All Detected Skills (from courses + experiences + manual)
                </div>
                <div className="flex flex-wrap gap-2">
                  {studentSkills.map((skill) => {
                    const isManual = studentProfile.skills.includes(skill);
                    const isFromCourse = studentProfile.courses.some((c) =>
                      c.skills.some((s) => s.toLowerCase() === skill.toLowerCase())
                    );
                    return (
                      <span
                        key={skill}
                        className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${
                          isManual
                            ? "bg-primary/10 border-primary/20 text-primary"
                            : isFromCourse
                            ? "bg-secondary/15 border-secondary/30 text-secondary"
                            : "bg-accent/20 border-accent/40 text-accent-foreground"
                        }`}
                      >
                        <Check className="w-3 h-3" />
                        {skill}
                      </span>
                    );
                  })}
                </div>
                <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-secondary inline-block" />From courses</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary inline-block" />Manually added</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent inline-block" />From experiences</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 max-w-md w-full border-2 border-border">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent/25 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <h2 className="text-foreground font-bold text-base mb-1">Re-analysis Warning</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Updating your profile information will trigger a full re-analysis of all saved roles and previously generated project suggestions.
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  if (pendingAction) pendingAction();
                  setShowWarning(false);
                  setPendingAction(null);
                }}
                className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-bold text-sm"
              >
                Continue
              </button>
              <button
                onClick={() => {
                  setShowWarning(false);
                  setPendingAction(null);
                }}
                className="px-4 py-2.5 border-2 border-border text-muted-foreground rounded-xl hover:bg-muted transition-colors font-bold text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}