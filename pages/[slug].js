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

export async function getServerSideProps({ params, res }) {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL;

    res.setHeader("Cache-Control", "no-store, max-age=0");

    const pageRes = await fetch(`${base}/api/pages/${params.slug}/?format=json`, {
      headers: { "Cache-Control": "no-cache" },
    });
    const resultsRes = await fetch(`${base}/api/search/home/?format=json`, {
      headers: { "Cache-Control": "no-cache" },
    });
    const selectedRes = await fetch(`${base}/api/search/selected/?format=json`, {
      headers: { "Cache-Control": "no-cache" },
    });
    const categoryRes = await fetch(`${base}/api/search/category/?format=json`, {
      headers: { "Cache-Control": "no-cache" },
    });

    return {
      props: {
        page: await pageRes.json(),
        results: await resultsRes.json(),
        selected: await selectedRes.json(),
        category: await categoryRes.json(),
      },
    };
  } catch (e) {
    return {
      props: {
        page: {
          title: "Coming soon",
          sub_title: "",
          seo_description: "",
          seo_keywords: "",
          widgets: [],
          testimonial: null,
        },
        results: [],
        selected: [],
        category: [],
      },
    };
  }
}
