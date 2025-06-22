import "./index.css";

import * as api from "./api";

import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import React, { useEffect } from "react";

import Account from "./pages/account/Account.tsx";
import App from "./pages/app/App.tsx";
import Feed from "./pages/feed/Feed.tsx";
import Paste from "./pages/paste/Paste.tsx";
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
  const refreshToken = api.useRefreshToken();

  useEffect(() => {
    if (session && api.isTokenExpired(session.accessToken)) {
      refreshToken();
    }
  }, [session]);

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
        path: "/feed",
        element: <Feed />,
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
