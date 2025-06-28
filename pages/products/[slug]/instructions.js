import Head from "next/head";
import { PrinterIcon } from "@heroicons/react/solid";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import ReactToPrint from "react-to-print";

const Instructions = ({ product }) => {
  const instructions = useRef(null);

  const pageStyle = `
  @page {
    size: 80mm 50mm;
  }

  @media all {
    .pagebreak {
      display: none;
    }
  }

  @media print {
    .pagebreak {
      page-break-before: always;
    }
  }
`;

  return (
    <main className="max-w-6xl mx-auto sm:pt-16 sm:px-6 lg:px-8 print:m-8">
      <Head>
        <title>{product.name}</title>
      </Head>
      <div className="max-w-2xl mx-auto lg:max-w-none">
        <div className="flex flex-row justify-between items-center">
          <div>
            <Link href={`/products/${product.slug}`} className="text-gray-600 text-sm">
              View Product
            </Link>
            <Link href={`/products/${product.slug}`}>
              <h1>{product.name}</h1>
            </Link>
          </div>
          <div className="w-1/4 flex justify-end">
            <ReactToPrint
              trigger={() => (
                <button className="flex flex-row space-x-2 items-center button py-4 px-2">
                  <PrinterIcon
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                  <p className="text-white text-md">Save as PDF</p>
                </button>
              )}
              content={() => instructions.current}
            />
          </div>
        </div>
        <div className="w-full print:px-12" ref={instructions}>
          <div
            className="mt-1 font-medium text-gray-900"
            dangerouslySetInnerHTML={{
              __html: product.instructions,
            }}
          />
        </div>
      </div>
    </main>
  );
};

export async function getStaticProps({ params }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${params.slug}/?format=json`
  );

  return {
    props: {
      product: await res.json(),
    },
  };
}
export async function getStaticPaths() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/?format=json`
  );
  const products = await res.json();
  const paths = products.map((product) => {
    return {
      params: {
        slug: product.slug.toString(),
      },
    };
  });
  return {
    paths,
    fallback: false,
  };
}

export default Instructions;
