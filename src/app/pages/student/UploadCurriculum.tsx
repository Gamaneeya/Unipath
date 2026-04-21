import { useState, useRef } from "react";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  X,
  Edit3,
  Trash2,
  Plus,
  ArrowRight,
  Shield,
} from "lucide-react";
import { useApp } from "../../contexts/AppContext.tsx";
import { useNavigate } from "react-router";
import { Course } from "../../data/mockData.ts";

type UploadStep = "consent" | "upload" | "processing" | "verify" | "done";

// Simulated parsed courses from a PDF
const SIMULATED_PARSED_COURSES: Course[] = [
  {
    id: `parsed-${Date.now()}-1`,
    code: "CS601",
    name: "Machine Learning Fundamentals",
    description:
      "Introduction to supervised and unsupervised learning, neural networks, model evaluation.",
    semester: 6,
    skills: ["Machine Learning", "Python", "Statistics", "Mathematics"],
  },
  {
    id: `parsed-${Date.now()}-2`,
    code: "CS602",
    name: "Cloud Computing",
    description:
      "AWS and GCP cloud architectures, serverless computing, containers, and deployment pipelines.",
    semester: 6,
    skills: ["AWS", "Docker", "Linux", "CI/CD"],
  },
  {
    id: `parsed-${Date.now()}-3`,
    code: "CS603",
    name: "Human-Computer Interaction",
    description: "User research methods, usability testing, and prototype evaluation.",
    semester: 6,
    skills: ["User Research", "Usability Testing", "Prototyping"],
  },
];

