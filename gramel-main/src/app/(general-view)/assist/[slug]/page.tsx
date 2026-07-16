import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { client } from "@/lib/sanity/client";
import { isSanityConfigured } from "@/lib/sanity/env";
import { postBySlugQuery } from "@/lib/sanity/queries";
import { urlForImage } from "@/lib/sanity/image";

export const revalidate = 60;

interface Post {
  _id: string;
  title: string;
  excerpt: string;
  coverImage: unknown;
  body: unknown[];
  publishedAt: string;
  category: { title: string; slug: string } | null;
}

async function getPost(slug: string) {
  if (!isSanityConfigured) return null;
  return client.fetch<Post | null>(postBySlugQuery, { slug });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => (
      <div className="relative my-8 aspect-video w-full overflow-hidden rounded-2xl">
        <Image
          src={urlForImage(value).width(1200).url()}
          alt={value.alt || ""}
          fill
          unoptimized
          className="object-cover"
        />
      </div>
    ),
  },
};

export default async function AssistPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  return (
    <main className="pt-14">
      <article className="mx-auto max-w-screen-md px-6 py-16 md:px-12 xl:px-0">
        <Link
          href="/assist"
          className="text-sm font-semibold text-primary-300 hover:underline"
          prefetch={false}
        >
          ← Back to Assist
        </Link>

        {post.category && (
          <p className="mt-6 text-sm font-semibold text-primary-300">
            {post.category.title}
          </p>
        )}

        <h1 className="mt-2 text-3xl leading-tight font-bold text-primary md:text-5xl">
          {post.title}
        </h1>

        <p className="mt-4 text-sm text-neutral-300">
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-3xl">
          <Image
            src={urlForImage(post.coverImage as never).width(1600).url()}
            alt={post.title}
            fill
            unoptimized
            className="object-cover"
          />
        </div>

        <div className="prose prose-neutral mt-10 max-w-none">
          <PortableText
            value={post.body as never}
            components={portableTextComponents}
          />
        </div>
      </article>
    </main>
  );
}
