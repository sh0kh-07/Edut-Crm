import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import { SuperAdminRoutes } from "./Routes/SuperAdminRoutes";
import { OwnerRoutes } from "./Routes/OwnerRoutes";
import Login from "./Components/Other/Login/Login";
import ErrorPage from "./Components/Other/ErrorPage/ErrorPage";
import SuperAdminLayout from "./layouts/SuperAdminLayout";
import SuperAdminProtected from "./Components/Other/ProtectedRoutes/SuperAdminProtected";
import OwnerProtected from "./Components/Other/ProtectedRoutes/OwnerProtected";
import OwnerLayout from "./layouts/OwnerLayout";
import AdminProtected from "./Components/Other/ProtectedRoutes/AdminProtected";
import { AdminRoutes } from "./Routes/AdminRoutes";
import AdminLayout from "./layouts/AdminLayout";
import TeacherProtected from "./Components/Other/ProtectedRoutes/TeacherProtected";
import TeacherLayout from "./layouts/TeacherLayout";
import { TeacherRoutes } from "./Routes/TeacherRoutes";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route path="/login" element={<Login />} />

          <Route path="superadmin" element={
            <SuperAdminProtected>
              <SuperAdminLayout />
            </SuperAdminProtected>
          }>
            {SuperAdminRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.component}
              />
            ))}
          </Route>
          <Route path="owner" element={
            <OwnerProtected>
              <OwnerLayout />
            </OwnerProtected>
          }>
            {OwnerRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.component}
              />
            ))}
          </Route>
          <Route  path="admin" element={
            <AdminProtected>
              <AdminLayout />
            </AdminProtected>
          }>
            {AdminRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.component}
              />
            ))}
          </Route>
          <Route path="teacher" element={
            <TeacherProtected>
              <TeacherLayout />
            </TeacherProtected>
          }>
            {TeacherRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.component}
              />
            ))}
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
export default App;
