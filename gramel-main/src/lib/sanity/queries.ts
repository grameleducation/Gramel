import { groq } from "next-sanity";

export const categoriesQuery = groq`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    "slug": slug.current
  }
`;

export const postsQuery = groq`
  *[_type == "post" && defined(slug.current) && ($category == "" || category->slug.current == $category)]
    | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    coverImage,
    publishedAt,
    "category": category->{title, "slug": slug.current}
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    excerpt,
    coverImage,
    body,
    publishedAt,
    "category": category->{title, "slug": slug.current}
  }
`;
