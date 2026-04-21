import { createBrowserRouter } from "react-router";

import RootLayout from "./pages/RootLayout.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import { LoginPage, RegisterPage } from "./pages/AuthPages.tsx";

import StudentLayout from "./pages/student/StudentLayout.tsx";
import Dashboard from "./pages/student/Dashboard.tsx";
import Profile from "./pages/student/Profile.tsx";
import UploadCurriculum from "./pages/student/UploadCurriculum.tsx";
import RoleBrowser from "./pages/student/RoleBrowser.tsx";
import RoleDetail from "./pages/student/RoleDetail.tsx";
import CustomAnalysis from "./pages/student/CustomAnalysis.tsx";
import CustomRoleDetail from "./pages/student/CustomRoleDetail.tsx";
import SavedProjects from "./pages/student/SavedProjects.tsx";
import CareerMatches from "./pages/student/CareerMatches.tsx";

import UniversityLayout from "./pages/university/UniversityLayout.tsx";
import UniDashboard from "./pages/university/UniDashboard.tsx";
import DataUpload from "./pages/university/DataUpload.tsx";
import UniAnalytics from "./pages/university/UniAnalytics.tsx";
import UniStudents from "./pages/university/UniStudents.tsx";

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