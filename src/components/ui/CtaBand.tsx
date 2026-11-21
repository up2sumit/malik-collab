import Link from "next/link";
import { Icon } from "./Icon";

interface CtaBandProps {
  title: string;
  body: string;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
}

export function CtaBand({ title, body, primary, secondary }: CtaBandProps) {
  return (
    <section aria-labelledby="band-title" className="on-dark bg-forest text-paper">
      <div className="wrap flex flex-col items-start justify-between gap-8 py-16 lg:flex-row lg:items-center lg:py-20">
        <div className="max-w-xl">
          <h2 id="band-title" className="t-h2">
            {title}
          </h2>
          <p className="t-lead mt-4 text-paper/85">{body}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href={primary.href} className="btn btn-light">
            {primary.label} <Icon name="arrow" size={18} className="arrow" />
          </Link>
          {secondary && (
            <Link href={secondary.href} className="btn btn-outline-light">
              {secondary.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
