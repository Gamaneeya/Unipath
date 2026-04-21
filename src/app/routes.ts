import { createBrowserRouter } from "react-router";

import RootLayout from "./pages/RootLayout";
import LandingPage from "./pages/LandingPage";
import { LoginPage, RegisterPage } from "./pages/AuthPages";

import StudentLayout from "./pages/student/StudentLayout";
import Dashboard from "./pages/student/Dashboard";
import Profile from "./pages/student/Profile";
import UploadCurriculum from "./pages/student/UploadCurriculum";
import RoleBrowser from "./pages/student/RoleBrowser";
import RoleDetail from "./pages/student/RoleDetail";
import CustomAnalysis from "./pages/student/CustomAnalysis";
import CustomRoleDetail from "./pages/student/CustomRoleDetail";
import SavedProjects from "./pages/student/SavedProjects";
import CareerMatches from "./pages/student/CareerMatches";

import UniversityLayout from "./pages/university/UniversityLayout";
import UniDashboard from "./pages/university/UniDashboard";
import DataUpload from "./pages/university/DataUpload";
import UniAnalytics from "./pages/university/UniAnalytics";
import UniStudents from "./pages/university/UniStudents";

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      {
        path: "/",
        Component: LoginPage,
      },
      {
        path: "/home",
        Component: LandingPage,
      },
      {
        path: "/login",
        Component: LoginPage,
      },
      {
        path: "/register",
        Component: RegisterPage,
      },
      {
        path: "/signup",
        Component: RegisterPage,
      },
      {
        path: "/student",
        Component: StudentLayout,
        children: [
          { index: true, Component: Dashboard },
          { path: "profile", Component: Profile },
          { path: "upload", Component: UploadCurriculum },
          { path: "roles", Component: RoleBrowser },
          { path: "roles/:roleId", Component: RoleDetail },
          { path: "custom", Component: CustomAnalysis },
          { path: "custom/:roleId", Component: CustomRoleDetail },
          { path: "projects", Component: SavedProjects },
          { path: "career-matches", Component: CareerMatches },
        ],
      },
      {
        path: "/university",
        Component: UniversityLayout,
        children: [
          { index: true, Component: UniDashboard },
          { path: "upload", Component: DataUpload },
          { path: "analytics", Component: UniAnalytics },
          { path: "students", Component: UniStudents },
        ],
      },
    ],
  },
]);