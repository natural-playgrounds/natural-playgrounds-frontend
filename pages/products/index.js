/* eslint-disable */
import React from "react";
import Search from "../../components/search";

export default function ProductIndex({ results, category }) {
  return <Search results={results} category={category} />;
}

export async function getStaticProps({ params }) {
  const results = await fetch(`${process.env.API_URL}/api/search/?format=json`);
  const category = await fetch(
    `${process.env.API_URL}/api/search/category/?format=json`
  );

  return {
    props: {
      results: await results.json(),
      category: await category.json(),
    },
  };
}
