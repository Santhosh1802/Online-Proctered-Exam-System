import "./App.css";
import { useRef, useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toast } from "primereact/toast";
import { ToggleButton } from "primereact/togglebutton";
import { ProgressSpinner } from "primereact/progressspinner";
import CookieConsent from "react-cookie-consent";
const Login = lazy(() => import("./Pages/Login"));
const ForgotPassword = lazy(() => import("./Pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./Pages/ResetPassword"));
const StudentDashboard = lazy(() => import("./Pages/StudentDashboard"));
const StudentViewReport = lazy(() => import("./Pages/StudentViewReport"));
const StudentProfile = lazy(() => import("./Pages/StudentProfile"));
const AdminDashboard = lazy(() => import("./Pages/AdminDashboard"));
const AdminProfile = lazy(() => import("./Pages/AdminProfile"));
const AdminManageStudent = lazy(() => import("./Pages/AdminManageStudent"));
const AdminManageTeacher = lazy(() => import("./Pages/AdminManageTeacher"));
const AdminViewReport = lazy(() => import("./Pages/AdminViewReport"));
const TeacherDashboard = lazy(() => import("./Pages/TeacherDashboard"));
const TeacherAssignTest = lazy(() => import("./Pages/TeacherAssignTest"));
const TeacherManageTest = lazy(() => import("./Pages/TeacherManageTest"));
const TeacherProfile = lazy(() => import("./Pages/TeacherProfile"));
const TestForm = lazy(() => import("./Pages/TestForm"));
const EditTestForm = lazy(() => import("./Pages/EditTestForm"));
const TestTakingPage = lazy(() => import("./Pages/TestTakingPage"));
const InstructionsPage = lazy(() => import("./Pages/InstructionsPage"));
const TeacherViewReport = lazy(() => import("./Pages/TeacherViewReport"));
function App() {
  const toast = useRef(null);

  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("theme")) {
      localStorage.setItem("theme", "light");
    }
    const savedTheme = localStorage.getItem("theme");
    setIsDarkTheme(savedTheme === "dark");
  }, []);

  const handleThemeChange = (e) => {
    const selectedTheme = e.value ? "dark" : "light";
    setIsDarkTheme(e.value);
    localStorage.setItem("theme", selectedTheme);
  };

  useEffect(() => {
    const themeLink = document.getElementById("theme-link");
    themeLink.href = `/primereact-themes/${isDarkTheme ? "md-dark-indigo.css" : "md-light-indigo.css"}`;
  }, [isDarkTheme]);
  return (
    <BrowserRouter>
      <div>
        <Toast ref={toast} />
        <div className="toggle-button-container">
          <ToggleButton
            checked={isDarkTheme}
            onChange={handleThemeChange}
            onLabel="Dark"
            offLabel="Light"
            onIcon="pi pi-moon"
            offIcon="pi pi-sun"
            className="w-8rem"
            style={{ zIndex: "2" }}
            aria-label="Theme Toggle Button"
            aria-roledescription="Toggle theme between light and dark"
          />
        </div>
        <Suspense
          fallback={
            <div className="loading-container">
              <ProgressSpinner />
            </div>
          }
        >
          <AppRoutes toast={toast} />
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

function AppRoutes({ toast }) {
  return (
    <div>
    <CookieConsent
        location="bottom"
        buttonText="Accept"
        enableDeclineButton

        onAccept={() => document.cookie="userConsent=true;path=/"}>
          This website uses cookies Accept or else it won't perform{" "}
        </CookieConsent>
      <Routes>
        <Route path="/" element={<Login toast={toast} />} />
        <Route path="/login" element={<Login toast={toast} />} />
        <Route
          path="/forgotpassword"
          element={<ForgotPassword toast={toast} />}
        />
        <Route
          path="/resetpassword"
          element={<ResetPassword toast={toast} />}
        />
        <Route
          path="/studentdashboard"
          element={<StudentDashboard toast={toast} />}
        />
        <Route
          path="/studentprofile"
          element={<StudentProfile toast={toast} />}
        />
        <Route
          path="/studentreport"
          element={<StudentViewReport toast={toast} />}
        />
        <Route
          path="/admindashboard"
          element={<AdminDashboard toast={toast} />}
        />
        <Route path="/adminprofile" element={<AdminProfile toast={toast} />} />
        <Route
          path="/adminstudent"
          element={<AdminManageStudent toast={toast} />}
        />
        <Route
          path="/adminteacher"
          element={<AdminManageTeacher toast={toast} />}
        />
        <Route
          path="/adminreport"
          element={<AdminViewReport toast={toast} />}
        />
        <Route
          path="/teacherdashboard"
          element={<TeacherDashboard toast={toast} />}
        />
        <Route
          path="/teacherstudent"
          element={<TeacherAssignTest toast={toast} />}
        />
        <Route
          path="/teachertest"
          element={<TeacherManageTest toast={toast} />}
        />
        <Route
          path="/teacherreport"
          element={<TeacherViewReport toast={toast} />}
        />
        <Route path="/createtest" element={<TestForm toast={toast} />} />
        <Route
          path="/edittest/:testId"
          element={<EditTestForm toast={toast} />}
        />
        <Route
          path="/teacherprofile"
          element={<TeacherProfile toast={toast} />}
        />
        <Route
          path="/test/:testId"
          element={<TestTakingPage toast={toast} />}
        />
        <Route
          path="/instructions/:testId"
          element={<InstructionsPage toast={toast} />}
        />
        <Route path="*" element={<Login toast={toast} />} />
      </Routes>
    </div>
  );
}

export default App;
