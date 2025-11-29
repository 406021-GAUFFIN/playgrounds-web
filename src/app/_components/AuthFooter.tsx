"use client";
import Link from "next/link";

export const AuthFooter = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 surface-section border-top-1 surface-border p-3">
      <div className="flex justify-content-center gap-4">
        <Link href="/terms" className="text-primary hover:underline">
          Términos y Condiciones
        </Link>
        <Link href="/faq" className="text-primary hover:underline">
          FAQ
        </Link>
      </div>
    </footer>
  );
};
