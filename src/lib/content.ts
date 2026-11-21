import type { SportSlug } from "./sports";

/* All page copy that is likely to change lives here, not in components. */

export const hero = {
  eyebrow: "The sports creator collaboration platform",
  titleLines: ["Creators, Brands &", "Sports"],
  titleEmphasis: "Together",
  lead: "Turn your passion for sport into real opportunities. Connect with creators, collaborate on meaningful campaigns, and grow through authentic sports storytelling.",
  highlights: [
    { icon: "users", label: "Creator community" },
    { icon: "star", label: "Meaningful collaborations" },
    { icon: "trend", label: "Grow together" },
  ],
} as const;

export const steps = [
  {
    n: "01",
    title: "Apply",
    body: "Tell us about yourself, your sport, your content and your audience. It takes about five minutes.",
    art: "laptop",
  },
  {
    n: "02",
    title: "Connect",
    body: "We introduce you to brands and creators whose goals and audience fit yours.",
    art: "connect",
  },
  {
    n: "03",
    title: "Create & grow",
    body: "Make authentic sports content together and build partnerships that last beyond one campaign.",
    art: "camera",
  },
] as const;

export interface Story {
  id: string;
  name: string;
  sport: string;
  quote: string;
  /** Sample content must stay flagged until replaced with a real, approved story. */
  demo: boolean;
}

export const stories: readonly Story[] = [
  {
    id: "s1",
    name: "Sample creator",
    sport: "Running",
    quote:
      "A real creator quote goes here. Replace this sample with an approved story about turning content into a first brand partnership.",
    demo: true,
  },
  {
    id: "s2",
    name: "Sample creator",
    sport: "Cycling",
    quote:
      "A real creator quote goes here. Describe what the collaboration felt like and what changed for their channel.",
    demo: true,
  },
  {
    id: "s3",
    name: "Sample creator",
    sport: "Surfing",
    quote:
      "A real creator quote goes here. Keep it specific: the campaign, the result, the working relationship.",
    demo: true,
  },
  {
    id: "s4",
    name: "Sample creator",
    sport: "Basketball",
    quote:
      "A real creator quote goes here. One or two sentences read better than a paragraph.",
    demo: true,
  },
];

export const partnershipTypes = [
  {
    title: "Sponsored content",
    body: "Dedicated posts and series where the creator's voice leads and your product earns its place in the story.",
  },
  {
    title: "Creator campaigns",
    body: "A coordinated group of creators across sports and platforms, briefed once and given room to interpret it.",
  },
  {
    title: "Product storytelling",
    body: "Long-form reviews and real-world testing that show what a product is like after a month, not a minute.",
  },
  {
    title: "Video collaborations",
    body: "Short-form and long-form video produced with the creator, from concept through edit.",
  },
  {
    title: "Creator-led activations",
    body: "Events, challenges and community rides, runs and sessions hosted by creators your audience already follows.",
  },
  {
    title: "Long-term partnerships",
    body: "Ongoing ambassador relationships that grow with the creator and the brand over a season or a year.",
  },
] as const;

/** Confirmed brand partners. Leave empty until real partnerships and logo permissions exist. */
export const partners: readonly { name: string; logoSrc: string; width: number; height: number }[] = [];

export type Platform = "youtube-short" | "youtube" | "instagram-reel";

export interface ShowcaseItem {
  id: string;
  title: string;
  creator: string;
  sport: SportSlug;
  platform: Platform;
  /** Public link to the original media. `null` for sample items. */
  url: string | null;
  demo: boolean;
}

export const showcase: readonly ShowcaseItem[] = [
  { id: "c1", title: "Sample: a morning long-run vlog", creator: "Sample creator", sport: "running", platform: "youtube-short", url: null, demo: true },
  { id: "c2", title: "Sample: gravel route breakdown", creator: "Sample creator", sport: "cycling", platform: "youtube", url: null, demo: true },
  { id: "c3", title: "Sample: three drills for a better handle", creator: "Sample creator", sport: "basketball", platform: "instagram-reel", url: null, demo: true },
  { id: "c4", title: "Sample: dawn patrol surf session", creator: "Sample creator", sport: "surfing", platform: "youtube-short", url: null, demo: true },
  { id: "c5", title: "Sample: match analysis, first innings", creator: "Sample creator", sport: "cricket", platform: "youtube", url: null, demo: true },
  { id: "c6", title: "Sample: weekend trail gear test", creator: "Sample creator", sport: "outdoor", platform: "instagram-reel", url: null, demo: true },
];

