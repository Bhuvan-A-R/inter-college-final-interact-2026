"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { useAuthContext } from "@/contexts/auth-context";

// ─── All auth logic below is intentionally untouched ─────────────────────────

type LoginLogoutButtonProps = {
  variant?: "inline" | "stacked";
};

const LoginLogoutButton = ({ variant = "inline" }: LoginLogoutButtonProps) => {
  const { isLoggedIn, role, setIsLoggedIn } = useAuthContext();
  const isAdmin = role === "SUPER_ADMIN" || role === "ADMIN";
  const isParticipant =
    role === "PARTICIPANT" || (isLoggedIn && role !== null && !isAdmin);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setIsLoggedIn(false);
        router.push("/auth/signin");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  // ─── Visual layer only changes below ─────────────────────────────────────

  const baseBtn =
    "inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold tracking-wide border transition-all duration-300 ";

  const stackedBtn = "w-full";

  const glassBtn =
    baseBtn +
    "bg-white/5 border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-sm";

  const primaryBtn =
    baseBtn +
    "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700 hover:shadow-[0_0_15px_rgba(37,99,235,0.4)]";

  return (
    <div
      className={
        variant === "stacked"
          ? "flex w-full flex-col gap-2"
          : "flex flex-wrap items-center gap-2"
      }
    >
      {isLoggedIn ? (
        <>
          {
            isAdmin ? (
              // SUPER_ADMIN / ADMIN: registered students list + payment dashboard
              <>
                <Link
                  id="dashboard-link"
                  href="/adminDashboard"
                  className={`${baseBtn} ${variant === "stacked" ? stackedBtn : ""}`}
                >
                  Registrations
                </Link>
                <Link
                  id="payments-link"
                  href="/admin"
                  className={`${baseBtn} ${variant === "stacked" ? stackedBtn : ""}`}
                >
                  Payments
                </Link>
              </>
            ) : isParticipant ? (
              // PARTICIPANT (or any non-admin logged-in user): full nav
              <>
                <Link
                  id="dashboard-link"
                  href="/dashboard"
                  className={`${baseBtn} ${variant === "stacked" ? stackedBtn : ""}`}
                >
                  Dashboard
                </Link>
                <Link
                  id="cart-link"
                  href="/cart"
                  className={`${baseBtn} ${variant === "stacked" ? stackedBtn : ""}`}
                >
                  Cart
                </Link>
                <Link
                  id="teams-link"
                  href="/teams"
                  className={`${baseBtn} ${variant === "stacked" ? stackedBtn : ""}`}
                >
                  Teams
                </Link>
                {/* <Link
                id="invites-link"
                href="/invites"
                className={`${baseBtn} ${variant === "stacked" ? stackedBtn : ""}`}
              >
                Invites
              </Link> */}
                <Link
                  id="invites-link"
                  href="/invites"
                  className={`${baseBtn} ${variant === "stacked" ? stackedBtn : ""}`}
                  aria-label="Invites" // Best practice for accessibility when using only icons
                >
                  <UserPlus className="h-5 w-5" /> {/* */}
                </Link>
                <Link
                  id="orders-link"
                  href="/orders"
                  className={`${baseBtn} ${variant === "stacked" ? stackedBtn : ""}`}
                >
                  Orders
                </Link>
              </>
            ) : null /* role still loading — render nothing until checkAuth resolves */
          }
          <Link
            id="logout-link"
            href="/auth/logout"
            className={`${primaryBtn} ${variant === "stacked" ? stackedBtn : ""}`}
          >
            Logout
          </Link>
        </>
      ) : (
        <Link
          id="login-link"
          href="/auth/signin"
          className={`${primaryBtn} ${variant === "stacked" ? stackedBtn : ""}`}
        >
          Login / Register
        </Link>
      )}
    </div>
  );
};

export default LoginLogoutButton;
