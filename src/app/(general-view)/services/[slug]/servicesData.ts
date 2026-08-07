import { ServiceDetail } from "./types";

// NOTE: All prices are placeholders. Actual prices will be fetched from the database
export const servicesDetails: Record<string, ServiceDetail> = {
  "international-admissions": {
    // Student in library studying
    title: "Admissions",
    price: 0, // price is determined by selected application option
    summary:
      "Getting into the right school starts with the right application. From program selection to document review, we streamline every step through our network of trusted global partners, giving you access to over 1,500 institutions worldwide.",
    details: [
      "Our Admissions service is designed to simplify your journey to studying abroad. We provide personalized counseling to help you choose the right program and institution based on your academic background, career goals, and budget.",
      "Our team assists with every step of the application process, including document preparation, application submission, and follow-up with institutions. We also offer guidance on writing compelling personal statements and preparing for interviews.",
      "Through our network of trusted global education partners, you gain access to a vast range of universities and colleges worldwide, increasing your chances of admission and scholarship opportunities.",
      `<p>Available application packages:</p>
      <ul class="list-disc pl-6">
        <li><strong>Single Application</strong>: Apply to one school, get one more for free (₦400,000)</li>
        <li><strong>Applications to 2 Schools</strong>: Apply to two schools, get one more free (₦600,000)</li>
      </ul>`,
    ],
    serviceCode: "IADM",
    applicationOptions: [
      { name: "Single Application", price: 1, serviceCode: "IADM1" },
      { name: "Applications to 2 Schools", price: 1, serviceCode: "IADM2" },
    ],
    image:
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1340&h=446&fit=crop",
  },
  "document-verification": {
    title: "Document Verification",
    price: 1,
    summary:
      "A strong application lives or dies by its paperwork. We polish your Statement of Purpose, recommendation letters, and every supporting document until your file is impossible to overlook.",
    details: [
      "Our Document Verification service ensures that all your application materials meet the highest standards. We review your transcripts, certificates, recommendation letters, and other required documents for accuracy and completeness.",
      "We provide templates and personalized feedback to help you craft a compelling Statement of Purpose and other essays. Our experts also coach you on how to present your achievements and experiences effectively.",
      "With our support, you can submit your applications with confidence, knowing that your documents are error-free and professionally presented.",
    ],
    serviceCode: "DOCV",
    image:
      "https://images.unsplash.com/photo-1554224311-beee415c15ac?w=1340&h=446&fit=crop",
  },
  scholarships: {
    title: "Scholarships",
    price: 1,
    summary:
      "Tuition shouldn't be the reason you don't go. Our team hunts down merit-based and need-based scholarships that match your profile, then helps you build an application that wins them.",
    details: [
      "We understand that financing your education abroad can be challenging. Our Scholarships service is dedicated to helping you find and apply for scholarships that fit your profile.",
      "We maintain an up-to-date database of scholarship opportunities from institutions, governments, and private organizations. Our team assists you in preparing strong applications, including essays and supporting documents.",
      "We also provide tips on how to maximize your chances of winning scholarships and securing additional funding for your studies.",
    ],
    serviceCode: "SCHL",
    image:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=1340&h=446&fit=crop",
  },
  "visa-assistance": {
    title: "Visa Assistance",
    price: 1,
    summary:
      "One denied visa can derail an entire admission. Our experts turn a complex, high-stakes process into a clear checklist—right documents, correct forms, and interview practice that builds real confidence.",
    details: [
      "Navigating visa requirements can be overwhelming. Our Visa Assistance service guides you through the entire process, from understanding the requirements to submitting your application.",
      "We help you gather and organize all necessary documents, complete visa forms accurately, and prepare for embassy interviews. Our team conducts mock interviews to help you feel confident and prepared.",
      "We stay updated on the latest visa regulations and provide timely advice to ensure a smooth and successful application experience.",
    ],
    serviceCode: "VISA",
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1340&h=446&fit=crop",
  },
  "language-proficiency-tests": {
    title: "Language Proficiency Tests",
    price: 0,
    summary:
      "IELTS, TOEFL, or another proficiency exam standing between you and your offer letter? We handle registration, prep, and strategy so you walk in ready to hit your target score.",
    details: [
      "Our Language Proficiency Tests service supports students and professionals preparing for exams such as IELTS, TOEFL, and other proficiency and admissions tests.",
      "We offer guidance on exam registration, provide study resources, and connect you with experienced tutors for personalized coaching.",
      `<p>Available tests:</p>
      <ul class="list-disc pl-6">
        <li><strong>International English Language Testing System (IELTS)</strong></li>
        <li><strong>Test of English as a Foreign Language (TOEFL)</strong></li>
        <li><strong>Graduate Record Examinations (GRE)</strong></li>
        <li><strong>Duolingo English Test</strong></li>
        <li><strong>Pearson Test of English Academic (PTE)</strong></li>
      </ul>`,
      "Our team also helps you understand the scoring system and develop strategies to achieve your target scores.",
    ],
    serviceCode: "LANG",
    tests: [
      { name: "IELTS", price: 1, serviceCode: "IELTS" },
      { name: "TOEFL", price: 1, serviceCode: "TOEFL" },
      { name: "GRE", price: 1, serviceCode: "GRE" },
      { name: "Duolingo English Test", price: 1, serviceCode: "DTE" },
      { name: "Pearson - PTE", price: 1, serviceCode: "PTE" },
    ],
    image:
      "https://images.unsplash.com/photo-1599667608036-e98edf8054ff?w=1340&h=446&fit=crop",
  },
  "advisory-services": {
    title: "Advisory Services",
    price: 1,
    summary:
      "Not sure where to even begin? One-on-one advisory sessions give you a clear, personalized roadmap—program selection, funding strategy, and career pathway—so every decision moves you forward.",
    details: [
      "Our Advisory Services are tailored to your unique needs and aspirations. We offer one-on-one counseling sessions to help you clarify your goals and explore your options.",
      "Our experts provide insights on academic programs, career prospects, and financial planning, empowering you to make informed decisions.",
      "Whether you're just starting your journey or planning your next steps, our advisory team is here to support you every step of the way.",
    ],
    serviceCode: "ADVS",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1340&h=446&fit=crop",
  },
};
