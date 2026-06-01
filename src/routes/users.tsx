import { createFileRoute, redirect } from "@tanstack/react-router";
import UsersPage from "@/pages/Users/UsersPage";
import { store } from "@/app/store";

export const Route = createFileRoute("/users")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    if (!store.getState().auth.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: UsersPage,
});
