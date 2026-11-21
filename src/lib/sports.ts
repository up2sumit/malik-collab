export const sportSlugs = [
  "running",
  "cycling",
  "fitness",
  "basketball",
  "surfing",
  "outdoor",
  "cricket",
  "football",
] as const;

export type SportSlug = (typeof sportSlugs)[number];

export interface Sport {
  slug: SportSlug;
  name: string;
  /** One line shown on category tiles. */
  short: string;
  /** Paragraph shown on the category page. */
  about: string;
  /** What we look for in creators in this category. */
  lookingFor: readonly string[];
  /** Campaign ideas that suit brands in this category. */
  campaignIdeas: readonly string[];
}

export const sports: readonly Sport[] = [
  {
    slug: "running",
    name: "Running",
    short: "Road, trail and track",
    about:
      "From first 5Ks to ultra-distance trail races, running creators build loyal audiences through training logs, race recaps and honest gear testing.",
    lookingFor: [
      "Training and race storytelling with a clear point of view",
      "Honest, hands-on gear and nutrition reviews",
      "Beginner-friendly coaching and routine content",
    ],
    campaignIdeas: [
      "Season-long training partnerships",
      "Race-weekend coverage and recaps",
      "Footwear and apparel long-term testing",
    ],
  },
  {
    slug: "cycling",
    name: "Cycling",
    short: "Road, gravel and mountain",
    about:
      "Cycling creators cover everything from commuting to bikepacking, and their audiences care about detail: components, routes, fit and real-world durability.",
    lookingFor: [
      "Route and ride storytelling with strong visuals",
      "Technical reviews that explain the why",
      "Commuter and beginner guides",
    ],
    campaignIdeas: [
      "Multi-day ride and bikepacking features",
      "Component and accessory long-term reviews",
      "Local event and community ride partnerships",
    ],
  },
  {
    slug: "fitness",
    name: "Fitness",
    short: "Strength, mobility, conditioning",
    about:
      "Fitness creators turn routines into a reason to show up. Their content works best when it is practical, specific and honest about the effort involved.",
    lookingFor: [
      "Programme-based content people can follow",
      "Technique breakdowns and mobility work",
      "Realistic, sustainable approaches to training",
    ],
    campaignIdeas: [
      "Challenge series with a clear start and finish",
      "Equipment and recovery product trials",
      "Studio and gym activations",
    ],
  },
  {
    slug: "basketball",
    name: "Basketball",
    short: "Court skills and game culture",
    about:
      "Basketball creators blend skill work, game analysis and street-level culture. The strongest accounts make complex play easy to follow.",
    lookingFor: [
      "Skill development and drill content",
      "Game film and tactical analysis",
      "Community and street-ball storytelling",
    ],
    campaignIdeas: [
      "Footwear and apparel collaborations",
      "Tournament and community-court activations",
      "Training-camp and clinic partnerships",
    ],
  },
  {
    slug: "surfing",
    name: "Surfing",
    short: "Waves, travel and ocean life",
    about:
      "Surf creators bring audiences to the water through travel, technique and a deep respect for the ocean. Visual quality matters here more than almost anywhere.",
    lookingFor: [
      "Cinematic surf and travel footage",
      "Technique and progression content",
      "Ocean conservation and surf-culture storytelling",
    ],
    campaignIdeas: [
      "Surf-trip documentary features",
      "Wetsuit and equipment testing",
      "Coastal clean-up and community events",
    ],
  },
  {
    slug: "outdoor",
    name: "Outdoor",
    short: "Hiking, climbing and camping",
    about:
      "Outdoor creators help people get outside with confidence. Trip planning, gear honesty and leave-no-trace values are what audiences trust.",
    lookingFor: [
      "Trip reports with usable detail",
      "Gear tested in real conditions",
      "Beginner access and safety guidance",
    ],
    campaignIdeas: [
      "Expedition and trek partnerships",
      "Seasonal gear tests",
      "Trail stewardship campaigns",
    ],
  },
  {
    slug: "cricket",
    name: "Cricket",
    short: "Analysis, coaching and culture",
    about:
      "Cricket creators range from match analysts to coaches and storytellers. Audiences value insight, consistency and a distinct voice.",
    lookingFor: [
      "Match analysis and tactical explainers",
      "Coaching and technique content",
      "Domestic and grassroots cricket storytelling",
    ],
    campaignIdeas: [
      "Tournament-season analysis series",
      "Equipment and apparel features",
      "Academy and grassroots programme partnerships",
    ],
  },
  {
    slug: "football",
    name: "Football",
    short: "Tactics, skills and fan culture",
    about:
      "Football creators combine tactical analysis, skill tutorials and matchday culture. Strong creators earn trust through knowledge and personality.",
    lookingFor: [
      "Tactical breakdowns and match reactions",
      "Skills and training tutorials",
      "Fan culture and matchday storytelling",
    ],
    campaignIdeas: [
      "Matchday and tournament coverage",
      "Boot, kit and training-gear features",
      "Academy and community programme partnerships",
    ],
  },
] as const;

export function getSport(slug: string): Sport | undefined {
  return sports.find((s) => s.slug === slug);
}
