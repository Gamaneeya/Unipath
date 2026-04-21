// @refresh reset
import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  StudentProfile,
  SavedRole,
  SavedProject,
  INITIAL_STUDENT_PROFILE,
  PARTNER_STUDENT_PROFILE,
  JOB_ROLES,
  calculateStudentSkills,
  calculateMatch,
  Course,
  Experience,
} from "../data/mockData.ts";

type UserRole = "student" | "university" | null;

export interface SavedCustomAnalysis {
  id: string;
  title: string;
  percentage: number;
  acquired: string[];
  missing: string[];
  requiredSkills: string[];
  savedAt: string;
}

export interface CurrentCustomAnalysis {
  jdTitle: string;
  jdText: string;
  requiredSkills: string[];
  acquired: string[];
  missing: string[];
  percentage: number;
}

interface AppContextType {
  // Auth
  isAuthenticated: boolean;
  userRole: UserRole;
  userName: string | null;
  login: (email: string, password: string, role: UserRole, studentType?: "personal" | "partner", name?: string) => void;
  signup: (email: string, password: string, role: UserRole, studentType?: "personal" | "partner", name?: string, university?: string) => void;
  logout: () => void;

  // Demo user switching
  demoStudentType: "personal" | "partner";
  switchDemoStudent: (type: "personal" | "partner") => void;

  // Student Profile
  studentProfile: StudentProfile;
  updateProfile: (updates: Partial<StudentProfile>) => void;
  addCourse: (course: Course) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  addExperience: (exp: Experience) => void;
  deleteExperience: (id: string) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;

  // Derived
  studentSkills: string[];
  getRoleMatch: (roleId: string) => { percentage: number; acquired: string[]; missing: string[] };
  getTop3Recommendations: () => { roleId: string; percentage: number }[];

  // Saved Roles
  savedRoles: SavedRole[];
  saveRole: (roleId: string, options?: { isCustomJD?: boolean; customTitle?: string; customPercentage?: number; customAcquired?: string[]; customMissing?: string[]; customRequiredSkills?: string[] }) => void;
  removeSavedRole: (roleId: string) => void;
  isRoleSaved: (roleId: string) => boolean;

  // Saved Projects
  savedProjects: SavedProject[];
  saveProject: (projectId: string, roleId: string) => void;
  removeSavedProject: (projectId: string) => void;
  isProjectSaved: (projectId: string) => boolean;

  // Saved Custom Analyses
  savedCustomAnalyses: SavedCustomAnalysis[];
  saveCustomAnalysis: (analysis: Omit<SavedCustomAnalysis, "id" | "savedAt">) => void;
  removeSavedCustomAnalysis: (id: string) => void;
  isCustomAnalysisSaved: (title: string) => boolean;

  // Persisted current custom analysis (survives navigation)
  currentCustomAnalysis: CurrentCustomAnalysis | null;
  setCurrentCustomAnalysis: (analysis: CurrentCustomAnalysis | null) => void;

  // Consent
  consentGiven: boolean;
  giveConsent: () => void;

  // Profile Analysis State
  hasAnalyzedProfile: boolean;
  analyzeProfile: () => void;

