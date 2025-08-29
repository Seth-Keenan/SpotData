"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar({ token }: Readonly<{ token: boolean }>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-black text-white sticky top-0 z-50 shadow-md">
        <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-green-500">
                DataSpot
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex space-x-8">
                <Link href="/dashboard" className="hover:text-green-400 transition">Dashboard</Link>
                <Link href="/playlists" className="hover:text-green-400 transition">Playlists</Link>
                {token ? (
                    <Link href="/api/spotify/logout" className="hover:text-red-400">
                        Logout
                    </Link>
                ) : (
                    <Link href="/api/spotify/login" className="hover:text-green-400">
                        Login
                    </Link>
                )}
            </div>

            {/* Hamburger button */}
            <div className="md:hidden">
                <button
                onClick={() => setIsOpen(true)}
                className="p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                <Menu size={24} />
                </button>
            </div>
            </div>
        </div>

        {/* Fullscreen mobile menu */}
        {isOpen && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex flex-col items-center justify-center space-y-8">
            <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-md hover:bg-gray-800"
            >
                <X size={28} className="text-white" />
            </button>

            <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-2xl font-semibold hover:text-green-400">
                Dashboard
            </Link>
            <Link href="/playlists" onClick={() => setIsOpen(false)} className="text-2xl font-semibold hover:text-green-400">
                Playlists
            </Link>
            {token ? (
                <Link href="/api/spotify/logout" className="text-2xl font-semibold hover:text-red-400" onClick={() => setIsOpen(false)}>Logout</Link>
            ) : (
                <Link href="/api/spotify/login" className="text-2xl font-semibold hover:text-green-400" onClick={() => setIsOpen(false)}>Login</Link>
            )}
            </div>
        )}
    </nav>
  );
}
