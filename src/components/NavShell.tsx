"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Gamepad2, BarChart3, UserCircle } from "lucide-react";

const NAV_ITEMS = [
  { path: "/", label: "בית", icon: Home },
  { path: "/game", label: "משחק", icon: Gamepad2 },
  { path: "/profile", label: "פרופיל", icon: UserCircle },
  { path: "/dashboard", label: "דשבורד", icon: BarChart3 },
];

export default function NavShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50">
      <nav className="sticky top-0 z-50 glass border-b border-slate-200/60">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/30">
              ₪
            </div>
            <span className="font-bold text-slate-800 text-lg hidden sm:inline">פיננסי</span>
          </Link>
          <div className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
