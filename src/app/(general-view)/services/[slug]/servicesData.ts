import { ServiceDetail } from "./types";

// NOTE: All prices are placeholders. Actual prices will be fetched from the database
export const servicesDetails: Record<string, ServiceDetail> = {
  "international-admissions": {
    title: "International Admissions",
    price: 0, // price is determined by selected application option
    summary:
      "We help you apply to top universities, colleges, and schools. From program selection to document review, we streamline the process through our partnership with ApplyBoard, giving you access to over 1,500 global institutions.",
    details: [
      "Our International Admissions service is designed to simplify your journey to studying abroad. We provide personalized counseling to help you choose the right program and institution based on your academic background, career goals, and budget.",
      "Our team assists with every step of the application process, including document preparation, application submission, and follow-up with institutions. We also offer guidance on writing compelling personal statements and preparing for interviews.",
      "Through our partnership with ApplyBoard, you gain access to a vast network of universities and colleges worldwide, increasing your chances of admission and scholarship opportunities.",
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
      "https://res.cloudinary.com/dqeqlgygu/image/upload/v1754940941/gramel/public/services-page/services-page-banner_n2bauf.jpg",
  },
  "document-verification": {
    title: "Document Verification",
    price: 1,
    summary:
      "Writing a strong Statement of Purpose, preparing recommendation letters, and assembling the right documents are key to getting accepted. We provide templates, reviews, and coaching to ensure your application stands out.",
    details: [
      "Our Document Verification service ensures that all your application materials meet the highest standards. We review your transcripts, certificates, recommendation letters, and other required documents for accuracy and completeness.",
      "We provide templates and personalized feedback to help you craft a compelling Statement of Purpose and other essays. Our experts also coach you on how to present your achievements and experiences effectively.",
      "With our support, you can submit your applications with confidence, knowing that your documents are error-free and professionally presented.",
    ],
    serviceCode: "DOCV",
    image:
      "https://res.cloudinary.com/dqeqlgygu/image/upload/v1754940941/gramel/public/services-page/services-page-banner_n2bauf.jpg",
  },
  scholarships: {
    title: "Scholarships",
    price: 1,
    summary:
      "Looking for ways to reduce your tuition? Our team helps you search and apply for merit-based and need-based scholarships that match your academic and personal profile.",
    details: [
      "We understand that financing your education abroad can be challenging. Our Scholarships service is dedicated to helping you find and apply for scholarships that fit your profile.",
      "We maintain an up-to-date database of scholarship opportunities from institutions, governments, and private organizations. Our team assists you in preparing strong applications, including essays and supporting documents.",
      "We also provide tips on how to maximize your chances of winning scholarships and securing additional funding for your studies.",
    ],
    serviceCode: "SCHL",
    image:
      "https://res.cloudinary.com/dqeqlgygu/image/upload/v1754940941/gramel/public/services-page/services-page-banner_n2bauf.jpg",
  },
  "visa-assistance": {
    title: "Visa Assistance",
    price: 1,
    summary:
      "Visa requirements can be complex, but our experts simplify the process. We help you prepare the right documents, fill out visa forms correctly, and even conduct mock interviews to boost your chances of approval.",
    details: [
      "Navigating visa requirements can be overwhelming. Our Visa Assistance service guides you through the entire process, from understanding the requirements to submitting your application.",
      "We help you gather and organize all necessary documents, complete visa forms accurately, and prepare for embassy interviews. Our team conducts mock interviews to help you feel confident and prepared.",
      "We stay updated on the latest visa regulations and provide timely advice to ensure a smooth and successful application experience.",
    ],
    serviceCode: "VISA",
    image:
      "https://res.cloudinary.com/dqeqlgygu/image/upload/v1754940941/gramel/public/services-page/services-page-banner_n2bauf.jpg",
  },
  "language-proficiency-tests": {
    title: "Language Proficiency Tests",
    price: 0,
    summary:
      "Planning to take a Prometric exam for medical, nursing, or professional certification abroad? We provide full support to help you register, prepare, and succeed.",
    details: [
      "Our Language Proficiency Tests service supports students and professionals preparing for exams such as IELTS, TOEFL, and Prometric tests.",
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
      "https://res.cloudinary.com/dqeqlgygu/image/upload/v1754940941/gramel/public/services-page/services-page-banner_n2bauf.jpg",
  },
  "student-loan": {
    title: "Student Loan",
    price: 1,
    summary:
      "We assist with securing local and international education loans. From explaining repayment terms to submitting documentation, we walk you through every step with trusted financial institutions.",
    details: [
      "Financing your education is easier with our Student Loan service. We connect you with reputable lenders offering competitive rates and flexible repayment options.",
      "Our advisors explain the terms and conditions of various loan products, help you gather the required documents, and assist with the application process.",
      "We also provide ongoing support to help you manage your loan and plan for repayment after graduation.",
    ],
    serviceCode: "LOAN",
    image:
      "https://res.cloudinary.com/dqeqlgygu/image/upload/v1754940941/gramel/public/services-page/services-page-banner_n2bauf.jpg",
  },
  "advisory-services": {
    title: "Advisory Services",
    price: 1,
    summary:
      "Receive personalized guidance on academic program selection, financial planning, and career pathways to ensure you make informed decisions for your future.",
    details: [
      "Our Advisory Services are tailored to your unique needs and aspirations. We offer one-on-one counseling sessions to help you clarify your goals and explore your options.",
      "Our experts provide insights on academic programs, career prospects, and financial planning, empowering you to make informed decisions.",
      "Whether you're just starting your journey or planning your next steps, our advisory team is here to support you every step of the way.",
    ],
    serviceCode: "ADVS",
    image:
      "https://res.cloudinary.com/dqeqlgygu/image/upload/v1754940941/gramel/public/services-page/services-page-banner_n2bauf.jpg",
  },
};
