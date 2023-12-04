import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import RootLayout from "./pages/Root";
import Errors from "./pages/Errors";
import HomePage from "./pages/HomePage";
import { queryClient } from "./http";
import NewUser from "./pages/NewUser";
import DetailUser from "./pages/DetailUser";
import AuthenticationPage, {
  action as authAction,
} from "./pages/Authentication";
import { action as logoutAction } from "./pages/logout";
import { checkAuthLoader, tokenLoader } from "./utils/auth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    // errorElement: <Errors />,
    id: "root",
    loader: tokenLoader,
    children: [
      { index: true, element: <Navigate to="/users" replace /> },
      { path: "auth", element: <AuthenticationPage />, action: authAction },
      { path: "logout", action: logoutAction },
      {
        path: "users",
        element: <HomePage />,
        loader: checkAuthLoader,
        children: [{ path: "new", element: <NewUser /> }],
      },
      {
        path: "users/:userId",
        element: <DetailUser />,
        loader: checkAuthLoader,
      },
    ],
  },
]);
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
