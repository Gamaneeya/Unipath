import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  ArrowLeft,
  Building2,
  CheckCircle,
  GraduationCap,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  University,
  Zap,
  Link,
  ArrowRight,
  Moon,
  Sun,
} from "lucide-react";
import { useApp } from "../contexts/AppContext.tsx";
import { useTheme } from "../contexts/ThemeContext.tsx";
import {
  Combobox,
  type ComboboxOption,
} from "../components/ui/combobox";

// University options for combobox
const UNIVERSITY_OPTIONS: ComboboxOption[] = [
  { value: "chulalongkorn", label: "Chulalongkorn University" },
  { value: "mahidol", label: "Mahidol University" },
  { value: "thammasat", label: "Thammasat University" },
  {
    value: "kmitl",
    label:
      "King Mongkut's Institute of Technology Ladkrabang (KMITL)",
  },
  { value: "ait", label: "Asian Institute of Technology" },
  { value: "kasetsart", label: "Kasetsart University" },
  {
    value: "kmutt",
    label: "King Mongkut's University of Technology Thonburi",
  },
  { value: "cu", label: "Chiang Mai University" },
  { value: "psu", label: "Prince of Songkla University" },
  { value: "kku", label: "Khon Kaen University" },
  { value: "bu", label: "Bangkok University" },
  { value: "assumption", label: "Assumption University" },
  {
    value: "abac",
    label: "Assumption University of Thailand (ABAC)",
  },
  {
    value: "nida",
    label:
      "National Institute of Development Administration (NIDA)",
  },
  { value: "silpakorn", label: "Silpakorn University" },
];

// ─── Google Button Component ──────────────────────────────────────────────────
function GoogleButton({
  onClick,
  text = "Continue with Google",
}: {
  onClick?: () => void;
  text?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-center gap-3 bg-card text-foreground py-3.5 rounded-xl border-2 border-border hover:bg-muted hover:border-border transition-all text-base font-bold shadow-sm"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
      {text}
    </button>
  );
}

// ─── Google Auth Modal ──────────────────────────────────────────────────────────
type GoogleSignInModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (email: string, name: string) => void;
  title: string;
};

