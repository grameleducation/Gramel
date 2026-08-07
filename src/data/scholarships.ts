export interface Scholarship {
  id: string;
  name: string;
  amount: string;
  description: string;
  countries: string[];
  eligibility: string;
  deadline: string;
}

// Curated list of well-known, currently-active scholarship programs. Deadline
// windows are typical annual cycles, not exact dates -- confirm the current
// cycle's exact date with a Gramel advisor before applying. Replace this
// with a live feed once the ScholarshipAPI.com integration is wired in.
export const scholarshipsData: Scholarship[] = [
  {
    id: "chevening",
    name: "Chevening Scholarship",
    amount: "Full Funding",
    description:
      "UK Government scholarships for future leaders, covering tuition, a monthly stipend, and flights.",
    countries: ["United Kingdom"],
    eligibility: "2+ years of work experience, leadership potential",
    deadline: "Opens Aug, closes Nov (annual)",
  },
  {
    id: "commonwealth",
    name: "Commonwealth Shared Scholarship",
    amount: "Full Tuition + Stipend",
    description:
      "Fully funded scholarships for students from Commonwealth developing countries, including Nigeria.",
    countries: ["United Kingdom"],
    eligibility: "First-class or strong second-class degree",
    deadline: "Opens Oct, closes Dec (annual)",
  },
  {
    id: "fulbright",
    name: "Fulbright Foreign Student Program",
    amount: "Full Coverage",
    description:
      "US Government-funded scholarships for international graduate students across all fields of study.",
    countries: ["United States"],
    eligibility: "Bachelor's degree, strong academic record",
    deadline: "Typically closes Feb-May, varies by country",
  },
  {
    id: "mastercard-foundation",
    name: "Mastercard Foundation Scholars Program",
    amount: "Full Funding + Mentorship",
    description:
      "Covers tuition, accommodation, and mentorship for academically talented African students at partner universities.",
    countries: ["Canada", "United States"],
    eligibility: "Academically talented, financially disadvantaged African students",
    deadline: "Varies by partner university",
  },
  {
    id: "australia-awards",
    name: "Australia Awards Scholarship",
    amount: "Full Tuition + Living Allowance",
    description:
      "Australian Government scholarships for citizens of eligible developing countries, including Nigeria.",
    countries: ["Australia"],
    eligibility: "Citizens of eligible developing countries",
    deadline: "Opens Feb, closes Apr (annual)",
  },
  {
    id: "daad",
    name: "DAAD Scholarship",
    amount: "Full or Partial Funding",
    description:
      "German Academic Exchange Service scholarships for postgraduate study and research across all disciplines.",
    countries: ["Germany"],
    eligibility: "Postgraduate students, strong academic record",
    deadline: "Varies by programme, typically Oct-Dec",
  },
  {
    id: "gates-cambridge",
    name: "Gates Cambridge Scholarship",
    amount: "Full Cost of Study",
    description:
      "Fully funded postgraduate scholarships to study at the University of Cambridge.",
    countries: ["United Kingdom"],
    eligibility: "Outstanding academic achievement and leadership potential",
    deadline: "Opens Sep, closes Dec (annual)",
  },
  {
    id: "rhodes",
    name: "Rhodes Scholarship",
    amount: "Full Funding",
    description:
      "One of the oldest international scholarships, fully funding postgraduate study at the University of Oxford.",
    countries: ["United Kingdom"],
    eligibility: "Exceptional intellect, character, and commitment to service",
    deadline: "Varies by country/region",
  },
  {
    id: "vanier",
    name: "Vanier Canada Graduate Scholarship",
    amount: "CAD $50,000/year",
    description:
      "Canada's top doctoral scholarship, awarded for academic excellence, research potential, and leadership.",
    countries: ["Canada"],
    eligibility: "Doctoral students with strong academic record and leadership",
    deadline: "Opens Sep, closes Nov (annual)",
  },
  {
    id: "manaaki-nz",
    name: "Manaaki New Zealand Scholarships",
    amount: "Full Funding",
    description:
      "New Zealand Government scholarships for citizens of eligible developing countries, including Nigeria.",
    countries: ["New Zealand"],
    eligibility: "Citizens of eligible developing countries",
    deadline: "Varies annually",
  },
  {
    id: "goi-ireland",
    name: "Government of Ireland International Scholarships",
    amount: "Tuition Waiver + Stipend",
    description:
      "Covers tuition fees and provides a living stipend for non-EU/EEA students studying in Ireland.",
    countries: ["Ireland"],
    eligibility: "Non-EU/EEA students with strong academic record",
    deadline: "Opens Jan, closes Mar (annual)",
  },
  {
    id: "erasmus-mundus",
    name: "Erasmus Mundus Joint Master Degrees",
    amount: "Full Tuition + Monthly Stipend",
    description:
      "EU-funded scholarships to study a joint master's programme across multiple European universities.",
    countries: ["Germany"],
    eligibility: "Competitive international applicants, all fields",
    deadline: "Typically closes Jan (annual)",
  },
  {
    id: "rotary-peace",
    name: "Rotary Peace Fellowship",
    amount: "Full Funding",
    description:
      "Fully funded master's or certificate programs in peace and conflict resolution at Rotary Peace Centers.",
    countries: ["United States", "United Kingdom", "Australia"],
    eligibility: "Professionals with a commitment to peace and conflict resolution",
    deadline: "Opens May (annual)",
  },
];
