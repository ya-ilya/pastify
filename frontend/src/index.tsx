import "./index.css";

import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";

import Account from "./pages/account/Account.tsx";
import App from "./pages/app/App.tsx";
import Paste from "./pages/paste/Paste.tsx";
import React from "react";
import ReactDOM from "react-dom/client";
import SignIn from "./pages/login/SignIn.tsx";
import SignUp from "./pages/signUp/SignUp.tsx";
import { useLocalStorage } from "./hooks/index.ts";

export * from "./config.ts";

export class Session {
  accessToken: string;
  refreshToken: string;
  userId: string;
  username: string;

  constructor(accessToken: string, refreshToken: string, userId: string, username: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.userId = userId;
    this.username = username;
  }
}

export const AuthenticationContext = React.createContext<
  [session: Session | null, setSession: (session: Session | null) => void]
>([null, () => {}]);

function AuthenticationRoute() {
  const [session, setSession] = useLocalStorage<Session>("session");

  return (
    <AuthenticationContext.Provider value={[session, setSession]}>
      <Outlet />
    </AuthenticationContext.Provider>
  );
}

const router = createBrowserRouter([
  {
    element: <AuthenticationRoute />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/signin",
        element: <SignIn />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/account",
        element: <Account />,
      },
      {
        path: "/:id",
        element: <Paste />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
