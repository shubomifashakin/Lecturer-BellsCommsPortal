import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

import LoginPage from "./Pages/LoginPage";
import AssignmentsPage from "./Pages/AssignmentsPage";
import UploadPage from "./Pages/UploadPage";
import NotesPage from "./Pages/NotesPage";
import ForgotPassswordPage from "./Pages/ForgotPassswordPage";
import HomePage, { HomeLoader } from "./Pages/HomePage";
import CoursePage, { CourseLoader } from "./Pages/CoursePage";
import SubmissionsPage, { SubmissionsLoader } from "./Pages/SubmissionsPage";

import Layout from "./Components/Layout";
import ProtectedRoute from "./Components/ProtectedRoute";
import UpdatePasswordPage from "./Pages/UpdatePasswordPage";
import ErrorElement from "./Components/ErrorElement";

const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "forgotPassword", element: <ForgotPassswordPage /> },
  {
    path: "updatePassword",
    element: <UpdatePasswordPage />,
  },

  {
    element: <Layout />,
    children: [
      {
        path: "home",
        loader: HomeLoader,
        errorElement: <ErrorElement />,
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/:code",
        loader: CourseLoader,
        id: "courseData",
        errorElement: <ErrorElement />,
        element: (
          <ProtectedRoute>
            <CoursePage />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate replace to={"notes"} /> },
          { path: "assignments", element: <AssignmentsPage /> },
          { path: "notes", element: <NotesPage /> },
          { path: "upload", element: <UploadPage /> },
        ],
      },
      {
        path: "submissions/:code/:assFileName",
        loader: SubmissionsLoader,
        errorElement: <ErrorElement />,
        element: (
          <ProtectedRoute>
            <SubmissionsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        toastOptions={{
          success: {
            duration: 5 * 1000,
            style: {
              background: "#abf7b1",
            },
          },
          error: {
            duration: 1000 * 5,
            style: {
              background: "#ff6865",
            },
          },
        }}
      />
    </>
  );
}
