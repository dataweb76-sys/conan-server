"use client";

import Link from "next/link";

export default function Header() {
  return (
    <div className="shell">
      <div className="panel flex items-center justify-between">
        <Link href="/" className="font-bold tracking-wide">
          Conan Hub
        </Link>

        <div className="flex items-center gap-3 text-sm">
          <Link className="hover:underline" href="/admin">Admin</Link>
          <Link className="hover:underline" href="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
