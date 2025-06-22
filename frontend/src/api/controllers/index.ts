import { AuthenticationContext } from "../..";
import { createAuthenticationController } from "./AuthenticationController";
import { useContext } from "react";

export * from "./AuthenticationController";
export * from "./MeController";
export * from "./PasteController";

export function isTokenExpired(token: string): boolean {
  try {
    const jwtPayload = JSON.parse(atob(token.split(".")[1]));
    return Date.now() >= jwtPayload.exp * 1000;
  } catch (error) {
    return true;
  }
}

export function useRefreshToken() {
  const [session, setSession] = useContext(AuthenticationContext);

  return async () => {
    if (!session) {
      return;
    }

    if (isTokenExpired(session.refreshToken)) {
      console.error("Refresh token is expired");
      setSession(null);
    }

    try {
      console.info(`Refreshing token`);

      const refreshTokenResponse = await createAuthenticationController().refreshToken({
        refreshToken: session.refreshToken,
      });

      setSession(refreshTokenResponse);

      console.info(`Token refreshed successfully`);
    } catch (err) {
      setSession(null);
      console.error("Failed to refresh token", err);
    }
  };
}
