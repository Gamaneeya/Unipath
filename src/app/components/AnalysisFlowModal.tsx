import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";

export function AnalysisFlowModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const { analyzeProfile, studentProfile } = useApp();
  const navigate = useNavigate();

  const isPartner = studentProfile.accountType === "partner";

  const STEPS = isPartner
    ? [
        { label: "Reading synced curriculum…", short: "Curriculum" },
        { label: "Extracting skill signals…", short: "Skills" },
        { label: "Matching career paths…", short: "Matching" },
        { label: "Finalizing results…", short: "Results" },
      ]
    : [
        { label: "Parsing your courses…", short: "Courses" },
        { label: "Extracting skills…", short: "Skills" },
        { label: "Matching career paths…", short: "Matching" },
        { label: "Finalizing results…", short: "Results" },
      ];

  useEffect(() => {
    if (!isOpen) {
      setStep(0);
      setProgress(0);
      return;
    }

    let cancelled = false;

    const run = async () => {
      const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

      for (let i = 0; i < STEPS.length; i++) {
        if (cancelled) return;
        setStep(i);
        setProgress(Math.round(((i + 1) / STEPS.length) * 100));
        await delay(i === STEPS.length - 1 ? 800 : 1000);
      }

      if (cancelled) return;
      analyzeProfile();
      await delay(350);
      if (cancelled) return;
      onClose();
      navigate("/student/career-matches");
    };

    run();
    return () => { cancelled = true; };
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;

  const isDone = progress === 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <AnimatePresence mode="wait">
        <motion.div
          key="analysis-card"
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.04, y: -8 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="relative w-full max-w-lg bg-card dark:bg-card rounded-3xl border-4 border-border shadow-2xl p-8 overflow-hidden"
        >
          {/* Success animation overlay */}
          {isDone && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-accent/20 via-secondary/20 to-primary/20 backdrop-blur-sm z-10 rounded-3xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ type: "spring", stiffness: 200, damping: 12 }}
                className="bg-accent rounded-full p-6 shadow-2xl border-4 border-accent"
              >
                <CheckCircle2 className="w-16 h-16 text-foreground dark:text-background" />
              </motion.div>
            </motion.div>
          )}

          {/* Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/15 border-2 border-primary/30 mb-4 shadow-sm">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h2
              className="text-foreground mb-2"
              style={{ fontSize: "1.75rem", fontWeight: 900 }}
            >
              Analyzing Your Profile
            </h2>
            <p className="text-muted-foreground text-sm font-semibold">
              {isDone ? "Analysis complete!" : STEPS[step].label}
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-muted h-3 rounded-full overflow-hidden border border-border mb-5">
            <motion.div
              className={`h-full rounded-full transition-colors duration-500 ${
                isDone
                  ? "bg-gradient-to-r from-accent to-accent/80"
                  : "bg-gradient-to-r from-primary to-secondary"
              }`}
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-center gap-4">
            {STEPS.map((s, i) => {
              const done = i < step || isDone;
              const active = i === step && !isDone;
              return (
                <div key={s.short} className="flex items-center gap-1.5">
                  <motion.div
                    animate={active ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 0.6, repeat: active ? Infinity : 0, repeatDelay: 0.4 }}
                    className={`w-2 h-2 rounded-full transition-all duration-400 ${
                      done
                        ? "bg-accent"
                        : active
                        ? "bg-primary"
                        : "bg-muted"
                    }`}
                  />
                  <span
                    className={`text-xs font-bold transition-colors ${
                      done
                        ? "text-accent-foreground"
                        : active
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {s.short}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Partner data source note */}
          {isPartner && !isDone && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-5 text-[11px] text-accent-foreground font-bold bg-accent/30 dark:bg-accent/20 px-4 py-2 rounded-xl border border-accent"
            >
              Using auto-synced data from {studentProfile.university}
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}