export const platformLabel: Record<Platform, string> = {
  "youtube-short": "YouTube Short",
  youtube: "YouTube",
  "instagram-reel": "Instagram Reel",
};

export const creatorBenefits = [
  {
    title: "Brand introductions that fit",
    body: "We match on sport, audience and values, so the offers you see are ones you would actually take.",
  },
  {
    title: "A clear brief, every time",
    body: "Goals, deliverables, timelines and usage terms are written down before anything is filmed.",
  },
  {
    title: "Creative control",
    body: "Brands bring the objective. You bring the voice. We protect the difference between the two.",
  },
  {
    title: "A community of peers",
    body: "Other creators in your sport and beyond, for collaboration, feedback and honest advice.",
  },
] as const;

export const creatorCriteria = [
  "An original voice and point of view",
  "Consistent publishing over a period of months",
  "Content about sport you actually practise or know deeply",
  "Respect for your audience and honest disclosure of sponsored work",
] as const;

export const brandProcess = [
  { n: "01", title: "Share a brief", body: "Tell us the goal, the audience, the sport, the timeline and the budget range if you have one." },
  { n: "02", title: "Review a shortlist", body: "We propose creators whose content and audience fit, with the reasoning for each." },
  { n: "03", title: "Agree the plan", body: "Deliverables, dates, usage terms and approvals are confirmed in writing." },
  { n: "04", title: "Create and report", body: "Creators produce the work, you approve it, and we report what happened." },
] as const;

export const creatorFaq = [
  {
    q: "Do I need a minimum number of followers?",
    a: "There is no fixed minimum. We look at the quality of your content, how consistently you publish and how engaged your audience is.",
  },
  {
    q: "Which platforms do you work with?",
    a: "Primarily YouTube and Instagram. If your best work lives elsewhere, include a link and tell us about it.",
  },
  {
    q: "How long until I hear back?",
    a: "Replace this answer with your real review time before launch.",
  },
  {
    q: "Will I be paid?",
    a: "Replace this answer with your real payment policy before launch: which collaborations are paid, which are product-only, and how and when creators are paid.",
  },
] as const;

export const brandFaq = [
  {
    q: "What budget do we need?",
    a: "Replace this answer with your real minimums and typical ranges before launch.",
  },
  {
    q: "Who owns the content?",
    a: "Replace this answer with your real usage and licensing terms before launch.",
  },
  {
    q: "How are creators chosen for a campaign?",
    a: "We match on sport, audience, content quality and brand fit, and share our reasoning with you before anything is agreed.",
  },
] as const;

export const resources = {
  creator: {
    title: "Creator media-kit checklist",
    items: [
      "A two-sentence description of who you are and what you cover",
      "Your sport, location and the languages you publish in",
      "Audience size and where it is strongest (platform, country, age range)",
      "Three to five pieces of your best work, with links",
      "Average views and engagement over the last three months",
      "Past collaborations, if any, and what the result was",
      "Your preferred contact email and working turnaround time",
      "Which kinds of products and brands you will not promote",
    ],
  },
  brand: {
    title: "Brand brief template",
    items: [
      "The goal: awareness, trial, sales or community",
      "The audience you want to reach, and where",
      "The product or message, in plain language",
      "Deliverables you have in mind and the platforms they will run on",
      "Dates: when to brief, draft, approve and publish",
      "Budget range and what it needs to cover",
      "Usage: where else you want to use the content, and for how long",
      "What good looks like, and how you will measure it",
    ],
  },
  guidelines: {
    title: "Content guidelines",
    items: [
      "Disclose sponsored work clearly and early, using the platform's own tools.",
      "Say what you actually think. Audiences notice when a review is hollow.",
      "Credit others' footage, music and ideas.",
      "Treat athletes, bystanders and places with respect.",
      "Never make health or performance claims you cannot support.",
    ],
  },
} as const;
