import "./index.css";
import "primeflex/primeflex.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeicons/primeicons.css";

import { PrimeReactProvider } from "primereact/api";
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import * as api from "./api";
import { useLocalStorage } from "./hooks/index.ts";
import { Account, App, Feed, Paste, SignIn, SignUp } from "./pages";

export * from "./config.ts";

function isTokenExpired(token: string): boolean {
  try {
    const jwtPayload = JSON.parse(atob(token.split(".")[1]));
    return Date.now() >= jwtPayload.exp * 1000;
  } catch (error) {
    return true;
  }
}

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

  useEffect(() => {
    const refreshToken = async () => {
      if (!session) {
        return;
      }

      if (!isTokenExpired(session.accessToken)) {
        console.info("Access token is still valid, no need to refresh");
        return;
      }

      if (isTokenExpired(session.refreshToken)) {
        console.error("Refresh token is expired");
        setSession(null);
      }

      try {
        console.info(`Refreshing token`);

        const refreshTokenResponse = await api.createAuthenticationController().refreshToken({
          refreshToken: session.refreshToken,
        });

        setSession(refreshTokenResponse);

        console.info(`Token refreshed successfully`);
      } catch (err) {
        setSession(null);
        console.error("Failed to refresh token", err);
      }
    };

    refreshToken();
  }, [session, setSession]);

  return (
    <PrimeReactProvider>
      <AuthenticationContext.Provider value={[session, setSession]}>
        <Outlet />
      </AuthenticationContext.Provider>
    </PrimeReactProvider>
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
