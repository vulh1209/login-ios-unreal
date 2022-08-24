import { createContext, FC, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { AtherIdWidgetProvider, useAtherIdContext } from "@sipher.dev/ather-id";
import { useToast } from "@chakra-ui/react";
import { getRedirectUrl } from "../services/utils";

const useAuthValue = () => {
  const atherId = useAtherIdContext();
  const router = useRouter();

  const { authState } = atherId;

  useEffect(() => {
    getRedirectUrl()
    if (authState === "initializing" || !router.isReady) return;

    const isLoginRoute = router.pathname === "/onboarding";
    if (authState === "signIn" && !isLoginRoute) {
      const next = encodeURIComponent(router.route);
      router.push(`${"/onboarding"}?next=${next}`);
    }
    if (authState === "signedIn") {
      if (isLoginRoute) {
        let next = decodeURIComponent((router.query["next"] as string) || "/");
        const [pathname, search] = next.split("?");
        router.push({ pathname, search });
      }
    }

  }, [router.isReady, router.pathname, authState]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).LOG_LEVEL = "DEBUG";
    }
  }, []);

  return {
    ...atherId,
    initializing: authState === "initializing",
    authenticated: authState === "signedIn",
  };
};

export type AuthContext = ReturnType<typeof useAuthValue>;

const context = createContext<AuthContext | null>(null);

export const AuthProvider: FC = ({ children }) => {
  const value = useAuthValue();
  const toast = useToast();
  const handleError = (err: any) => {
    toast({
      id: err?.code,
      status: "error",
      title: err?.code,
      description: err?.message,
    });
  };

  return (
    <context.Provider value={value}>
      <AtherIdWidgetProvider onError={handleError}>
        {children}
      </AtherIdWidgetProvider>
    </context.Provider>
  );
};

export const useAuthContext = () => {
  const value = useContext(context);

  if (!value) {
    throw new Error("useAuthContect must be used inside AuthProvider");
  }

  return value;
};
