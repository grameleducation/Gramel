// One-off script: publishes the "Canada Study Permit Approval Rates" article
// (rewritten from ApplyBoard's Q1 2026 ApplyInsights data) to Sanity.
// Run with: node --env-file=.env.local scripts/add-article-canada-study-permit-q1-2026.js
const { createClient } = require("@sanity/client");
const crypto = require("crypto");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

const IMAGE_URL =
  "https://images.unsplash.com/photo-1578973615934-8d9cdb0792b4?fm=jpg&q=80&w=2400&auto=format&fit=crop";
const IMAGE_CREDIT = "Photo by Jason Hafso on Unsplash";

function key() {
  return crypto.randomBytes(6).toString("hex");
}

function block(text, style = "normal") {
  return {
    _type: "block",
    _key: key(),
    style,
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }],
  };
}

function bullet(text) {
  return {
    _type: "block",
    _key: key(),
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }],
  };
}

const body = [
  block(
    "Canada's study permit approval rate has climbed sharply in early 2026, according to new data published by ApplyBoard's ApplyInsights team. For Nigerian students weighing Canada against other study destinations, the numbers tell a clear story: the odds of approval are better than they've been in years — but far fewer people are applying in the first place.",
  ),
  block("What changed", "h2"),
  block(
    "Between January and April 2026, Immigration, Refugees and Citizenship Canada (IRCC) approved 36% of new study permit applications, up from just 26% over the same stretch in 2025 — a 10 percentage point jump. April 2026 alone saw an even stronger 42% approval rate, compared with 29% in April 2025.",
  ),
  block(
    "That improvement isn't because Canada suddenly loosened its rules. ApplyBoard's analysis points to the opposite dynamic: the applicant pool itself has shrunk by roughly 40% year-over-year, down to about 38,000 new applications in the same four-month window. With fewer people applying, IRCC is approving a larger share of a smaller pool — around 14,000 approvals, itself down 22% from 2025. In short, Canada is being more selective in absolute terms, but each individual applicant now faces better odds than they did a year ago.",
  ),
  block("Approval rates by study level", "h2"),
  block(
    "The gains weren't evenly spread across program types. Every level saw improvement, but graduate and undergraduate university programs benefited the most:",
  ),
  bullet("University postgraduate programs: 49% approved (up from 39%)"),
  bullet("University undergraduate programs: 44% approved (up from 32%)"),
  bullet("College-level programs: 30% approved (up from 24%)"),
  bullet("Vocational programs: 13% approved (up from just 8%)"),
  block(
    "University postgraduate and undergraduate applicants also made up a bigger slice of total approvals than a year ago — 30% and 25% respectively — while college programs, still the largest single category at 43% of approvals, gave up some ground. Vocational programs remain a small niche at just 2% of approvals.",
  ),
  block(
    "One more detail worth flagging for anyone already studying in Canada: extensions accounted for 77% of all approvals in this period, essentially matching 2025's 79% share, and extension requests are being approved at a rate above 90%. If you're already on a valid study permit, renewing it remains comfortably the safest and most predictable step in the process.",
  ),
  block("What this means if you're applying from Nigeria", "h2"),
  block(
    "A rising approval rate is genuinely good news, but it doesn't mean the process has gotten easier to prepare for — if anything, a smaller, more competitive applicant pool raises the bar on the quality of every application that does go in. IRCC is still scrutinising proof of funds, the genuineness of a study plan, and choice of institution and program just as closely as before. The applicants pulling ahead are the ones sending in complete, well-documented, credible files — not the ones simply hoping volume works in their favour.",
  ),
  block(
    "That's exactly where working with an experienced study abroad agency pays off. At Gramel Education, we help Nigerian students build applications that hold up to that scrutiny — matching you to university and college programs where you have a genuine, defensible case for approval, getting your financial and academic documentation into the shape IRCC expects, and guiding you through the study permit process from application to visa decision.",
  ),
  block(
    "If Canada is on your shortlist for 2026, now is a good time to start: talk to our advisory team about your options and let us help you put together an application built to be part of that 36%, not the 64%.",
  ),
  block(
    `Source: ApplyBoard ApplyInsights, "Canada Study Permit Approval Rates: Q1 2026," published July 30, 2026.`,
  ),
];

async function main() {
  console.log("Ensuring category exists...");
  const categorySlug = "visa-immigration-updates";
  let category = await client.fetch(
    `*[_type == "category" && slug.current == $slug][0]{_id}`,
    { slug: categorySlug },
  );
  if (!category) {
    category = await client.create({
      _type: "category",
      title: "Visa & Immigration Updates",
      slug: { _type: "slug", current: categorySlug },
      description:
        "Study permit, visa, and immigration policy news relevant to international students.",
    });
    console.log("Created category:", category._id);
  } else {
    console.log("Using existing category:", category._id);
  }

  console.log("Downloading cover image...");
  const imageRes = await fetch(IMAGE_URL);
  if (!imageRes.ok) throw new Error(`Image download failed: ${imageRes.status}`);
  const imageBuffer = Buffer.from(await imageRes.arrayBuffer());

  console.log("Uploading cover image asset to Sanity...");
  const imageAsset = await client.assets.upload("image", imageBuffer, {
    filename: "canada-study-permit-q1-2026-cover.jpg",
    description: IMAGE_CREDIT,
  });
  console.log("Uploaded asset:", imageAsset._id);

  const slug = "canada-study-permit-approval-rates-q1-2026";
  const existing = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{_id}`,
    { slug },
  );
  if (existing) {
    console.log("Post already exists, aborting:", existing._id);
    return;
  }

  console.log("Creating post...");
  const post = await client.create({
    _type: "post",
    title:
      "Canada Study Permit Approval Rates Jump to 36% in Early 2026 — What It Means for Nigerian Applicants",
    slug: { _type: "slug", current: slug },
    category: { _type: "reference", _ref: category._id },
    excerpt:
      "Canada's study permit approval rate rose to 36% in early 2026, up from 26% a year earlier. Here's what's driving it and what Nigerian applicants should do about it.",
    coverImage: {
      _type: "image",
      asset: { _type: "reference", _ref: imageAsset._id },
      alt: "The Canadian flag flying in front of the Parliament Building in Ottawa",
    },
    body,
    publishedAt: new Date().toISOString(),
  });

  console.log("Published post:", post._id, "->", `/assist/${slug}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
