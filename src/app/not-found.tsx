import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";

export default function NotFound() {
  return (
    <PageHero
      eyebrow="Error 404"
      title={<>That page is out of <span className="serif-em text-terracotta">bounds</span></>}
      lead="The page you were looking for does not exist or has moved."
      actions={
        <Link href="/" className="btn">
          Back to home
        </Link>
      }
    />
  );
}
