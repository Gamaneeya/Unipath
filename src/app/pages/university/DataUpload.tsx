import { useState, useRef } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, Users, BookOpen, Download, RefreshCw } from "lucide-react";

type UploadTab = "students" | "catalog";
type UploadStatus = "idle" | "uploading" | "done" | "error";

const SAMPLE_CSV = `student_id,full_name,email,year
STD001,Siriyakorn Thanapat,s.thanapat@tustu.th,3
STD002,Pratchaya Wongkum,p.wongkum@tustu.th,2
STD003,Natthawut Srisuk,n.srisuk@tustu.th,4`;

const SAMPLE_CATALOG_JSON = JSON.stringify([
  { code: "CS101", name: "Introduction to Programming", semester: 1, skills: ["Python", "Algorithms"] },
  { code: "CS301", name: "Database Systems", semester: 3, skills: ["SQL", "Databases"] },
  { code: "CS401", name: "Web Development", semester: 4, skills: ["HTML", "CSS", "JavaScript"] },
], null, 2);

function UploadZone({
  label,
  accept,
  description,
  onFile,
}: {
  label: string;
  accept: string;
  description: string;
  onFile: (file: File) => void;
}) {
  const [drag, setDrag] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        const file = e.dataTransfer.files[0];
        if (file) onFile(file);
      }}
      onClick={() => ref.current?.click()}
      className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${drag ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-muted"}`}
    >
      <input ref={ref} type="file" accept={accept} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
      <Upload className="w-8 h-8 text-primary mx-auto mb-3" />
      <div className="text-sm text-foreground mb-1" style={{ fontWeight: 600 }}>{label}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

export default function DataUpload() {
  const [tab, setTab] = useState<UploadTab>("students");
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [recordCount, setRecordCount] = useState(0);

  const handleFile = (file: File) => {
    setFileName(file.name);
    setStatus("uploading");
    setProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 20;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => {
          setStatus("done");
          setRecordCount(tab === "students" ? 1247 : 48);
        }, 400);
      }
      setProgress(Math.min(Math.round(p), 100));
    }, 150);
  };

  const reset = () => {
    setStatus("idle");
    setFileName("");
    setProgress(0);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-foreground" style={{ fontSize: "1.75rem", fontWeight: 800 }}>Data Upload</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Import student enrollment data and official course catalogs to keep UniPath in sync.
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-card rounded-2xl border border-border">
        <div className="flex border-b border-border">
          {(["students", "catalog"] as UploadTab[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); reset(); }}
              className={`flex items-center gap-2 px-6 py-3.5 text-sm transition-all border-b-2 -mb-px ${tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
              style={{ fontWeight: tab === t ? 600 : 400 }}
            >
              {t === "students" ? <Users className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
              {t === "students" ? "Student Enrollment" : "Course Catalog"}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-6">
          {tab === "students" ? (
            <>
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm text-foreground">
                Upload a CSV or JSON file containing your student enrollment data. Required fields: <code className="bg-primary/20 px-1 rounded">student_id</code>, <code className="bg-primary/20 px-1 rounded">full_name</code>, <code className="bg-primary/20 px-1 rounded">email</code>, <code className="bg-primary/20 px-1 rounded">year</code>.
              </div>
              <div className="flex gap-3 mb-2">
                <button
                  onClick={() => {
                    const blob = new Blob([SAMPLE_CSV], { type: "text/csv" });
                    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
                    a.download = "sample_students.csv"; a.click();
                  }}
                  className="flex items-center gap-2 text-sm text-muted-foreground border border-border px-3 py-2 rounded-xl hover:bg-muted transition-colors"
                >
                  <Download className="w-4 h-4" /> Download CSV template
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm text-foreground">
                Upload your official course catalog as CSV or JSON. This enables automatic skill mapping for Partner University students. Required fields: <code className="bg-primary/20 px-1 rounded">code</code>, <code className="bg-primary/20 px-1 rounded">name</code>, <code className="bg-primary/20 px-1 rounded">skills</code>.
              </div>
              <div className="flex gap-3 mb-2">
                <button
                  onClick={() => {
                    const blob = new Blob([SAMPLE_CATALOG_JSON], { type: "application/json" });
                    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
                    a.download = "sample_catalog.json"; a.click();
                  }}
                  className="flex items-center gap-2 text-sm text-muted-foreground border border-border px-3 py-2 rounded-xl hover:bg-muted transition-colors"
                >
                  <Download className="w-4 h-4" /> Download JSON template
                </button>
              </div>
            </>
          )}

          {status === "idle" && (
            <UploadZone
              label={tab === "students" ? "Drop student CSV/JSON here" : "Drop course catalog CSV/JSON here"}
              accept=".csv,.json"
              description="CSV or JSON · No size limit for institutional uploads"
              onFile={handleFile}
            />
          )}

          {status === "uploading" && (
            <div className="bg-muted rounded-2xl p-8 text-center">
              <FileText className="w-10 h-10 text-primary mx-auto mb-4" />
              <div className="text-sm text-foreground mb-1" style={{ fontWeight: 600 }}>Processing {fileName}</div>
              <div className="w-full h-2 bg-border rounded-full overflow-hidden mt-4 mb-2">
                <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <div className="text-xs text-foreground" style={{ fontWeight: 600 }}>{progress}%</div>
              <div className="text-xs text-muted-foreground mt-1">
                {progress < 40 ? "Parsing file format…" : progress < 70 ? "Validating records…" : "Syncing to database…"}
              </div>
            </div>
          )}

          {status === "done" && (
            <div className="bg-success/10 border border-success/30 rounded-2xl p-8 text-center">
              <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
              <div className="text-foreground mb-2" style={{ fontWeight: 700, fontSize: "1.125rem" }}>
                Upload Successful
              </div>
              <p className="text-muted-foreground text-sm mb-2">
                <strong>{recordCount.toLocaleString()}</strong> {tab === "students" ? "student records" : "course entries"} processed and synced.
              </p>
              <p className="text-xs text-muted-foreground mb-6">File: {fileName}</p>
              <div className="flex gap-3 justify-center">
                <button onClick={reset} className="flex items-center gap-2 text-sm text-muted-foreground border border-border px-4 py-2.5 rounded-xl hover:bg-muted transition-colors">
                  <RefreshCw className="w-4 h-4" /> Upload another
                </button>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-foreground text-sm" style={{ fontWeight: 600 }}>Upload failed</div>
                <div className="text-muted-foreground text-sm mt-1">Invalid file format. Please ensure the file follows the required schema.</div>
                <button onClick={reset} className="mt-3 text-sm text-destructive underline hover:opacity-80">Try again</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* API Sync Info */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="text-foreground mb-3" style={{ fontWeight: 700 }}>Automatic API Sync</h2>
        <p className="text-sm text-muted-foreground mb-4">
          For real-time synchronization, configure your student information system to push data to our API endpoint on enrollment events.
        </p>
        <div className="bg-[#0d1117] rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto border border-border/50">
          <div className="text-[#6e7681] mb-2"># POST enrollment data</div>
          <div>POST https://api.careercompass.io/v1/university/sync</div>
          <div className="mt-1 text-[#6e7681]">Authorization: Bearer YOUR_API_KEY</div>
          <div className="mt-1 text-[#6e7681]">Content-Type: application/json</div>
          <div className="mt-2 text-yellow-400">{"{"}</div>
          <div className="ml-4 text-blue-400">"students": [...],</div>
          <div className="ml-4 text-blue-400">"courses": [...],</div>
          <div className="ml-4 text-blue-400">"semester": "2025-1"</div>
          <div className="text-yellow-400">{"}"}</div>
        </div>
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm text-foreground">
          Full API documentation available at{" "}
          <a href="#" className="underline font-mono text-primary hover:text-primary/80">docs.careercompass.io</a>
        </div>
      </div>
    </div>
  );
}