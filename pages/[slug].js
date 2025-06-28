import Head from "next/head";
import Hero from "../components/hero";
import WidgetChooser from "../components/widgetChooser";
import { useCartSlide } from "../hooks/use-cart-slide.js";
import { useEffect } from "react";
export default function Page({ page, results, selected, category }) {
  const { updateTestimonial } = useCartSlide();
  
  useEffect(() => {
    updateTestimonial(page.testimonial);
  }, [page.testimonial, updateTestimonial]);
  return (
    <main>
      <Head>
        <title>{page.title}</title>
        <meta name="description" content={page.seo_description} />
        <meta name="keywords" content={page.seo_keywords} />
        <meta property="og:type" content="article" />
      </Head>
      <Hero title={page.title} sub_title={page.sub_title} />
      <div className="flex flex-col relative" style={{ minHeight: "600px" }}>
        {page.widgets &&
          page.widgets.map((object, i) => (
            <WidgetChooser
              obj={object}
              key={i}
              results={results}
              selected={selected}
              category={category}
            />
          ))}
      </div>
    </main>
  );
}

export async function getStaticProps({ params }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/pages/${params.slug}/?format=json`
  );
  const results = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/search/home/?format=json`
  );
  const selected = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/search/selected/?format=json`
  );
  const category = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/search/category/?format=json`
  );

  return {
    props: {
      page: await res.json(),
      results: await results.json(),
      selected: await selected.json(),
      category: await category.json(),
    },
  };
}
export async function getStaticPaths() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/pages/?format=json`
  );
  const pages = await res.json();
  const paths = pages.map((page) => {
    return {
      params: {
        slug: page.slug.toString(),
      },
    };
  });
  return {
    paths,
    fallback: false,
  };
}
