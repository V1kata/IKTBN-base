"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useUser } from "@/app/context/UserContext";
import MobileNav from "@/app/ui/mobile/MobileNav";
import DesktopNavLink from "@/app/ui/desktop/DesktopNavLink";
import { canAccess } from "@/utils/access";
import { navLinks } from "@/utils/navLinks";

export function Header() {
  const { userData } = useUser();
  let role = userData?.role;
  if (!role && typeof window !== "undefined") {
    try {
      const stored = JSON.parse(localStorage.getItem("user") || "null");
      role = stored?.role;
    } catch (e) {
      role = null;
    }
  }
  role = role || "unloged";

  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const visibleLinks = navLinks.filter(link => canAccess(role, link.access));

  // Avoid rendering user-dependent nav links during SSR to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">

        <Link href="/" className="flex items-center space-x-2">
          <img src="/images/logo.png" alt="Лого" className="w-10 h-10 object-contain" />
          <span className="text-2xl font-bold text-red-700 tracking-tight">България</span>
        </Link>

        <nav className="hidden md:flex space-x-8 text-lg">
          {mounted && visibleLinks.map(({ href, label, icon }) => (
            <DesktopNavLink key={href} href={href} label={label} icon={icon} />
          ))}
        </nav>

        <button
          className="md:hidden text-gray-700"
          onClick={toggleMenu}
          aria-label="Навигация"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {menuOpen && mounted && (<MobileNav visibleLinks={visibleLinks} setMenuOpen={setMenuOpen}/>)}
    </header>
  );
}
