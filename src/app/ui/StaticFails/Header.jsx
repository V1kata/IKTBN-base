"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";
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

  const [subHeaderOpen, setSubHeaderOpen] = useState(false);
  const toggleSubHeader = () => setSubHeaderOpen(!subHeaderOpen);

  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const visibleLinks = navLinks.filter((link) => canAccess(role, link.access));

  const MAIN_HREFS = [
    "/",
    "/maps",
    "/mylessons",
    "/auth/login",
    "/auth/logout",
  ];
  const mainLinks = visibleLinks.filter((link) =>
    MAIN_HREFS.includes(link.href)
  );
  const subLinks = visibleLinks.filter(
    (link) => !MAIN_HREFS.includes(link.href)
  );

  // Avoid rendering user-dependent nav links during SSR to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  const [currentDateStr, setCurrentDateStr] = useState("");
  const [wikiUrl, setWikiUrl] = useState("");

  useEffect(() => {
    setMounted(true);
    try {
      const now = new Date();
      const day = now.getDate();
      const month = new Intl.DateTimeFormat("bg-BG", { month: "long" })
        .format(now)
        .toLowerCase();
      const year = now.getFullYear();
      setCurrentDateStr(`${day} ${month} ${year}`);
      setWikiUrl(`https://bg.wikipedia.org/wiki/${day}_${month}`);
    } catch (e) {
      console.error("Date formatting error", e);
    }
  }, []);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between relative">
        <Link href="/" className="flex items-center space-x-2">
          <img
            src="/images/logo.png"
            alt="Лого"
            className="w-10 h-10 object-contain"
          />
          <span className="text-2xl font-bold text-red-700 tracking-tight">
            България
          </span>
        </Link>

        {mounted && (
          <div className="absolute left-1/2 transform -translate-x-1/2 text-center flex items-center gap-4">
            <span className="text-lg md:text-xl font-medium text-gray-700">
              {currentDateStr}
            </span>
            <a
              href={wikiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg md:text-xl font-medium text-blue-600 hover:underline"
              aria-label={`Wikipedia page for ${currentDateStr}`}
            >
              Wikipedia
            </a>
          </div>
        )}

        <nav className="hidden md:flex items-center space-x-8 text-lg">
          {mounted &&
            mainLinks.map(({ href, label, icon }) => (
              <DesktopNavLink
                key={href}
                href={href}
                label={label}
                icon={icon}
              />
            ))}

          {mounted && subLinks.length > 0 && (
            <button
              onClick={toggleSubHeader}
              className="flex items-center gap-1 text-gray-700 hover:text-red-700 transition font-medium focus:outline-none"
            >
              Още
              {subHeaderOpen ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>
          )}
        </nav>

        <button
          className="md:hidden text-gray-700"
          onClick={toggleMenu}
          aria-label="Навигация"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Expandable Sub Header (Desktop) */}
      <div
        className={`hidden md:block bg-gray-50 border-t overflow-hidden transition-all duration-300 ease-in-out ${
          subHeaderOpen ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="container mx-auto px-4 py-3 flex justify-end space-x-6 text-base">
          {mounted &&
            subLinks.map(({ href, label, icon }) => (
              <DesktopNavLink
                key={href}
                href={href}
                label={label}
                icon={icon}
              />
            ))}
        </div>
      </div>

      {menuOpen && mounted && (
        <MobileNav visibleLinks={visibleLinks} setMenuOpen={setMenuOpen} />
      )}
    </header>
  );
}
