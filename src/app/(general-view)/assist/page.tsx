import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import gramel_icon from "../../../../public/gramel-icon.png";
import { client } from "@/lib/sanity/client";
import { isSanityConfigured } from "@/lib/sanity/env";
import { categoriesQuery, postsQuery } from "@/lib/sanity/queries";
import { urlForImage } from "@/lib/sanity/image";

export const metadata: Metadata = {
  title: "Assist – Study Abroad Guides",
  description:
    "Guides and answers on visas, scholarships, housing, and the international education process from Gramel Education, a study abroad agency in Abuja, Nigeria.",
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
      <main className="pt-14">
        <section className="mx-auto max-w-screen-2xl px-6 py-24 text-center md:px-12 xl:px-20">
          <h1 className="text-3xl font-bold text-primary md:text-5xl">
            Assist
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-neutral-300">
            Guides and articles are on the way. This section is not
            connected to a content source yet.
          </p>
        </section>
      </main>
    );
  }

  const [categories, posts] = await Promise.all([
    client.fetch<Category[]>(categoriesQuery),
    client.fetch<PostSummary[]>(postsQuery, { category }),
  ]);

  return (
    <main className="pt-14">
      <section className="mx-auto max-w-screen-2xl px-6 py-16 md:px-12 xl:px-20">
        <div className="mx-auto flex max-w-max items-center gap-3">
          <Image src={gramel_icon} alt="Gramel Icon" className="h-6" />
          <p className="text-lg leading-normal text-primary-300">ASSIST</p>
        </div>

        <div className="mt-4 space-y-6">
          <h1 className="mx-auto max-w-2xl text-center text-4xl leading-tight font-bold text-primary lg:text-5xl">
            Guides for Your Study Abroad Journey
          </h1>
          <p className="mx-auto max-w-[58rem] text-center text-neutral-300 lg:text-lg">
            Answers on visas, scholarships, housing, and the international
            education process, from the Gramel Education team.
          </p>
        </div>

        {categories.length > 0 && (
          <div className="mt-12 flex flex-nowrap justify-center gap-4 overflow-x-auto border-b border-[#626060] py-4">
            <Link
              href="/assist"
              className={`rounded-2xl px-6 py-3 text-nowrap duration-300 md:text-lg ${
                category === ""
                  ? "bg-primary-300 text-white"
                  : "text-[#1e1e1e] hover:bg-primary-300/70 hover:text-white"
              }`}
              prefetch={false}
            >
              All
            </Link>
            {categories.map((c) => (
              <Link
                key={c._id}
                href={`/assist?category=${c.slug}`}
                className={`rounded-2xl px-6 py-3 text-nowrap duration-300 md:text-lg ${
                  category === c.slug
                    ? "bg-primary-300 text-white"
                    : "text-[#1e1e1e] hover:bg-primary-300/70 hover:text-white"
                }`}
                prefetch={false}
              >
                {c.title}
              </Link>
            ))}
          </div>
        )}

        {posts.length === 0 ? (
          <p className="mt-16 text-center text-neutral-300">
            No articles published yet. Check back soon.
          </p>
        ) : (
          <div className="mt-16 grid items-stretch gap-10 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post._id}
                href={`/assist/${post.slug}`}
                className="group flex h-full flex-col rounded-3xl transition-shadow duration-300 hover:shadow-xl"
                prefetch={false}
              >
                <div className="relative aspect-[414/280] w-full overflow-hidden rounded-t-3xl">
                  <Image
                    src={urlForImage(post.coverImage as never)
                      .width(828)
                      .height(560)
                      .url()}
                    alt={post.title}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="grow space-y-3 rounded-b-3xl border border-t-0 border-[#8F8F923D] p-6">
                  {post.category && (
                    <p className="text-sm font-semibold text-primary-300">
                      {post.category.title}
                    </p>
                  )}
                  <p className="text-lg font-semibold text-primary md:text-xl">
                    {post.title}
                  </p>
                  <p className="text-neutral-300">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
