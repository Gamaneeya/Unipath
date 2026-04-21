import { useNavigate } from "react-router";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  BrainCircuit,
  Building2,
  CheckCircle,
  GraduationCap,
  FileText,
  Lightbulb,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { ThemeDropdown } from "../components/ThemeDropdown";

const HERO_IMG =
  "https://images.unsplash.com/photo-1723149842407-637a523fb029?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBzdHVkZW50JTIwbGFwdG9wfGVufDF8fHx8MTc3Mzc2NjYxMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

const UNI_IMG =
  "https://images.unsplash.com/photo-1632765743329-3b257fe779a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNhZGUlMjBtYWNoaW5lJTIwcmV0cm98ZW58MXx8fHwxNzczNzAxMjEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

const FEATURES = [
  {
    icon: FileText,
    title: "Upload Curriculum",
    description:
      "Upload your course PDF or auto-sync your university data. We extract every skill so you can get started instantly.",
  },
  {
    icon: Target,
    title: "Role Matcher",
    description:
      "Our matching engine compares your current skills against the requirements of hundreds of job roles.",
  },
  {
    icon: BarChart3,
    title: "Skill Gap Analysis",
    description:
      "See exactly which skills you have and which you're missing for your target roles — know where to focus.",
  },
  {
    icon: Lightbulb,
    title: "AI Project Recommendations",
    description:
      "Get personalized project recommendations that directly help you build the skills needed to close your gaps.",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description:
      "Watch your match percentages improve as you complete courses and tackle new projects over time.",
  },
  {
    icon: Trophy,
    title: "Custom JD Analysis",
    description:
      "Paste any job description and instantly get a tailored analysis of your match score and skill gaps.",
  },
];

const STEPS = [
  {
    step: "Step 1",
    icon: BookOpen,
    title: "Create Your Profile",
    description:
      "Upload your curriculum PDF or connect via your university. We extract your skills and academic background automatically.",
  },
  {
    step: "Step 2",
    icon: BrainCircuit,
    title: "Find Your Match",
    description:
      "Our AI instantly calculates your match score across dozens of job roles and surfaces your top recommendations.",
  },
  {
    step: "Step 3",
    icon: Zap,
    title: "Build Your Skills",
    description:
      "Save target roles, track your progress, and use AI-generated projects to build the skills you need.",
  },
];