export default function UploadCurriculum() {
  const navigate = useNavigate();
  const { addCourse, consentGiven, giveConsent, studentProfile } = useApp();
  const [step, setStep] = useState<UploadStep>(consentGiven ? "upload" : "consent");
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [progress, setProgress] = useState(0);
  const [parsedCourses, setParsedCourses] = useState<Course[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Course>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  // For partner students, show info page instead
  if (studentProfile.accountType === "partner") {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-6 font-sans">
        <div>
          <h1 className="text-foreground" style={{ fontSize: "2rem", fontWeight: 900 }}>
            Curriculum Sync
          </h1>
          <p className="text-muted-foreground mt-2 font-bold">
            Your curriculum is automatically synchronized from {studentProfile.university}.
          </p>
        </div>

        <div className="bg-card rounded-3xl border-4 border-border p-8 shadow-sm text-center">
          <div className="w-20 h-20 rounded-3xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-foreground mb-3 text-2xl" style={{ fontWeight: 900 }}>
            Partner Student Account
          </h2>
          <p className="text-muted-foreground font-bold mb-8 text-base leading-relaxed">
            As a partner student at {studentProfile.university}, your academic information is automatically imported and kept up-to-date. There's no need to manually upload your curriculum.
          </p>
          <div className="bg-primary/10 border-2 border-primary/30 rounded-xl p-5 text-left mb-4">
            <h3 className="text-primary font-bold text-sm mb-3">What's synchronized:</h3>
            <ul className="space-y-2 text-sm text-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                Course enrollments and completions
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                Skills detected from your curriculum
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                Real-time updates from university systems
              </li>
            </ul>
          </div>
          <div className="bg-warning/10 border-2 border-warning/30 rounded-xl p-4 text-left mb-8 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <p className="text-foreground text-sm font-medium leading-relaxed">
              <span className="font-black">Want to make changes?</span> You can still add or remove individual courses in your Profile to keep your skill profile accurate.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/student/profile")}
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-2xl border-b-4 border-secondary hover:bg-primary/90 active:border-b-0 active:translate-y-1 transition-all font-black text-base shadow-lg"
            >
              <Edit3 className="w-5 h-5" />
              Manage Courses in Profile
            </button>
            <button
              onClick={() => navigate("/student")}
              className="flex items-center justify-center gap-2 px-8 py-4 text-muted-foreground border-2 border-border rounded-2xl hover:bg-muted hover:border-border transition-all font-bold text-base"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleFileDrop = (file: File) => {
    if (!file.name.endsWith(".pdf")) {
      alert("Please upload a PDF file only.");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      alert("File size exceeds 50MB limit.");
      return;
    }
    setFileName(file.name);
    setFileSize((file.size / (1024 * 1024)).toFixed(2) + " MB");
    simulateProcessing();
  };

  const simulateProcessing = () => {
    setStep("processing");
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => {
          setParsedCourses(
            SIMULATED_PARSED_COURSES.map((c) => ({
              ...c,
              id: `parsed-${Date.now()}-${Math.random()}`,
            }))
          );
          setStep("verify");
        }, 500);
      }
      setProgress(Math.min(Math.round(p), 100));
    }, 200);
  };

  const handleDeleteParsed = (id: string) => {
    setParsedCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSaveParsed = () => {
    parsedCourses.forEach((c) => addCourse(c));
    setStep("done");
  };

  const handleEditSave = (id: string) => {
    setParsedCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...editData } : c))
    );
    setEditingId(null);
  };

  if (step === "consent") {
    return (
      <div className="p-6 max-w-2xl mx-auto font-sans">
        <div className="bg-card rounded-3xl border-4 border-border overflow-hidden shadow-sm">
          <div className="bg-warning/10 border-b-4 border-warning/20 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-warning/15 flex items-center justify-center border-2 border-warning/30">
                <Shield className="w-6 h-6 text-warning" />
              </div>
              <h2 className="text-foreground" style={{ fontWeight: 900, fontSize: "1.25rem" }}>
                Data Consent
              </h2>
            </div>
            <p className="text-foreground text-sm leading-relaxed font-bold">
              Before uploading your curriculum, please read and
              acknowledge how your data will be handled.
            </p>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-foreground mb-3" style={{ fontWeight: 900 }}>
                What we collect
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground font-bold">
                {[
                  "Course names, codes, and descriptions extracted from your PDF",
                  "Skills inferred from your academic courses",
                  "Role match percentages computed from your profile",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-success/15 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-3.5 h-3.5 text-success" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-foreground mb-3" style={{ fontWeight: 900 }}>
                How we protect your data
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground font-bold">
                {[
                  "All data encrypted using AES-256",
                  "Data transmitted over TLS 1.3 secure connections",
                  "We never sell your personal or academic data to third parties",
                  "PDPA compliant — you can delete your data at any time",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-3.5 h-3.5 text-primary" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-muted border-2 border-border rounded-xl p-4 text-sm text-muted-foreground font-medium">
              <strong className="text-foreground">PDPA Notice:</strong> Under the
              Personal Data Protection Act, you have the right to access, correct,
              or delete your academic stats at any time. Your data will not be
              shared with third parties without your explicit consent.
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => { giveConsent(); setStep("upload"); }}
                className="flex-1 bg-primary text-primary-foreground py-3.5 rounded-2xl border-b-4 border-secondary hover:bg-primary/90 active:border-b-0 active:translate-y-1 transition-all text-base"
                style={{ fontWeight: 900 }}
              >
                I agree — upload curriculum
              </button>
              <button
                onClick={() => navigate("/student")}
                className="px-6 py-3.5 text-muted-foreground border-2 border-border rounded-2xl hover:bg-muted transition-all font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === "upload") {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-6 font-sans">
        <div>
          <h1 className="text-foreground" style={{ fontSize: "2rem", fontWeight: 900 }}>
            Upload Curriculum
          </h1>
          <p className="text-muted-foreground mt-2 font-bold">
            Upload your course transcript or curriculum PDF (max 50MB). We'll extract all skills automatically.
          </p>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFileDrop(file);
          }}
          onClick={() => fileRef.current?.click()}
          className={`border-4 border-dashed rounded-3xl p-16 text-center cursor-pointer transition-all ${
            dragOver
              ? "border-primary bg-primary/5 scale-[1.02]"
              : "border-border hover:border-primary/50 hover:bg-muted hover:shadow-lg hover:-translate-y-1"
          }`}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileDrop(file);
            }}
          />
          <div className="w-20 h-20 rounded-3xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Upload className="w-10 h-10 text-primary" />
          </div>
          <div className="text-foreground mb-2 text-xl" style={{ fontWeight: 900 }}>
            Drop your PDF here
          </div>
          <p className="text-muted-foreground font-bold mb-6">or click to browse local files</p>
          <div className="inline-flex items-center gap-2 text-xs font-black text-muted-foreground bg-muted border border-border px-4 py-2 rounded-xl">
            <FileText className="w-4 h-4" />
            PDF only · Max 50MB · Text-searchable
          </div>
        </div>

        <div className="bg-warning/10 border-2 border-warning/30 rounded-xl p-4 flex gap-4">
          <div className="p-2 bg-warning/15 rounded-lg flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-warning" />
          </div>
          <div className="text-sm text-foreground font-medium pt-1">
            <strong className="font-black">Note:</strong> Scanned image PDFs cannot be parsed. Please ensure your PDF is text-searchable. If parsing fails, you can manually add courses.
          </div>
        </div>
      </div>
    );
  }

  if (step === "processing") {
    return (
      <div className="p-6 max-w-2xl mx-auto font-sans">
        <div className="bg-card rounded-3xl border-4 border-border p-12 text-center shadow-sm">
          <div className="w-20 h-20 rounded-3xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto mb-6 animate-pulse">
            <FileText className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-foreground mb-2 text-2xl" style={{ fontWeight: 900 }}>
            Processing your file…
          </h2>
          <p className="text-muted-foreground font-bold mb-1">{fileName}</p>
          <p className="text-muted-foreground text-xs font-black mb-8 uppercase tracking-widest">{fileSize}</p>

          <div className="relative w-full h-4 bg-muted rounded-full overflow-hidden mb-4 shadow-inner border border-border">
            <div
              className="h-full bg-success rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
            {progress < 30
              ? "Extracting text from file…"
              : progress < 60
              ? "Identifying courses completed…"
              : progress < 85
              ? "Calculating skill coverage…"
              : "Mapping skills to your profile…"}
          </div>
          <div className="text-lg text-foreground mt-2" style={{ fontWeight: 900 }}>{progress}%</div>
        </div>
      </div>
    );
  }

  if (step === "verify") {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-8 font-sans">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-foreground" style={{ fontSize: "2rem", fontWeight: 900 }}>
              Verify Parsed Data
            </h1>
            <p className="text-muted-foreground mt-2 font-bold">
              We found {parsedCourses.length} courses. Please review before saving.
            </p>
          </div>
          <div className="bg-success/10 border-2 border-success/30 rounded-xl px-4 py-2.5 text-sm font-black text-foreground flex items-center gap-2 shadow-sm">
            <CheckCircle className="w-5 h-5 text-success" />
            Scan Complete
          </div>
        </div>

        <div className="space-y-4">
          {parsedCourses.map((course) => (
            <div key={course.id} className="bg-card border-2 border-border rounded-2xl overflow-hidden shadow-sm hover:border-primary/40 transition-colors">
              {editingId === course.id ? (
                <div className="p-6 bg-muted space-y-4 border-b-4 border-border">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block uppercase tracking-widest font-black">Course Code</label>
                      <input
                        value={editData.code ?? course.code}
                        onChange={(e) => setEditData({ ...editData, code: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border-2 border-border text-sm focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary bg-card font-bold text-foreground"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block uppercase tracking-widest font-black">Semester</label>
                      <input
                        type="number"
                        value={editData.semester ?? course.semester}
                        onChange={(e) => setEditData({ ...editData, semester: +e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border-2 border-border text-sm focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary bg-card font-bold text-foreground"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block uppercase tracking-widest font-black">Course Name</label>
                    <input
                      value={editData.name ?? course.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-border text-sm focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary bg-card font-bold text-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block uppercase tracking-widest font-black">Description</label>
                    <textarea
                      value={editData.description ?? course.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-border text-sm focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary bg-card resize-none font-bold text-foreground"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => handleEditSave(course.id)} className="text-sm bg-primary text-primary-foreground px-6 py-2.5 rounded-xl border-b-4 border-secondary hover:bg-primary/90 active:border-b-0 active:translate-y-1 transition-all font-black">Save Changes</button>
                    <button onClick={() => setEditingId(null)} className="text-sm text-muted-foreground px-6 py-2.5 rounded-xl border-2 border-border hover:bg-muted transition-all font-bold">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="p-5 flex items-start gap-5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-black bg-primary/10 text-primary px-2.5 py-1 rounded-lg border border-primary/30">
                        {course.code}
                      </span>
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Sem {course.semester}</span>
                    </div>
                    <div className="text-base text-foreground" style={{ fontWeight: 900 }}>{course.name}</div>
                    <p className="text-sm text-muted-foreground mt-1 font-medium">{course.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {course.skills.map((s) => (
                        <span key={s} className="text-xs font-black bg-success/10 text-foreground border-2 border-success/30 px-3 py-1 rounded-xl shadow-sm">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => { setEditingId(course.id); setEditData({ ...course }); }} className="p-2.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-colors border-2 border-transparent hover:border-primary/20" title="Edit Course">
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDeleteParsed(course.id)} className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors border-2 border-transparent hover:border-destructive/20" title="Delete Course">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          <button
            onClick={() => setParsedCourses([...parsedCourses, { id: `m-${Date.now()}`, code: "", name: "", description: "", semester: 1, skills: [] }])}
            className="w-full flex items-center justify-center gap-2 py-4 border-4 border-dashed border-border rounded-2xl text-sm font-black text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-muted transition-all hover:-translate-y-1"
          >
            <Plus className="w-5 h-5" /> Add course manually
          </button>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            onClick={handleSaveParsed}
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-2xl border-b-4 border-secondary hover:bg-primary/90 active:border-b-0 active:translate-y-1 transition-all text-lg shadow-lg"
            style={{ fontWeight: 900 }}
          >
            Save to Profile
            <ArrowRight className="w-5 h-5" />
          </button>
          <button onClick={() => setStep("upload")} className="px-8 py-4 text-muted-foreground border-2 border-border rounded-2xl hover:bg-muted transition-all font-bold">
            Upload Another
          </button>
        </div>
      </div>
    );
  }

  // Done
  return (
    <div className="p-6 max-w-2xl mx-auto font-sans">
      <div className="bg-card rounded-3xl border-4 border-border p-12 text-center shadow-lg relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-success/10 rounded-full blur-3xl" />
        <div className="w-24 h-24 rounded-3xl bg-success/10 border-4 border-success/30 flex items-center justify-center mx-auto mb-8 shadow-sm transform hover:scale-110 transition-transform">
          <CheckCircle className="w-12 h-12 text-success" />
        </div>
        <h2 className="text-foreground mb-3" style={{ fontWeight: 900, fontSize: "2rem" }}>
          Curriculum Saved!
        </h2>
        <p className="text-muted-foreground font-bold mb-8 text-lg">
          Your role matches have been recalculated with your updated profile.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate("/student")}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-2xl border-b-4 border-secondary hover:bg-primary/90 active:border-b-0 active:translate-y-1 transition-all font-black text-base shadow-lg"
          >
            View Dashboard
          </button>
          <button
            onClick={() => { setStep("upload"); setProgress(0); setFileName(""); setFileSize(""); setParsedCourses([]); }}
            className="px-8 py-4 text-muted-foreground border-2 border-border rounded-2xl hover:bg-muted transition-all font-bold text-base"
          >
            Upload More
          </button>
        </div>
      </div>
    </div>
  );
}