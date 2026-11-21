import Link from "next/link";
import { site } from "@/lib/site";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg className={className} width="34" height="24" viewBox="0 0 34 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M1.5 21 11 7l5 7 4.5-6L32.5 21" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 21c1.5-3.5 4-5 7.5-5" stroke="var(--color-amber)" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 ${className}`} aria-label={`${site.name} home`}>
      <LogoMark className="text-clay" />
      <span className="font-heading text-[1.25rem] font-extrabold tracking-tight">{site.name}</span>
    </Link>
  );
}
