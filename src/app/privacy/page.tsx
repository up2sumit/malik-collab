import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy notice",
  description: "What we collect when you use our forms, why, and how to ask us to delete it.",
  alternates: { canonical: "/privacy" },
};

const sections = [
  {
    title: "What we collect",
    body: "Only what you type into our application and enquiry forms: your name, email address, links to your work, and the description you write. We do not use advertising trackers on this site.",
  },
  {
    title: "Why we collect it",
    body: "To review your application or enquiry and to reply to you. We do not sell your information or use it for unrelated marketing.",
  },
  {
    title: "Who can see it",
    body: "People at our team who review submissions, and the email service we use to deliver them to us.",
  },
  {
    title: "Keeping and deleting it",
    body: "Replace this section with your actual retention period, and with the contact route for access and deletion requests.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Privacy" title="Privacy notice" lead={`How ${site.name} handles the information you send through our forms.`} />
      <section className="pb-24 pt-6 lg:pt-10">
        <div className="wrap max-w-3xl">
          <p className="mb-10 rounded-xl border border-line bg-sand px-5 py-4 text-sm">
            This is a plain-language starting point, not legal advice. Have it reviewed against the laws that apply to you (for example GDPR, UK GDPR, India&rsquo;s DPDP Act or CCPA) before launch.
          </p>
          {sections.map((s) => (
            <div key={s.title} className="border-t border-line py-7">
              <h2 className="t-h3">{s.title}</h2>
              <p className="mt-2 text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
