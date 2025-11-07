import Image from "next/image";
import Link from "next/link";
import React from "react";

export const NavBar = () => {
  return (
    <header>
      <nav>
        <div className="flex gap-3">
          <Link href="/">
            <Image src="/icons/logo.png" alt="logo" width={24} height={24} />
          </Link>
          <p>divEvent</p>
        </div>
        <ul>
          <Link href="/">Home</Link>

          <Link href="/events">Events</Link>

          <Link href="/create-event">Create Event</Link>
        </ul>
      </nav>
    </header>
  );
};
