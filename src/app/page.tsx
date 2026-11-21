import { BrandCollab } from "@/components/home/BrandCollab";
import { ClosingCta } from "@/components/home/ClosingCta";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Showcase } from "@/components/home/Showcase";
import { SportCategories } from "@/components/home/SportCategories";
import { Stories } from "@/components/home/Stories";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SportCategories />
      <HowItWorks />
      <Stories />
      <BrandCollab />
      <Showcase limit={3} />
      <ClosingCta />
    </>
  );
}
