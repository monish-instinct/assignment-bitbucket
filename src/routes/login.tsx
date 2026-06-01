import { createFileRoute, redirect } from "@tanstack/react-router";
import LoginPage from "@/pages/Login/LoginPage";
import { store } from "@/app/store";

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    if (store.getState().auth.isAuthenticated) {
      throw redirect({ to: "/users" });
    }
  },
  component: LoginPage,
});
