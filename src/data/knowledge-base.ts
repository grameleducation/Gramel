export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface KnowledgeBaseCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  faqs: FAQItem[];
}

export const knowledgeBase: KnowledgeBaseCategory[] = [
  {
    id: "visa-immigration",
    title: "Visa & Immigration",
    description: "Everything about study visas and immigration requirements",
    icon: "🛂",
    color: "from-blue-500 to-blue-600",
    faqs: [
      {
        id: "visa-1",
        question: "What documents do I need for a student visa application?",
        answer:
          "Common requirements include: passport, admission letter, proof of financial support, medical examination, English language proficiency test (IELTS/TOEFL), and completed visa application form. Specific requirements vary by country—check with the embassy of your destination.",
        category: "visa-immigration",
      },
      {
        id: "visa-2",
        question: "How long does a student visa take to process?",
        answer:
          "Processing times vary significantly by country. Canada typically takes 4-8 weeks, the UK 3-6 weeks, Australia 1-3 months, Germany 2-6 weeks, and the US can take several months. Start your application at least 3-4 months before your program begins.",
        category: "visa-immigration",
      },
      {
        id: "visa-3",
        question: "Can I work while on a student visa?",
        answer:
          "Yes, most countries allow student visa holders to work part-time. Canada allows up to 20 hours/week during studies; UK allows 20 hours/week term-time; Australia allows up to 40 hours/fortnight; Germany has no specific limit for higher education students. Always check your specific visa conditions.",
        category: "visa-immigration",
      },
      {
        id: "visa-4",
        question: "What is a student visa vs. a tourist visa?",
        answer:
          "A student visa is specifically for full-time educational pursuits and often includes work permissions. Tourist visas don't allow study or work. Using a tourist visa for studies is illegal and can result in deportation and future visa rejections.",
        category: "visa-immigration",
      },
      {
        id: "visa-5",
        question: "How do I extend my student visa?",
        answer:
          "Extensions are typically applied for before your current visa expires. You'll need documentation showing continued enrollment and financial support. Contact your institution's international student office—they often handle extensions for you.",
        category: "visa-immigration",
      },
    ],
  },
  {
    id: "scholarships-funding",
    title: "Scholarships & Funding",
    description: "Funding options, scholarships, and financial aid",
    icon: "💰",
    color: "from-green-500 to-green-600",
    faqs: [
      {
        id: "fund-1",
        question: "What types of scholarships are available for international students?",
        answer:
          "Common types include: merit-based (academic excellence), need-based (financial necessity), country-specific scholarships, subject-specific awards, and university scholarships. Many governments and organizations also offer bilateral scholarships for students from partner countries.",
        category: "scholarships-funding",
      },
      {
        id: "fund-2",
        question: "How do I prove financial support for my visa application?",
        answer:
          "You'll typically need bank statements (usually 6-12 months), sponsor's financial documents, proof of employment, and financial affidavits. Some countries have minimum thresholds. Ensure funds are in your account well before applying—recent deposits may be questioned.",
        category: "scholarships-funding",
      },
      {
        id: "fund-3",
        question: "What is the average cost of studying abroad?",
        answer:
          "Annual costs vary: UK £15,000-35,000+, Canada CAD 20,000-35,000+, Australia AUD 25,000-45,000+, USA $25,000-60,000+. Germany has lower tuition (€0-3,000 in most states) but higher living costs. Budget for tuition, accommodation, food, transport, and personal expenses.",
        category: "scholarships-funding",
      },
      {
        id: "fund-4",
        question: "Can I work to support my studies financially?",
        answer:
          "Many countries allow part-time work during studies (typically 20 hours/week). However, don't rely solely on part-time income—it usually covers basics only. Plan for significant savings before departure and explore scholarships and financial aid.",
        category: "scholarships-funding",
      },
      {
        id: "fund-5",
        question: "What are student loans for international education?",
        answer:
          "Some institutions and governments offer loans to international students. Research educational loans from your home country, international loan providers, and your destination country. Compare interest rates and repayment terms carefully before committing.",
        category: "scholarships-funding",
      },
    ],
  },
  {
    id: "accommodation",
    title: "Accommodation & Living",
    description: "Finding housing and adapting to living abroad",
    icon: "🏠",
    color: "from-purple-500 to-purple-600",
    faqs: [
      {
        id: "acc-1",
        question: "Should I book accommodation before arriving?",
        answer:
          "We recommend booking for at least the first few weeks to avoid stress upon arrival. University halls, homestays, or temporary accommodation allow time to explore neighborhoods and find permanent housing. Many students book permanent housing after arriving.",
        category: "accommodation",
      },
      {
        id: "acc-2",
        question: "What types of accommodation are available?",
        answer:
          "Options include: university halls of residence (most affordable, social atmosphere), private student housing (independent but pricey), shared apartments/houses (cost-effective), homestays (cultural immersion, meals provided), and private rentals. Each has pros and cons regarding cost, independence, and social life.",
        category: "accommodation",
      },
      {
        id: "acc-3",
        question: "What are typical monthly living costs?",
        answer:
          "Australia/Canada/UK: $1,200-2,500/month; USA: $1,500-3,000+/month; Germany/Netherlands: $900-1,800/month; France: $1,000-2,000/month. This includes rent, food, transport, and entertainment. Major cities are significantly more expensive than smaller towns.",
        category: "accommodation",
      },
      {
        id: "acc-4",
        question: "How do I find reliable accommodation online?",
        answer:
          "Use verified platforms like university housing portals, Idealista, Rightmove, Airbnb (long-term), Facebook groups for expats, and local real estate websites. Always video tour before paying deposits. Be wary of scams—never wire money without verification.",
        category: "accommodation",
      },
      {
        id: "acc-5",
        question: "What should I know about rental agreements?",
        answer:
          "Read all terms carefully—understand lease length, deposit terms, included utilities, notice periods, and maintenance responsibilities. Know tenant rights in your country. Some countries require guarantors; international students may need guarantees or deposits. Always get written agreements.",
        category: "accommodation",
      },
    ],
  },
  {
    id: "application-process",
    title: "Application Process",
    description: "Steps to apply to universities abroad",
    icon: "📝",
    color: "from-orange-500 to-orange-600",
    faqs: [
      {
        id: "app-1",
        question: "When should I start my application?",
        answer:
          "Most applications open 9-12 months before program start. Apply early (deadlines 3-6 months before intake) for better course selection and application processing time. Some programs fill quickly, especially popular ones. Check specific institution timelines.",
        category: "application-process",
      },
      {
        id: "app-2",
        question: "What documents do universities require?",
        answer:
          "Typical requirements: transcripts/academic records, English proficiency test (IELTS/TOEFL/PTE), letters of recommendation, statement of purpose/personal essay, resume/CV, and sometimes portfolios or entrance exams. Requirements vary by program and institution.",
        category: "application-process",
      },
      {
        id: "app-3",
        question: "What English proficiency score do I need?",
        answer:
          "IELTS: typically 6.0-7.5 depending on program; TOEFL: 80-100+; PTE: 58-75+; Duolingo: 100-130+. Engineering/sciences often accept lower scores than social sciences or business programs. Some universities waive requirements for native speakers or previous English-medium education.",
        category: "application-process",
      },
      {
        id: "app-4",
        question: "How important are grades for admission?",
        answer:
          "Very important. Most universities require a minimum GPA (usually 3.0-3.5/4.0 equivalent). Postgraduate programs may require higher GPA. However, other factors matter: test scores, essays, recommendations, work experience, and demonstrated commitment to the field can compensate for slightly lower grades.",
        category: "application-process",
      },
      {
        id: "app-5",
        question: "What is an admission letter and when do I receive it?",
        answer:
          "An admission letter confirms your acceptance. Timeline: universities typically issue decisions 1-3 months after deadlines. Conditional offers may require final grades or English proficiency test results. Unconditional offers can be used for visa applications immediately.",
        category: "application-process",
      },
    ],
  },
  {
    id: "career-employment",
    title: "Career & Employment",
    description: "Post-study work, career planning, and job hunting",
    icon: "💼",
    color: "from-red-500 to-red-600",
    faqs: [
      {
        id: "career-1",
        question: "What post-study work options are available?",
        answer:
          "Options vary by country: Canada allows up to 3 years of post-study work; UK offers up to 2 years (3 for master's graduates); Australia offers 18-24 months; USA offers OPT (12-24 months); many European countries offer 12+ months. Research your destination's specific policies.",
        category: "career-employment",
      },
      {
        id: "career-2",
        question: "Can I transition from a student visa to a work visa?",
        answer:
          "Yes, most countries allow this transition. You typically need: a job offer, sponsorship from your employer, qualification for work visa requirements, and timely application before student visa expiration. Timing is crucial—apply before your student status expires.",
        category: "career-employment",
      },
      {
        id: "career-3",
        question: "How do I find internships during my studies?",
        answer:
          "Use university career services, LinkedIn, Indeed, GlassDoor, and industry-specific job boards. Start 2-3 months before you need the internship. Ask professors and alumni for referrals. Many universities require or recommend internships—start early and build your network.",
        category: "career-employment",
      },
      {
        id: "career-4",
        question: "How do employers view international qualifications?",
        answer:
          "International qualifications are valued in many fields, especially tech and engineering. However, recognition varies by country and employer. Some professions require credential evaluation. Networking and demonstrated practical skills often matter more than where you studied.",
        category: "career-employment",
      },
      {
        id: "career-5",
        question: "What's the realistic job market for international graduates?",
        answer:
          "Competition is significant. Start job hunting 3-4 months before graduation. Leverage university alumni networks, attend career fairs, build LinkedIn presence, and consider entry-level positions. Learning the local language significantly improves job prospects in non-English-speaking countries.",
        category: "career-employment",
      },
    ],
  },
  {
    id: "health-insurance",
    title: "Health & Insurance",
    description: "Medical coverage and health considerations abroad",
    icon: "🏥",
    color: "from-pink-500 to-pink-600",
    faqs: [
      {
        id: "health-1",
        question: "Do I need health insurance as an international student?",
        answer:
          "Yes, most countries require or strongly recommend it. Some universities provide coverage; others require proof of external coverage. Cost varies: often $500-1,500/year. Public health systems may have restrictions for international students. Always verify requirements with your institution.",
        category: "health-insurance",
      },
      {
        id: "health-2",
        question: "What medical services are covered by student health insurance?",
        answer:
          "Typical coverage includes doctor visits, emergency care, hospitalization, and prescription medications. Coverage varies widely. Mental health services increasingly included. Pre-existing conditions may have limitations. Read policy details carefully before enrolling.",
        category: "health-insurance",
      },
      {
        id: "health-3",
        question: "Should I get vaccinated before moving abroad?",
        answer:
          "Yes. Check requirements for your destination (some are mandatory for entry). Recommended vaccinations depend on the region. Visit a travel clinic 6-8 weeks before departure. Get written vaccination records—many countries require proof of vaccinations.",
        category: "health-insurance",
      },
      {
        id: "health-4",
        question: "How do I access healthcare in my host country?",
        answer:
          "Register with local healthcare systems/doctors early. Universities have health centers (sometimes free for students). Private clinics are costlier but faster. Public systems may require registration. Keep copies of medical records and prescriptions. Know how to describe symptoms in local language.",
        category: "health-insurance",
      },
      {
        id: "health-5",
        question: "What if I need emergency care?",
        answer:
          "Call emergency services (know the number: 999 UK, 911 USA, 000 Australia, etc.). Most countries treat emergency cases regardless of insurance. Register with your embassy for assistance. Keep emergency contacts and insurance details accessible. Travel insurance with emergency evacuation coverage recommended.",
        category: "health-insurance",
      },
    ],
  },
];
