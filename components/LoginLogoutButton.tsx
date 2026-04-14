"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, ShoppingCart, ClipboardList, Users } from "lucide-react";
import { useAuthContext } from "@/contexts/auth-context";

// ─── All auth logic below is intentionally untouched ─────────────────────────

type LoginLogoutButtonProps = {
  variant?: "inline" | "stacked";
};

const LoginLogoutButton = ({ variant = "inline" }: LoginLogoutButtonProps) => {
  const { isLoggedIn, role, setIsLoggedIn } = useAuthContext();
  const isAdmin =
    role === "SUPER_ADMIN" || role === "REG_ADMIN" || role === "ADMIN";
  const isParticipant =
    role === "PARTICIPANT" || (isLoggedIn && role !== null && !isAdmin);
  const router = useRouter();

  const [cartCount, setCartCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [invitesCount, setInvitesCount] = useState(0);

  const fetchStats = () => {
    if (!isParticipant) return;
    const fetchObj = { cache: "no-store" as RequestCache };
    fetch("/api/cart", fetchObj)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setCartCount(d.data.items?.length ?? 0);
      })
      .catch(() => {});
    fetch("/api/orders", fetchObj)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setOrdersCount(d.data.items?.length ?? 0);
      })
      .catch(() => {});
    fetch("/api/invites", fetchObj)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setInvitesCount(d.data.items?.length ?? 0);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchStats();
    window.addEventListener("update-user-stats", fetchStats);
    return () => window.removeEventListener("update-user-stats", fetchStats);
  }, [isParticipant]);

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
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-[10px] sm:text-[11px] font-semibold tracking-wide border transition-all duration-300 px-2 py-1.5 sm:px-2.5 sm:py-1.5 ";

  const stackedBtn = "w-full";
  const iconBtn = `${baseBtn} ${variant === "stacked" ? stackedBtn : "w-8 h-8 p-0"}`;

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
          : "flex flex-wrap items-center gap-1.5 max-w-[360px]"
      }
    >
      {isLoggedIn ? (
        <>
          {
            isAdmin ? (
              // SUPER_ADMIN / ADMIN / REG_ADMIN: payment dashboard
              <>
                {role === "SUPER_ADMIN" && (
                  <Link
                    id="dashboard-link"
                    href="/adminDashboard"
                    className={`${baseBtn} ${variant === "stacked" ? stackedBtn : ""}`}
                  >
                    Registrations
                  </Link>
                )}
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
                <div
                  className={
                    variant === "stacked"
                      ? "grid grid-cols-2 gap-2"
                      : "flex items-center gap-1.5"
                  }
                >
                  <Link
                    id="teams-link"
                    href="/teams"
                    className={`${iconBtn} relative`}
                  >
                    <Users size={18} strokeWidth={2} />
                    <span className="sr-only">Teams</span>
                  </Link>
                  <Link
                    id="invites-link"
                    href="/invites"
                    className={`${iconBtn} relative`}
                  >
                    <UserPlus size={18} strokeWidth={2} />
                    <span className="sr-only">Invites</span>
                    {invitesCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white leading-none">
                        {invitesCount > 9 ? "9+" : invitesCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    id="cart-link"
                    href="/cart"
                    className={`${iconBtn} relative`}
                  >
                    <ShoppingCart size={18} strokeWidth={2} />
                    <span className="sr-only">Cart</span>
                    {cartCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white leading-none">
                        {cartCount > 9 ? "9+" : cartCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    id="orders-link"
                    href="/orders"
                    className={`${iconBtn} relative`}
                  >
                    <ClipboardList size={18} strokeWidth={2} />
                    <span className="sr-only">Orders</span>
                    {ordersCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white leading-none">
                        {ordersCount > 9 ? "9+" : ordersCount}
                      </span>
                    )}
                  </Link>
                </div>
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
