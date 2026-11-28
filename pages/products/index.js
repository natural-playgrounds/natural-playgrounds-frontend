/* eslint-disable */
import React from "react";
import Search from "../../components/search";
import Head from "next/head";

export default function ProductIndex({ results, category, topSeller }) {
  return (
    <>
      <Head>
        <title>Products</title>
      </Head>
      <Search results={results} category={category} topSeller={topSeller} />
    </>
  );
}

export async function getServerSideProps({ res }) {
  res.setHeader('Cache-Control', 'no-store');
  const results = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/search/?format=json`
  );
  const category = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/search/category/?format=json`
  );
  const topSeller = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/search/selected/?format=json`
  );

  if (![results, category, topSeller].every(response => response.ok)) {
    throw new Error('Unable to load current product catalog');
  }

  return {
    props: {
      results: await results.json(),
      category: await category.json(),
      topSeller: await topSeller.json(),
    },
  };
}