const STATS = [
  { value: "50+", label: "Job Roles Tracked" },
  { value: "12K+", label: "Students Joined" },
  { value: "35+", label: "Partner Universities" },
  { value: "92%", label: "Match Success Rate" },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background font-sans">
      <nav className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b-4 border-primary shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary border-b-4 border-secondary flex items-center justify-center transform hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span
              className="text-foreground tracking-tight"
              style={{ fontWeight: 800, fontSize: "1.25rem" }}
            >
              UniPath
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 font-bold text-muted-foreground">
            <a
              href="#features"
              className="hover:text-primary hover:-translate-y-0.5 transition-all"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-primary hover:-translate-y-0.5 transition-all"
            >
              How It Works
            </a>
            <a
              href="#universities"
              className="hover:text-primary hover:-translate-y-0.5 transition-all"
            >
              Universities
            </a>
          </div>

          <div className="flex items-center gap-3 font-bold">
            <ThemeDropdown variant="compact" />
            <button
              onClick={() => navigate("/register")}
              className="text-muted-foreground hover:text-primary px-4 py-2 transition-colors"
            >
              Sign Up
            </button>
            <button
              onClick={() => navigate("/login")}
              className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl border-b-4 border-secondary hover:bg-secondary active:border-b-0 active:translate-y-1 transition-all"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-background pt-16 pb-24">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-secondary rounded-full blur-3xl opacity-20 animate-pulse" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-accent rounded-full blur-3xl opacity-20" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-secondary/30 dark:bg-card text-primary dark:text-foreground text-sm px-4 py-2 rounded-full mb-6 border-2 border-accent dark:border-border font-bold shadow-sm">
              <Zap className="w-4 h-4 text-accent" />
              AI-Powered Career Matching
            </div>

            <h1
              className="text-foreground mb-6 tracking-tight"
              style={{
                fontSize: "3.5rem",
                fontWeight: 900,
                lineHeight: 1.1,
              }}
            >
              Bridge the gap from <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                campus to career.
              </span>
            </h1>

            <p
              className="text-muted-foreground mb-8 max-w-lg font-medium"
              style={{ fontSize: "1.125rem", lineHeight: 1.7 }}
            >
              Upload your curriculum, discover your top job role
              matches, and get a personalized project plan to
              close your skill gaps.
            </p>

            <div className="flex flex-wrap gap-4 font-bold">
              <button
                onClick={() => navigate("/register")}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-2xl border-b-4 border-secondary hover:bg-secondary active:border-b-0 active:translate-y-1 transition-all text-lg font-bold shadow-lg"
              >
                Get Started
              </button>
             <button
  onClick={() => navigate("/register?type=university")}
  className="inline-flex items-center gap-2 
  bg-accent/70 text-muted-foreground 
  dark:bg-secondary dark:text-primary-foreground
  px-8 py-4 rounded-2xl border-b-4 border-primary
  hover:bg-accent/80 dark:hover:bg-primary dark:hover:text-primary-foreground
  active:border-b-0 active:translate-y-1 
  transition-all text-lg font-bold shadow-lg
  cb:bg-[#0072b2] cb:text-white"
>
  Register University
  <ArrowRight className="w-5 h-5" />
</button>
            </div>

            <div className="mt-8 flex items-center gap-6 font-bold">
              {[
                "Free to Use",
                "No Credit Card",
                "PDPA Safe",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground bg-card px-3 py-1.5 rounded-lg shadow-sm border border-border"
                >
                  <CheckCircle className="w-4 h-4 text-accent" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.25)] border-8 border-card transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <img
                src={HERO_IMG}
                alt="Students using UniPath"
                className="w-full h-[460px] object-cover"
              />
            </div>

            <div
              className="absolute -bottom-6 -left-6 bg-card rounded-2xl shadow-xl p-5 border-2 border-border animate-bounce"
              style={{ animationDuration: "3s" }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/30 border-2 border-accent flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground font-bold uppercase tracking-wider">
                    Match Score
                  </div>
                  <div
                    className="text-primary"
                    style={{
                      fontWeight: 900,
                      fontSize: "1.5rem",
                    }}
                  >
                    +23% today
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 bg-card rounded-2xl shadow-xl p-5 border-2 border-border">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-primary animate-ping" />
                <div className="text-sm text-foreground font-bold">
                  Top Role Matches
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {[
                  "Frontend Developer",
                  "Data Analyst",
                  "Product Manager",
                ].map((r) => (
                  <span
                    key={r}
                    className="text-xs font-bold bg-secondary/30 dark:bg-card border border-accent dark:border-border text-primary dark:text-foreground px-3 py-1.5 rounded-lg shadow-sm"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y-4 border-border py-16 bg-card relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="text-center p-6 bg-background rounded-3xl border-2 border-border hover:-translate-y-1 transition-transform"
            >
              <div
                className="text-primary drop-shadow-sm"
                style={{ fontSize: "2.5rem", fontWeight: 900 }}
              >
                {s.value}
              </div>
              <div className="text-sm text-muted-foreground mt-2 font-bold uppercase tracking-wide">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="features"
        className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center mb-16">
          <h2
            className="text-foreground mb-4 tracking-tight"
            style={{ fontWeight: 900, fontSize: "2.5rem" }}
          >
            Everything you need to land your dream role
          </h2>
          <p
            className="text-muted-foreground max-w-2xl mx-auto font-medium"
            style={{ fontSize: "1.125rem" }}
          >
            From curriculum upload to AI-powered project
            recommendations — UniPath equips you with everything
            you need to succeed in your career journey.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((f, index) => (
            <div
              key={f.title}
              className="p-8 rounded-3xl bg-card border-2 border-border hover:border-accent hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <f.icon className="w-24 h-24" />
              </div>
              <div
                className={`w-14 h-14 rounded-2xl ${
                  index % 3 === 0
                    ? "bg-primary/20 dark:bg-muted text-primary"
                    : index % 3 === 1
                      ? "bg-accent/30 dark:bg-muted text-accent-foreground"
                      : "bg-secondary/30 dark:bg-muted text-secondary-foreground dark:text-secondary"
                } flex items-center justify-center mb-6 shadow-sm border-2 border-border`}
              >
                <f.icon className="w-7 h-7" />
              </div>
              <h3
                className="text-foreground mb-3 text-xl"
                style={{ fontWeight: 800 }}
              >
                {f.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed font-medium">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="how-it-works"
        className="py-24 bg-primary dark:bg-card text-white dark:text-foreground relative overflow-hidden dark:border-y dark:border-border"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2
              className="text-white dark:text-foreground mb-4"
              style={{ fontWeight: 900, fontSize: "2.5rem" }}
            >
              How It Works in 3 Steps
            </h2>
            <p
              className="text-accent/90 dark:text-muted-foreground max-w-xl mx-auto font-medium"
              style={{ fontSize: "1.125rem" }}
            >
              It takes less than 5 minutes to generate your
              first career match report.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-2 bg-secondary/50 dark:bg-muted rounded-full" />
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-2 bg-accent dark:bg-primary rounded-full w-1/3 z-0" />

            {STEPS.map((s) => (
              <div
                key={s.step}
                className="relative bg-secondary/40 dark:bg-background backdrop-blur-sm rounded-3xl p-8 border-2 border-accent dark:border-border text-center hover:bg-secondary/60 dark:hover:bg-background dark:hover:border-primary transition-colors dark:transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-accent dark:bg-primary border-b-4 border-primary dark:border-accent text-white dark:text-primary-foreground flex items-center justify-center mx-auto mb-6 relative z-10 shadow-lg shadow-accent/30 dark:shadow-none">
                  <s.icon className="w-8 h-8" />
                </div>
                <div
                  className="inline-block bg-card dark:bg-primary/10 text-accent-foreground dark:text-primary mb-4 px-3 py-1 rounded-lg dark:border dark:border-primary/20"
                  style={{
                    fontWeight: 900,
                    fontSize: "0.875rem",
                    letterSpacing: "0.1em",
                  }}
                >
                  {s.step}
                </div>
                <h3
                  className="text-white dark:text-foreground mb-3 text-xl"
                  style={{ fontWeight: 800 }}
                >
                  {s.title}
                </h3>
                <p className="text-accent/90 dark:text-muted-foreground leading-relaxed font-medium">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="universities"
        className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="rounded-3xl overflow-hidden border-8 border-card shadow-2xl transform -rotate-2">
              <img
                src={UNI_IMG}
                alt="Partner University"
                className="w-full h-96 object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 bg-card rounded-3xl shadow-xl p-6 border-2 border-border w-72">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-accent/30 dark:bg-muted rounded-lg dark:border dark:border-border">
                  <Users className="w-6 h-6 text-accent-foreground dark:text-primary" />
                </div>
                <span
                  className="text-foreground"
                  style={{ fontWeight: 800 }}
                >
                  University Stats
                </span>
              </div>
              {[
                "Frontend Developer",
                "Data Analyst",
                "Product Manager",
              ].map((r, i) => (
                <div
                  key={r}
                  className="flex items-center gap-3 mt-3"
                >
                  <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden shadow-inner">
                    <div
                      className={`h-full rounded-full ${i === 0 ? "bg-primary" : i === 1 ? "bg-accent" : "bg-secondary"}`}
                      style={{ width: `${[85, 72, 61][i]}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground font-bold w-16 truncate">
                    {r.split(" ")[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 bg-accent/30 dark:bg-card text-accent-foreground dark:text-foreground text-sm px-4 py-2 rounded-full mb-6 border-2 border-accent dark:border-border font-bold shadow-sm">
              <Building2 className="w-4 h-4 dark:text-accent" />
              For Universities
            </div>
            <h2
              className="text-foreground mb-6 tracking-tight"
              style={{
                fontWeight: 900,
                fontSize: "2.5rem",
                lineHeight: 1.2,
              }}
            >
              Give your students an unfair advantage
            </h2>
            <p
              className="text-muted-foreground mb-8 font-medium"
              style={{ fontSize: "1.125rem", lineHeight: 1.7 }}
            >
              Partner universities unlock automatic curriculum
              synchronization, eliminating manual PDF uploads
              for all enrolled students.
            </p>
            <ul className="space-y-4 mb-10">
              {[
                "Auto-sync student data via API",
                "Aggregate analytics across your institution",
                "Identify high-demand skills your curriculum is missing",
                "Detailed reporting to improve your curriculum",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-muted-foreground font-medium bg-card p-3 rounded-xl border border-border"
                >
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-accent/30 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-3.5 h-3.5 text-accent-foreground" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-primary via-secondary to-primary dark:bg-card relative overflow-hidden border-t border-border">
        {" "}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <div className="inline-block p-4 bg-white/10 dark:bg-card/10 rounded-3xl backdrop-blur-sm mb-8 border border-white/20 dark:border-white/10">
            {" "}
            <Trophy className="w-16 h-16 text-white dark:text-white drop-shadow-lg" />
          </div>
          <h2
            className="text-white dark:text-foreground mb-6 tracking-tight"
            style={{
              fontWeight: 900,
              fontSize: "3rem",
              lineHeight: 1.1,
            }}
          >
            Your career journey starts here
          </h2>
          <p
            className="text-accent/90  dark:text-muted-foreground mb-10 font-medium"
            style={{ fontSize: "1.25rem" }}
          >
            Join thousands of students who use UniPath to bridge
            the gap between their education and their dream
            career.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="inline-flex items-center gap-3 bg-accent text-foreground dark:text-accent-foreground px-10 py-5 rounded-2xl border-b-4 border-primary dark:border-white/20 hover:bg-accent/90 active:border-b-0 active:translate-y-1 transition-all shadow-xl shadow-accent/20"
            style={{ fontWeight: 900, fontSize: "1.25rem" }}
          >
            Get Started
            <GraduationCap className="w-6 h-6" />
          </button>
        </div>
      </section>

      <footer className="bg-primary dark:bg-card py-12 border-t-4 border-secondary dark:border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent border-b-4 border-secondary dark:border-accent/40 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-accent-foreground" />
            </div>
            <span
              className="text-white dark:text-foreground text-xl"
              style={{ fontWeight: 800 }}
            >
              UniPath
            </span>
          </div>

          <p className="text-sm font-medium text-white/80 dark:text-muted-foreground">
            © 2025 UniPath. Built for students, by students.
          </p>

          <div className="flex gap-8 text-sm font-bold text-white/80 dark:text-muted-foreground">
            <a
              href="#"
              className="hover:text-white dark:hover:text-foreground hover:-translate-y-0.5 transition-transform"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-white dark:hover:text-foreground hover:-translate-y-0.5 transition-transform"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="hover:text-white dark:hover:text-foreground hover:-translate-y-0.5 transition-transform"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}