  // Role History (Browse Roles page)
  roleHistory: { roleId: string; source: "analyzed" | "searched" }[];
  addRoleToHistory: (roleId: string, source?: "analyzed" | "searched") => void;
  removeFromRoleHistory: (roleId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

function generateMatchHistory(): { date: string; percentage: number }[] {
  const base = Math.floor(Math.random() * 30) + 20;
  return [
    { date: "Sep 2024", percentage: base },
    { date: "Oct 2024", percentage: base + 5 },
    { date: "Nov 2024", percentage: base + 8 },
    { date: "Dec 2024", percentage: base + 12 },
    { date: "Jan 2025", percentage: base + 15 },
    { date: "Feb 2025", percentage: base + 20 },
    { date: "Mar 2025", percentage: base + 22 },
  ];
}

// ── Returning-user preset data ─────────────────────────────────────────────────

const PERSONAL_SAVED_ROLES: SavedRole[] = [
  { roleId: "frontend-dev", savedAt: "2025-01-15", matchHistory: generateMatchHistory() },
  { roleId: "data-analyst", savedAt: "2025-02-01", matchHistory: generateMatchHistory() },
];

const PARTNER_SAVED_ROLES: SavedRole[] = [
  { roleId: "ux-designer", savedAt: "2025-01-10", matchHistory: generateMatchHistory() },
  { roleId: "product-manager", savedAt: "2025-02-14", matchHistory: generateMatchHistory() },
  { roleId: "data-scientist", savedAt: "2025-03-01", matchHistory: generateMatchHistory() },
];

const PERSONAL_SAVED_CUSTOM_ANALYSES: SavedCustomAnalysis[] = [];

const PARTNER_SAVED_CUSTOM_ANALYSES: SavedCustomAnalysis[] = [];

// ── Empty profile for first-time non-partner students ─────────────────────────
const EMPTY_STUDENT_PROFILE: StudentProfile = {
  id: "student-001",
  name: "Alex Johnson",
  email: "alex.johnson@student.edu",
  university: "Chulalongkorn University",
  accountType: "personal",
  courses: [],
  experiences: [],
  skills: [],
};

// ── Seed role history from top 3 matches (for returning users) ────────────────
function seedRoleHistory(
  profile: StudentProfile,
  preloadedSavedRoles: SavedRole[]
): { roleId: string; source: "analyzed" | "searched" }[] {
  const skills = calculateStudentSkills(profile);
  const savedIds = preloadedSavedRoles.map((r) => r.roleId);

  // Include non-custom saved roles in history as "analyzed" entries first
  const savedEntries = preloadedSavedRoles
    .filter((r) => !r.isCustomJD)
    .map((r) => ({ roleId: r.roleId, source: "analyzed" as const }));

  // Then add top 3 from remaining roles (excluding already-saved ones)
  const top3 = JOB_ROLES.filter((r) => !savedIds.includes(r.id))
    .map((r) => ({ roleId: r.id, percentage: calculateMatch(skills, r).percentage }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 3);

  return [...savedEntries, ...top3.map((r) => ({ roleId: r.roleId, source: "analyzed" as const }))];
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [demoStudentType, setDemoStudentType] = useState<"personal" | "partner">("personal");
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(EMPTY_STUDENT_PROFILE);
  const [savedRoles, setSavedRoles] = useState<SavedRole[]>([]);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [savedCustomAnalyses, setSavedCustomAnalyses] = useState<SavedCustomAnalysis[]>([]);
  const [currentCustomAnalysis, setCurrentCustomAnalysis] = useState<CurrentCustomAnalysis | null>(null);
  const [consentGiven, setConsentGiven] = useState(false);
  const [hasAnalyzedProfile, setHasAnalyzedProfile] = useState(false);
  const [roleHistory, setRoleHistory] = useState<{ roleId: string; source: "analyzed" | "searched" }[]>([]);

  const [userName, setUserName] = useState<string | null>(null);

  // ── LOGIN — returning user: pre-seeded data ───────────────────────────────
  const login = (_email: string, _password: string, role: UserRole, studentType?: "personal" | "partner", name?: string) => {
    setIsAuthenticated(true);
    setUserRole(role);
    if (name) setUserName(name);
    if (role === "student") {
      const type = studentType ?? "personal";
      setDemoStudentType(type);
      if (type === "partner") {
        setStudentProfile(PARTNER_STUDENT_PROFILE);
        setSavedRoles(PARTNER_SAVED_ROLES);
        setSavedCustomAnalyses(PARTNER_SAVED_CUSTOM_ANALYSES);
        setHasAnalyzedProfile(true);
        setRoleHistory(seedRoleHistory(PARTNER_STUDENT_PROFILE, PARTNER_SAVED_ROLES));
      } else {
        setStudentProfile(INITIAL_STUDENT_PROFILE);
        setSavedRoles(PERSONAL_SAVED_ROLES);
        setSavedCustomAnalyses(PERSONAL_SAVED_CUSTOM_ANALYSES);
        setHasAnalyzedProfile(true);
        setRoleHistory(seedRoleHistory(INITIAL_STUDENT_PROFILE, PERSONAL_SAVED_ROLES));
      }
    }
  };

  // ── SIGNUP — first-time user: empty / synced-only state ──────────────────
  const signup = (_email: string, _password: string, role: UserRole, studentType?: "personal" | "partner", name?: string, university?: string) => {
    setIsAuthenticated(true);
    setUserRole(role);
    if (name) setUserName(name);
    if (role === "student") {
      const type = studentType ?? "personal";
      setDemoStudentType(type);
      if (type === "partner") {
        setStudentProfile({
          ...PARTNER_STUDENT_PROFILE,
          ...(name ? { name } : {}),
          ...(university ? { university } : {}),
        });
        setSavedRoles([]);
        setSavedCustomAnalyses([]);
        setHasAnalyzedProfile(false);
        setRoleHistory([]);
      } else {
        setStudentProfile(EMPTY_STUDENT_PROFILE);
        setSavedRoles([]);
        setSavedCustomAnalyses([]);
        setHasAnalyzedProfile(false);
        setRoleHistory([]);
      }
    }
    if (role === "university") {
      // University: fresh admin account, no preset data needed
    }
  };

  const switchDemoStudent = (type: "personal" | "partner") => {
    setDemoStudentType(type);
    setSavedProjects([]);
    setSavedCustomAnalyses([]);
    setCurrentCustomAnalysis(null);
    if (type === "partner") {
      setStudentProfile(PARTNER_STUDENT_PROFILE);
      setSavedRoles(PARTNER_SAVED_ROLES);
      setSavedCustomAnalyses(PARTNER_SAVED_CUSTOM_ANALYSES);
      setHasAnalyzedProfile(true);
      setRoleHistory(seedRoleHistory(PARTNER_STUDENT_PROFILE, PARTNER_SAVED_ROLES));
    } else {
      setStudentProfile(INITIAL_STUDENT_PROFILE);
      setSavedRoles(PERSONAL_SAVED_ROLES);
      setSavedCustomAnalyses(PERSONAL_SAVED_CUSTOM_ANALYSES);
      setHasAnalyzedProfile(true);
      setRoleHistory(seedRoleHistory(INITIAL_STUDENT_PROFILE, PERSONAL_SAVED_ROLES));
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setDemoStudentType("personal");
    setStudentProfile(EMPTY_STUDENT_PROFILE);
    setSavedRoles([]);
    setSavedCustomAnalyses([]);
    setCurrentCustomAnalysis(null);
    setHasAnalyzedProfile(false);
    setRoleHistory([]);
    setUserName(null);
  };

  const updateProfile = (updates: Partial<StudentProfile>) => {
    setStudentProfile((prev) => ({ ...prev, ...updates }));
  };

  const addCourse = (course: Course) => {
    setStudentProfile((prev) => ({ ...prev, courses: [...prev.courses, course] }));
  };

  const updateCourse = (id: string, updates: Partial<Course>) => {
    setStudentProfile((prev) => ({
      ...prev,
      courses: prev.courses.map((c) => c.id === id ? { ...c, ...updates } : c),
    }));
  };

  const deleteCourse = (id: string) => {
    setStudentProfile((prev) => ({ ...prev, courses: prev.courses.filter((c) => c.id !== id) }));
  };

  const addExperience = (exp: Experience) => {
    setStudentProfile((prev) => ({ ...prev, experiences: [...prev.experiences, exp] }));
  };

  const deleteExperience = (id: string) => {
    setStudentProfile((prev) => ({ ...prev, experiences: prev.experiences.filter((e) => e.id !== id) }));
  };

  const addSkill = (skill: string) => {
    setStudentProfile((prev) => {
      if (prev.skills.includes(skill)) return prev;
      return { ...prev, skills: [...prev.skills, skill] };
    });
  };

  const removeSkill = (skill: string) => {
    setStudentProfile((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));
  };

  const studentSkills = calculateStudentSkills(studentProfile);

  const getRoleMatch = (roleId: string) => {
    const role = JOB_ROLES.find((r) => r.id === roleId);
    if (!role) return { percentage: 0, acquired: [], missing: [] };
    return calculateMatch(studentSkills, role);
  };

  const getTop3Recommendations = () => {
    const savedRoleIds = savedRoles.map((r) => r.roleId);
    return JOB_ROLES.filter((r) => !savedRoleIds.includes(r.id))
      .map((role) => ({ roleId: role.id, percentage: calculateMatch(studentSkills, role).percentage }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 3);
  };

  const saveRole = (roleId: string, options?: { isCustomJD?: boolean; customTitle?: string; customPercentage?: number; customAcquired?: string[]; customMissing?: string[]; customRequiredSkills?: string[] }) => {
    if (savedRoles.find((r) => r.roleId === roleId)) return;
    setSavedRoles((prev) => [
      ...prev,
      {
        roleId,
        savedAt: new Date().toISOString().split("T")[0],
        matchHistory: generateMatchHistory(),
        ...(options?.isCustomJD ? {
          isCustomJD: true,
          customTitle: options.customTitle,
          customPercentage: options.customPercentage,
          customAcquired: options.customAcquired,
          customMissing: options.customMissing,
          customRequiredSkills: options.customRequiredSkills,
        } : {}),
      },
    ]);
  };

  const removeSavedRole = (roleId: string) => {
    setSavedRoles((prev) => prev.filter((r) => r.roleId !== roleId));
  };

  const isRoleSaved = (roleId: string) => savedRoles.some((r) => r.roleId === roleId);

  const saveProject = (projectId: string, roleId: string) => {
    if (savedProjects.find((p) => p.projectId === projectId)) return;
    setSavedProjects((prev) => [...prev, { projectId, roleId, savedAt: new Date().toISOString().split("T")[0] }]);
  };

  const removeSavedProject = (projectId: string) => {
    setSavedProjects((prev) => prev.filter((p) => p.projectId !== projectId));
  };

  const isProjectSaved = (projectId: string) => savedProjects.some((p) => p.projectId === projectId);

  const saveCustomAnalysis = (analysis: Omit<SavedCustomAnalysis, "id" | "savedAt">) => {
    const id = `custom-${Date.now()}`;
    setSavedCustomAnalyses((prev) => {
      const filtered = prev.filter((a) => a.title !== analysis.title);
      return [...filtered, { ...analysis, id, savedAt: new Date().toISOString().split("T")[0] }];
    });
  };

  const removeSavedCustomAnalysis = (id: string) => {
    setSavedCustomAnalyses((prev) => prev.filter((a) => a.id !== id));
  };

  const isCustomAnalysisSaved = (title: string) =>
    savedCustomAnalyses.some((a) => a.title === title);

  const giveConsent = () => setConsentGiven(true);

  const analyzeProfile = () => {
    setHasAnalyzedProfile(true);
    const savedEntries = savedRoles
      .filter((r) => !r.isCustomJD)
      .map((r) => ({ roleId: r.roleId, source: "analyzed" as const }));
    const top3 = JOB_ROLES.filter((r) => !savedRoles.map((sr) => sr.roleId).includes(r.id))
      .map((role) => ({ roleId: role.id, percentage: calculateMatch(calculateStudentSkills(studentProfile), role).percentage }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 3);
    setRoleHistory([...savedEntries, ...top3.map((r) => ({ roleId: r.roleId, source: "analyzed" as const }))]);
  };

  const addRoleToHistory = (roleId: string, source: "analyzed" | "searched" = "searched") => {
    setRoleHistory((prev) => {
      if (prev.some((r) => r.roleId === roleId)) return prev;
      return [...prev, { roleId, source }];
    });
  };

  const removeFromRoleHistory = (roleId: string) => {
    setRoleHistory((prev) => prev.filter((r) => r.roleId !== roleId));
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        userRole,
        userName,
        login,
        signup,
        logout,
        demoStudentType,
        switchDemoStudent,
        studentProfile,
        updateProfile,
        addCourse,
        updateCourse,
        deleteCourse,
        addExperience,
        deleteExperience,
        addSkill,
        removeSkill,
        studentSkills,
        getRoleMatch,
        getTop3Recommendations,
        savedRoles,
        saveRole,
        removeSavedRole,
        isRoleSaved,
        savedProjects,
        saveProject,
        removeSavedProject,
        isProjectSaved,
        savedCustomAnalyses,
        saveCustomAnalysis,
        removeSavedCustomAnalysis,
        isCustomAnalysisSaved,
        currentCustomAnalysis,
        setCurrentCustomAnalysis,
        consentGiven,
        giveConsent,
        hasAnalyzedProfile,
        analyzeProfile,
        roleHistory,
        addRoleToHistory,
        removeFromRoleHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