function GoogleSignInModal({
  isOpen,
  onClose,
  title,
  onSelectAccount,
}: GoogleSignInModalProps) {
  const [mode, setMode] = useState<"select" | "input">(
    "select",
  );
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card dark:bg-card w-full max-w-sm rounded-3xl p-6 shadow-2xl relative border-4 border-border">
        <div className="text-center mb-6">
          <svg
            className="w-10 h-10 mx-auto mb-4"
            viewBox="0 0 24 24"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <h3 className="text-xl font-black text-foreground">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground font-bold mt-1">
            Choose an account to continue
          </p>
        </div>

        {mode === "select" ? (
          <div className="space-y-3">
            {/* Non-partner student — warm tone */}
            <button
              onClick={() =>
                onSelectAccount(
                  "alex.chen@gmail.com",
                  "Alex Chen",
                )
              }
              className="w-full flex items-center gap-4 p-3 rounded-2xl border-2 border-accent/50 hover:border-accent hover:bg-secondary/20 dark:hover:bg-secondary/10 transition-all text-left"
            >
              <div className="w-10 h-10 rounded-full bg-secondary/50 dark:bg-secondary/30 text-secondary-foreground flex items-center justify-center font-black text-lg flex-shrink-0">
                A
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-black text-foreground">
                  Alex Chen
                </div>
                <div className="text-xs font-bold text-muted-foreground">
                  alex.chen@gmail.com
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] font-black bg-secondary/50 dark:bg-secondary/30 text-secondary-foreground px-2 py-0.5 rounded-md border border-accent">
                    Non-Partner
                  </span>
                  <span className="text-[10px] text-muted-foreground font-bold">
                    Computer Science · Year 3 · Bangkok Uni
                  </span>
                </div>
              </div>
            </button>
            {/* Partner student — accent tone */}
            <button
              onClick={() =>
                onSelectAccount(
                  "priya.sharma@thammasat.ac.th",
                  "Priya Sharma",
                )
              }
              className="w-full flex items-center gap-4 p-3 rounded-2xl border-2 border-accent/50 hover:border-accent hover:bg-accent/20 dark:hover:bg-accent/10 transition-all text-left"
            >
              <div className="w-10 h-10 rounded-full bg-accent/50 dark:bg-accent/30 text-accent-foreground flex items-center justify-center font-black text-lg flex-shrink-0">
                P
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-black text-foreground">
                  Priya Sharma
                </div>
                <div className="text-xs font-bold text-muted-foreground">
                  priya.sharma@thammasat.ac.th
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] font-black bg-accent/50 dark:bg-accent/30 text-accent-foreground px-2 py-0.5 rounded-md border border-accent">
                    Partner · Thammasat
                  </span>
                  <span className="text-[10px] text-muted-foreground font-bold">
                    Comp. Eng · Year 4
                  </span>
                </div>
              </div>
            </button>
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-border"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-card text-xs font-bold text-muted-foreground">
                  OR
                </span>
              </div>
            </div>
            <button
              onClick={() => setMode("input")}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl border-2 border-border text-muted-foreground hover:bg-muted transition-all font-bold text-sm"
            >
              <User className="w-4 h-4" /> Use another account
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email && name) onSelectAccount(email, name);
            }}
            className="space-y-4"
          >
            <div>
              <label className="text-xs font-bold text-muted-foreground block mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-muted border-2 border-border rounded-xl px-4 py-2.5 text-sm font-bold focus:border-accent focus:bg-card dark:focus:bg-card outline-none text-foreground"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground block mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-muted border-2 border-border rounded-xl px-4 py-2.5 text-sm font-bold focus:border-accent focus:bg-card dark:focus:bg-card outline-none text-foreground"
                placeholder="jane@gmail.com"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setMode("select")}
                className="flex-1 py-2.5 rounded-xl border-2 border-border text-muted-foreground font-bold text-sm hover:bg-muted"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-black text-sm border-b-4 border-secondary hover:bg-primary/90 active:border-b-0 active:translate-y-1"
              >
                Continue
              </button>
            </div>
          </form>
        )}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loginAs, setLoginAs] = useState<
    "student" | "university"
  >("student");
  const [loading, setLoading] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] =
    useState(false);

  const MOCK_UNIVERSITY = {
    email: "admin@thammasat.ac.th",
    password: "password",
  };

  const handleToggleRole = (type: "student" | "university") => {
    setLoginAs(type);
    if (type === "university") {
      setEmail(MOCK_UNIVERSITY.email);
      setPassword(MOCK_UNIVERSITY.password);
    } else {
      setEmail("");
      setPassword("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      // Determine student type based on email domain for student accounts
      if (loginAs === "student") {
        // Partner students have university domain emails (e.g., @thammasat.ac.th)
        // Personal students have generic student emails (e.g., @student.edu)
        const isPartnerStudent =
          email.includes("@thammasat.ac.th") ||
          email.includes("@chulalongkorn") ||
          email.includes("@mahidol") ||
          email.includes("@kmitl") ||
          email.includes("@kasetsart") ||
          email.includes("@kmutt") ||
          email.includes(".ac.th"); // Generic Thai university domain

        login(
          email,
          password,
          "student",
          isPartnerStudent ? "partner" : "personal",
        );
      } else {
        login(email, password, "university");
      }
      navigate(
        loginAs === "university" ? "/university" : "/student",
      );
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background font-sans flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary border-b-4 border-secondary flex items-center justify-center transform hover:scale-105 transition-transform">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <span
              className="text-foreground tracking-tight"
              style={{ fontWeight: 900, fontSize: "1.5rem" }}
            >
              UniPath
            </span>
          </div>
          <h1
            className="text-foreground"
            style={{ fontWeight: 900, fontSize: "1.75rem" }}
          >
            Welcome back
          </h1>
          <p className="text-muted-foreground text-sm mt-2 font-bold">
            Log in to continue your career journey.
          </p>
        </div>

        <div className="bg-card dark:bg-card rounded-3xl shadow-xl border-4 border-border p-8">
          {/* Account Type Toggle */}
          <div className="flex rounded-2xl bg-muted p-1.5 mb-6 border-2 border-border">
            {(["student", "university"] as const).map(
              (type) => (
                <button
                  key={type}
                  onClick={() => handleToggleRole(type)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm transition-all font-bold ${
                    loginAs === type
                      ? "bg-card dark:bg-card shadow-sm text-primary border-2 border-accent"
                      : "text-muted-foreground hover:text-foreground border-2 border-transparent"
                  }`}
                >
                  {type === "student" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Building2 className="w-4 h-4" />
                  )}
                  {type === "student"
                    ? "Student"
                    : "University"}
                </button>
              ),
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-foreground dark:text-foreground block mb-2 font-bold">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-border bg-muted text-foreground focus:outline-none focus:ring-4 focus:ring-accent/20 focus:border-accent transition-all text-sm font-medium"
                  placeholder="you@university.edu"
                  required
                />
              </div>
              {loginAs === "student" && (
                <p className="text-xs text-muted-foreground mt-2 font-medium">
                  <span className="font-bold">Ex:</span>{" "}
                  alex.chen@gmail.com (non-partner) or
                  priya.sharma@thammasat.ac.th (partner student)
                </p>
              )}
            </div>
            <div>
              <label className="text-sm text-foreground dark:text-foreground block mb-2 font-bold">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 rounded-xl border-2 border-border bg-muted text-foreground focus:outline-none focus:ring-4 focus:ring-accent/20 focus:border-accent transition-all text-sm font-medium"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground bg-muted dark:bg-muted p-1.5 rounded-lg"
                >
                  {showPw ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {loginAs === "student" && (
                <p className="text-xs text-muted-foreground mt-2 font-medium">
                  <span className="font-bold">Ex:</span>{" "}
                  password (for demo accounts)
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-3.5 rounded-xl border-b-4 active:border-b-0 active:translate-y-1 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-4 text-base font-black shadow-sm ${
                loginAs === "university"
                  ? "bg-secondary border-primary hover:bg-secondary/90"
                  : "bg-primary border-secondary hover:bg-primary/90"
              }`}
            >
              {loading
                ? "Logging in…"
                : loginAs === "university"
                  ? "Access Portal"
                  : "Log In"}
            </button>
          </form>

          {/* Google sign-in — students only */}
          {loginAs === "student" && (
            <>
              <div className="flex items-center my-6">
                <div className="flex-1 border-t-2 border-border"></div>
                <span className="px-4 text-sm text-muted-foreground font-bold">
                  or
                </span>
                <div className="flex-1 border-t-2 border-border"></div>
              </div>
              <GoogleButton
                onClick={() => setIsGoogleModalOpen(true)}
              />
              <GoogleSignInModal
                isOpen={isGoogleModalOpen}
                onClose={() => setIsGoogleModalOpen(false)}
                title="Log in with Google"
                onSelectAccount={(
                  selectedEmail,
                  selectedName,
                ) => {
                  setIsGoogleModalOpen(false);
                  setLoading(true);
                  setTimeout(() => {
                    const isPartnerStudent =
                      selectedEmail.includes(".ac.th") ||
                      selectedEmail.includes(".edu");
                    login(
                      selectedEmail,
                      "google-auth",
                      "student",
                      isPartnerStudent ? "partner" : "personal",
                      selectedName,
                    );
                    navigate("/student");
                  }, 800);
                }}
              />
            </>
          )}

          {/* University — institutional credential note */}
          {loginAs === "university" && (
            <div className="mt-5 flex items-start gap-3 bg-muted dark:bg-muted border-2 border-border rounded-2xl p-4">
              <Building2 className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-foreground font-black mb-0.5">
                  Institutional Access Only
                </p>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                  University portal sign-in is restricted to
                  verified institutional credentials. Social
                  login is not supported. Contact your UniPath
                  account manager if you need assistance.
                </p>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6 font-bold">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-primary hover:text-secondary hover:underline"
          >
            Sign Up
          </button>
        </p>

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mx-auto mt-4 transition-colors font-bold bg-card px-4 py-2 rounded-xl shadow-sm border border-border"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
      </div>
    </div>
  );
}

// ─── Register ─────────────────────────────────────────────────────────────────

export function RegisterPage() {
  const navigate = useNavigate();
  const { login, signup } = useApp();
  const [searchParams] = useSearchParams();
  const defaultType =
    searchParams.get("type") === "university"
      ? "university"
      : null;

  const [step, setStep] = useState<
    "type" | "personal" | "partner" | "uni"
  >(defaultType === "university" ? "uni" : "type");
  const [accountSubType, setAccountSubType] = useState<
    "personal" | "partner"
  >("personal");
  const [loading, setLoading] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    university: "",
    uniName: "",
    uniEmail: "",
    uniWebsite: "",
  });

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const uniLabel =
      UNIVERSITY_OPTIONS.find(
        (u) => u.value === form.university,
      )?.label ?? form.university;
    setTimeout(() => {
      signup(
        form.email,
        form.password,
        "student",
        accountSubType,
        form.name,
        uniLabel,
      );
      navigate("/student");
    }, 900);
  };

  const handleUniSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(
        form.uniEmail,
        form.password,
        "university",
        undefined,
        form.uniName,
      );
      navigate("/university");
    }, 900);
  };

  if (step === "type") {
    return (
      <div className="min-h-screen bg-background font-sans flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
        <div className="w-full max-w-lg relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary border-b-4 border-secondary flex items-center justify-center transform hover:scale-105 transition-transform">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <span
                className="text-foreground tracking-tight"
                style={{ fontWeight: 900, fontSize: "1.5rem" }}
              >
                UniPath
              </span>
            </div>
            <h1
              className="text-foreground"
              style={{ fontWeight: 900, fontSize: "1.75rem" }}
            >
              Create your account
            </h1>
            <p className="text-muted-foreground text-sm mt-2 font-bold">
              Choose your account type to get started
            </p>
          </div>

          <div className="grid gap-4">
            {/* Student — Personal */}
            <button
              onClick={() => {
                setAccountSubType("personal");
                setStep("personal");
              }}
              className="bg-card dark:bg-card rounded-3xl border-4 border-border hover:border-accent p-6 text-left transition-all group hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-secondary/30 dark:bg-secondary/20 group-hover:bg-secondary/40 border-2 border-accent flex items-center justify-center flex-shrink-0 transition-colors">
                  <User className="w-7 h-7 text-secondary-foreground" />
                </div>
                <div>
                  <div
                    className="text-foreground mb-1"
                    style={{ fontWeight: 900 }}
                  >
                    Student Account
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    For individual students. Upload your
                    curriculum PDF and build your profile
                    manually.
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["PDF Upload", "Manual Entry", "Free"].map(
                      (tag) => (
                        <span
                          key={tag}
                          className="text-xs font-black bg-accent/30 dark:bg-accent/20 text-accent-foreground px-2.5 py-1 rounded-lg border border-accent"
                        >
                          {tag}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </button>

            {/* Student — Partner */}
            <button
              onClick={() => {
                setAccountSubType("partner");
                setStep("personal");
              }}
              className="bg-card dark:bg-card rounded-3xl border-4 border-border hover:border-accent p-6 text-left transition-all group hover:-translate-y-1 hover:shadow-lg relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-accent/20 rounded-bl-full -z-10 group-hover:scale-150 transition-transform"></div>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-accent/30 dark:bg-accent/20 group-hover:bg-accent/40 border-2 border-accent flex items-center justify-center flex-shrink-0 transition-colors">
                  <University className="w-7 h-7 text-accent-foreground" />
                </div>
                <div>
                  <div
                    className="text-foreground mb-1 flex items-center gap-2"
                    style={{ fontWeight: 900 }}
                  >
                    University Partner Student
                    <span className="text-[10px] uppercase tracking-wider font-black bg-accent/50 dark:bg-accent/30 text-accent-foreground px-2 py-0.5 rounded-lg border border-accent">
                      Recommended
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    For students at a partner university. Your
                    curriculum syncs automatically — no manual
                    upload needed.
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[
                      "Auto-sync",
                      "Richer Profile",
                      "Instant Start",
                    ].map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-black bg-accent/30 dark:bg-accent/20 text-accent-foreground px-2.5 py-1 rounded-lg border border-accent"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8 font-bold">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-primary hover:text-secondary hover:underline"
            >
              Log In
            </button>
          </p>

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mx-auto mt-6 transition-colors font-bold bg-card px-4 py-2 rounded-xl shadow-sm border border-border"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (step === "personal") {
    return (
      <div className="min-h-screen bg-background font-sans flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary border-b-4 border-secondary flex items-center justify-center transform hover:scale-105 transition-transform">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <span
                className="text-foreground tracking-tight"
                style={{ fontWeight: 900, fontSize: "1.5rem" }}
              >
                UniPath
              </span>
            </div>
            <h1
              className="text-foreground"
              style={{ fontWeight: 900, fontSize: "1.75rem" }}
            >
              Student Registration
            </h1>
          </div>
          <div className="bg-card rounded-3xl shadow-xl border-4 border-border p-8">
            <form
              onSubmit={handleStudentSubmit}
              className="space-y-5"
            >
              <div>
                <label className="text-sm text-foreground block mb-2 font-bold">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-border bg-muted text-foreground focus:outline-none focus:ring-4 focus:ring-accent/20 focus:border-accent transition-all text-sm font-medium"
                    placeholder="Alex Johnson"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-foreground block mb-2 font-bold">
                  University Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value,
                      })
                    }
                    className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-border bg-muted text-foreground focus:outline-none focus:ring-4 focus:ring-accent/20 focus:border-accent transition-all text-sm font-medium"
                    placeholder="you@student.edu"
                    required
                  />
                </div>
              </div>
              {accountSubType === "partner" && (
                <div>
                  <label className="text-sm text-foreground block mb-2 font-bold">
                    Select University
                  </label>
                  <Combobox
                    options={UNIVERSITY_OPTIONS}
                    value={form.university}
                    onValueChange={(value) =>
                      setForm({ ...form, university: value })
                    }
                    placeholder="Select your university…"
                    searchPlaceholder="Search universities..."
                    emptyText="No university found."
                  />
                </div>
              )}
              <div>
                <label className="text-sm text-foreground block mb-2 font-bold">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        password: e.target.value,
                      })
                    }
                    className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-border bg-muted text-foreground focus:outline-none focus:ring-4 focus:ring-accent/20 focus:border-accent transition-all text-sm font-medium"
                    placeholder="Min. 8 characters"
                    required
                  />
                </div>
              </div>

              {/* Consent notice */}
              <div className="bg-accent/20 border-2 border-accent/50 rounded-xl p-4 text-sm text-accent-foreground font-medium">
                <div
                  style={{ fontWeight: 900 }}
                  className="mb-1 text-accent-foreground"
                >
                  Data Consent
                </div>
                Your data will be processed solely to provide
                career matching services. Data is encrypted. We
                never sell your personal information to third
                parties.
              </div>

              <label className="flex items-start gap-3 text-sm text-foreground cursor-pointer font-bold">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 accent-primary rounded"
                  required
                />
                I agree to the Privacy Policy and Terms of
                Service.
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl border-b-4 border-secondary hover:bg-primary/90 active:border-b-0 active:translate-y-1 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2 text-base font-black shadow-sm"
              >
                {loading
                  ? "Creating account…"
                  : "Create Account"}
              </button>
            </form>

            <div className="flex items-center my-6">
              <div className="flex-1 border-t-2 border-border"></div>
              <span className="px-4 text-sm text-muted-foreground font-bold">
                or
              </span>
              <div className="flex-1 border-t-2 border-border"></div>
            </div>

            <GoogleButton
              onClick={() => setIsGoogleModalOpen(true)}
              text="Sign up with Google"
            />
          </div>
          <button
            onClick={() => setStep("type")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mx-auto mt-8 transition-colors font-bold bg-card px-4 py-2 rounded-xl shadow-sm border border-border"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
          <GoogleSignInModal
            isOpen={isGoogleModalOpen}
            onClose={() => setIsGoogleModalOpen(false)}
            title="Sign up with Google"
            onSelectAccount={(selectedEmail, selectedName) => {
              setIsGoogleModalOpen(false);
              setLoading(true);
              setTimeout(() => {
                signup(
                  selectedEmail,
                  "google-auth",
                  "student",
                  accountSubType,
                  selectedName,
                );
                navigate("/student");
              }, 800);
            }}
          />
        </div>
      </div>
    );
  }

  // University registration
  return (
    <UniversityRequestPage onBack={() => setStep("type")} />
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// University Request Form (no immediate access)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function UniversityRequestPage({
  onBack,
}: {
  onBack: () => void;
}) {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    universityName: "",
    contactName: "",
    email: "",
    website: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate request submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background font-sans flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
        <div className="w-full max-w-lg relative z-10 text-center">
          <div className="bg-card rounded-3xl shadow-xl border-4 border-border p-12">
            <div className="w-20 h-20 bg-secondary/15 rounded-3xl border-2 border-secondary/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-secondary" />
            </div>
            <h1
              className="text-foreground mb-3"
              style={{ fontSize: "1.75rem", fontWeight: 900 }}
            >
              Request Submitted
            </h1>
            <p
              className="text-muted-foreground font-medium mb-8 leading-relaxed"
              style={{ fontSize: "1.125rem" }}
            >
              Thank you for your interest in partnering with
              UniPath. We will contact you shortly to discuss
              integration options.
            </p>
            <p className="text-sm text-muted-foreground font-bold mb-8 bg-muted p-4 rounded-xl border border-border">
              Our team typically responds within 2 business
              days. We'll reach out to{" "}
              <span className="text-primary font-black">
                {form.email}
              </span>
            </p>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-2xl border-b-4 border-secondary hover:bg-primary/90 active:border-b-0 active:translate-y-1 transition-all text-base font-black shadow-md"
            >
              Back to Home
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary border-b-4 border-secondary flex items-center justify-center transform hover:scale-105 transition-transform">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <span
              className="text-foreground tracking-tight"
              style={{ fontWeight: 900, fontSize: "1.5rem" }}
            >
              UniPath
            </span>
          </div>
          <h1
            className="text-foreground"
            style={{ fontWeight: 900, fontSize: "1.75rem" }}
          >
            University Partnership Request
          </h1>
          <p className="text-muted-foreground text-sm mt-2 font-bold max-w-sm mx-auto">
            Submit your details and our team will contact you to
            discuss partnership options
          </p>
        </div>

        <div className="bg-card rounded-3xl shadow-xl border-4 border-border p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-foreground block mb-2 font-bold">
                University Name *
              </label>
              <input
                type="text"
                value={form.universityName}
                onChange={(e) =>
                  setForm({
                    ...form,
                    universityName: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-muted text-foreground focus:outline-none focus:ring-4 focus:ring-accent/20 focus:border-accent transition-all text-sm font-medium"
                placeholder="e.g. Thammasat University"
                required
              />
            </div>

            <div>
              <label className="text-sm text-foreground block mb-2 font-bold">
                Contact Person Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={form.contactName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      contactName: e.target.value,
                    })
                  }
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-border bg-muted text-foreground focus:outline-none focus:ring-4 focus:ring-accent/20 focus:border-accent transition-all text-sm font-medium"
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-foreground block mb-2 font-bold">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-border bg-muted text-foreground focus:outline-none focus:ring-4 focus:ring-accent/20 focus:border-accent transition-all text-sm font-medium"
                  placeholder="admin@university.edu"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-foreground block mb-2 font-bold">
                University Website
                <span className="text-muted-foreground font-normal ml-1">
                  (optional)
                </span>
              </label>
              <input
                type="url"
                value={form.website}
                onChange={(e) =>
                  setForm({ ...form, website: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-muted text-foreground focus:outline-none focus:ring-4 focus:ring-accent/20 focus:border-accent transition-all text-sm font-medium"
                placeholder="https://university.edu"
              />
            </div>

            <div>
              <label className="text-sm text-foreground block mb-2 font-bold">
                Message / Request Details
                <span className="text-muted-foreground font-normal ml-1">
                  (optional)
                </span>
              </label>
              <textarea
                value={form.message}
                onChange={(e) =>
                  setForm({ ...form, message: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-muted text-foreground focus:outline-none focus:ring-4 focus:ring-accent/20 focus:border-accent transition-all text-sm font-medium resize-none"
                placeholder="Tell us about your university and why you'd like to partner with UniPath…"
                rows={4}
              />
            </div>

            <div className="bg-secondary/10 border-2 border-secondary/30 rounded-xl p-4 text-sm text-foreground font-medium">
              <div
                style={{ fontWeight: 900 }}
                className="mb-1 text-foreground flex items-center gap-2"
              >
                <Building2 className="w-4 h-4" />
                Next Steps
              </div>
              <p className="text-muted-foreground">
                Our team will review your request and contact
                you within 2 business days to discuss:
              </p>
              <ul className="mt-2 space-y-1 pl-4 text-muted-foreground">
                <li>• Auto-sync integration</li>
                <li>• API credentials setup</li>
                <li>• Student enrollment details</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary text-secondary-foreground py-3.5 rounded-xl border-b-4 border-primary hover:bg-secondary/90 active:border-b-0 active:translate-y-1 transition-all disabled:opacity-60 mt-4 text-base font-black shadow-md"
            >
              {loading
                ? "Submitting Request…"
                : "Submit Partnership Request"}
            </button>
          </form>
        </div>

        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mx-auto mt-8 transition-colors font-bold bg-card px-4 py-2 rounded-xl shadow-sm border border-border"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
      </div>
    </div>
  );
}