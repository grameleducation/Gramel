import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import gramel_icon from "../../../../public/gramel-icon.png";
import { client } from "@/lib/sanity/client";
import { isSanityConfigured } from "@/lib/sanity/env";
import { categoriesQuery, postsQuery } from "@/lib/sanity/queries";
import { urlForImage } from "@/lib/sanity/image";
import { knowledgeBase } from "@/data/knowledge-base";

export const metadata: Metadata = {
  title: "Assist – Study Abroad Help & Guides",
  description:
    "Comprehensive guides on visas, scholarships, housing, and the international education process from Gramel Education, a leading study abroad agency in Abuja, Nigeria.",
};

export const revalidate = 60;

interface Category {
  _id: string;
  title: string;
  slug: string;
}

interface PostSummary {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: unknown;
  publishedAt: string;
  category: { title: string; slug: string } | null;
}

export default async function AssistPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category = "" } = await searchParams;

  if (!isSanityConfigured) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-white to-[#f5f5f5]">
        <nav className="border-b border-[#e0e0e0] bg-white">
          <div className="mx-auto max-w-screen-2xl px-6 py-4 md:px-12 xl:px-20">
            <Link href="/" className="flex items-center gap-2">
              <Image src={gramel_icon} alt="Gramel" className="h-7 w-auto" />
              <span className="text-sm font-semibold text-primary">Assist</span>
            </Link>
          </div>
        </nav>

        <section className="mx-auto max-w-screen-2xl px-6 py-24 text-center md:px-12 xl:px-20">
          <h1 className="text-4xl font-bold text-primary md:text-5xl">
            Guides for Your Study Abroad Journey
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-300">
            Comprehensive answers on visas, scholarships, housing, and the
            international education process.
          </p>
          <p className="mx-auto mt-8 text-neutral-300">
            Check back soon for guides and resources from the Gramel Education
            team.
          </p>
        </section>
      </main>
    );
  }

  const [categories, posts] = await Promise.all([
    client.fetch<Category[]>(categoriesQuery),
    client.fetch<PostSummary[]>(postsQuery, { category }),
  ]);

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-[#e0e0e0] bg-white sticky top-0 z-40">
        <div className="mx-auto max-w-screen-2xl px-6 py-4 md:px-12 xl:px-20">
          <Link href="/" className="flex items-center gap-2">
            <Image src={gramel_icon} alt="Gramel" className="h-7 w-auto" />
            <span className="text-sm font-semibold text-primary">Assist</span>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-screen-2xl px-6 py-16 md:px-12 md:py-24 xl:px-20">
        <div className="space-y-4">
          <p className="text-sm font-semibold text-primary-300 uppercase tracking-wide">
            Help & Guides
          </p>
          <h1 className="text-4xl font-bold text-primary md:text-5xl lg:text-6xl">
            Your Study Abroad Resource Center
          </h1>
          <p className="max-w-2xl text-lg text-neutral-300">
            Expert guidance on visas, scholarships, housing, career planning,
            and every step of your international education journey.
          </p>
        </div>
      </section>

      {/* Category Navigation */}
      {categories.length > 0 && (
        <section className="border-b border-[#e0e0e0] bg-[#f9f9f9]">
          <div className="mx-auto max-w-screen-2xl px-6 py-8 md:px-12 xl:px-20">
            <div className="flex flex-wrap gap-3">
              <Link
                href="/assist"
                className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
                  category === ""
                    ? "bg-primary text-white shadow-md"
                    : "bg-white text-[#1e1e1e] border border-[#e0e0e0] hover:border-primary hover:text-primary"
                }`}
              >
                All Articles
              </Link>
              {categories.map((c) => (
                <Link
                  key={c._id}
                  href={`/assist?category=${c.slug}`}
                  className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
                    category === c.slug
                      ? "bg-primary text-white shadow-md"
                      : "bg-white text-[#1e1e1e] border border-[#e0e0e0] hover:border-primary hover:text-primary"
                  }`}
                  prefetch={false}
                >
                  {c.title}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Content Section */}
      <section className="mx-auto max-w-screen-2xl px-6 py-16 md:px-12 md:py-24 xl:px-20">
        {posts.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-[#e0e0e0] bg-[#f9f9f9] py-16 text-center">
            <p className="text-lg text-neutral-300">
              No articles published in this category yet.
            </p>
            <p className="mt-2 text-sm text-neutral-300">
              Check back soon for new guides and resources.
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Featured Article */}
            {featuredPost && (
              <Link
                href={`/assist/${featuredPost.slug}`}
                className="group block"
                prefetch={false}
              >
                <div className="overflow-hidden rounded-3xl bg-white shadow-lg transition-shadow duration-300 hover:shadow-2xl">
                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="relative aspect-video overflow-hidden md:aspect-auto md:h-96">
                      <Image
                        src={urlForImage(featuredPost.coverImage as never)
                          .width(800)
                          .height(600)
                          .url()}
                        alt={featuredPost.title}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-col justify-center space-y-6 p-8 md:p-10">
                      {featuredPost.category && (
                        <div className="inline-flex w-fit">
                          <span className="rounded-full bg-primary-300/10 px-4 py-2 text-sm font-semibold text-primary-300">
                            {featuredPost.category.title}
                          </span>
                        </div>
                      )}
                      <h2 className="text-3xl font-bold text-primary transition-colors duration-300 group-hover:text-primary-300 md:text-4xl">
                        {featuredPost.title}
                      </h2>
                      <p className="text-lg text-neutral-300">
                        {featuredPost.excerpt}
                      </p>
                      <div className="pt-4">
                        <span className="inline-flex items-center gap-2 text-primary-300 font-medium">
                          Read Article
                          <svg
                            className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Other Articles Grid */}
            {otherPosts.length > 0 && (
              <div>
                <h3 className="mb-8 text-2xl font-bold text-primary">
                  Latest Articles
                </h3>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {otherPosts.map((post) => (
                    <Link
                      key={post._id}
                      href={`/assist/${post.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                      prefetch={false}
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={urlForImage(post.coverImage as never)
                            .width(600)
                            .height(400)
                            .url()}
                          alt={post.title}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex grow flex-col space-y-4 p-6">
                        {post.category && (
                          <span className="inline-flex w-fit rounded-full bg-primary-300/10 px-3 py-1 text-xs font-semibold text-primary-300">
                            {post.category.title}
                          </span>
                        )}
                        <h4 className="text-lg font-semibold text-primary transition-colors duration-300 group-hover:text-primary-300">
                          {post.title}
                        </h4>
                        <p className="grow text-sm text-neutral-300">
                          {post.excerpt}
                        </p>
                        <div className="pt-2">
                          <span className="text-xs font-medium text-primary-300">
                            →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Knowledge Base */}
      <section className="mx-auto max-w-screen-2xl px-6 py-16 md:px-12 md:py-24 xl:px-20">
        <div className="space-y-4 mb-16">
          <p className="text-sm font-semibold text-primary-300 uppercase tracking-wide">
            Quick Answers
          </p>
          <h2 className="text-4xl font-bold text-primary md:text-5xl">
            Knowledge Base
          </h2>
          <p className="max-w-2xl text-lg text-neutral-300">
            Find answers to common questions about studying abroad. Browse by
            topic or search for specific information.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {knowledgeBase.map((category) => (
            <div
              key={category.id}
              className="rounded-2xl border border-[#e0e0e0] bg-white p-8 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="mb-6">
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="text-2xl font-bold text-primary">
                  {category.title}
                </h3>
                <p className="mt-2 text-sm text-neutral-300">
                  {category.description}
                </p>
              </div>

              <div className="space-y-4">
                {category.faqs.map((faq) => (
                  <details
                    key={faq.id}
                    className="group cursor-pointer border-t border-[#e0e0e0] pt-4 first:border-t-0 first:pt-0"
                  >
                    <summary className="flex items-start gap-3 font-medium text-primary hover:text-primary-300 transition-colors">
                      <span className="mt-1 flex-shrink-0">
                        <span className="block group-open:hidden">+</span>
                        <span className="hidden group-open:block">−</span>
                      </span>
                      <span className="text-sm">{faq.question}</span>
                    </summary>
                    <p className="mt-3 ml-6 text-sm text-neutral-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>

              <Link
                href={`/assist?category=${category.id}`}
                className="mt-6 inline-block text-sm font-medium text-primary-300 hover:text-primary transition-colors"
              >
                View more on blog →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-[#e0e0e0] bg-[#f9f9f9]">
        <div className="mx-auto max-w-screen-2xl px-6 py-16 text-center md:px-12 md:py-20 xl:px-20">
          <h3 className="text-2xl font-bold text-primary md:text-3xl">
            Looking for more support?
          </h3>
          <p className="mx-auto mt-4 max-w-xl text-neutral-300">
            Can't find what you need? Connect with our team for personalized
            guidance.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/#consultation-form"
              className="rounded-lg bg-primary px-8 py-3 font-medium text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              Book Consultation
            </Link>
            <Link
              href="/"
              className="rounded-lg border border-primary px-8 py-3 font-medium text-primary transition-all duration-300 hover:bg-primary hover:text-white"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
