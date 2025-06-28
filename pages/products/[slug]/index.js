import Head from "next/head";
import { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { useCartSlide } from "../../../hooks/use-cart-slide.js";
import cookie from "js-cookie";
import { CartProvider, useCart } from "react-use-cart";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function Product({ product }) {
  const { addItem, inCart } = useCart();
  const [option, setOption] = useState("");
  const [optionName, setOptionName] = useState("");
  const [price, setPrice] = useState(0);
  const { cartSlide, updateCartSlide } = useCartSlide();
  const [loggedIn, setLoggedIn] = useState(cookie.get("token"));

  useEffect(() => {
    for (var i in product.options) {
      if (product.options[i].id === option) {
        setPrice(product.options[i].current_price);
        break; // If you want to break out of the loop once you've found a match
      }
    }
  }, [option, product.options]);
  return (
    <main className="max-w-6xl mx-auto sm:pt-16 sm:px-6 lg:px-8">
      <Head>
        <title>{product.name}</title>
      </Head>
      <div className="max-w-2xl mx-auto lg:max-w-none">
        {/* Product */}
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 lg:items-start">
          {/* Image gallery */}
          <div className="h-full w-full md:w-2/5">
            {product.images && product.images.length > 0 ? (
              <Tab.Group as="div" className="flex flex-col-reverse">
                {/* Image selector */}
                <div className="hidden mt-6 w-full max-w-2xl mx-auto sm:block lg:max-w-none">
                  <Tab.List className="grid grid-cols-4 gap-6">
                    {product.images.map((image) => (
                      <Tab
                        key={image.id}
                        className="relative h-24 bg-white rounded-md flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring focus:ring-offset-4 focus:ring-opacity-50"
                      >
                        {({ selected }) => (
                          <>
                            <span className="sr-only">{image.name}</span>
                            <span className="absolute inset-0 rounded-md overflow-hidden">
                              <Image
                                src={image.image_url}
                                alt={`Product image of ${image.name}`}
                                className="w-full h-full object-center object-cover"
                                fill
                              />
                            </span>
                            <span
                              className={classNames(
                                selected
                                  ? "ring-green-500"
                                  : "ring-transparent",
                                "absolute inset-0 rounded-md ring-2 ring-offset-2 pointer-events-none"
                              )}
                              aria-hidden="true"
                            />
                          </>
                        )}
                      </Tab>
                    ))}
                </Tab.List>
              </div>

              <Tab.Panels className="w-full aspect-w-1 aspect-h-1">
                {product.images.map((image) => (
                    <Tab.Panel key={image.id}>
                      <Image
                        src={image.image_url}
                        alt={`Product image of ${image.name}`}
                        className="w-full h-full sm:rounded-lg"
                        fill
                      />
                    </Tab.Panel>
                  ))}
              </Tab.Panels>
            </Tab.Group>
            ) : (
              // Fallback when no product.images array
              <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden relative">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={`Product image of ${product.name}`}
                    className="w-full h-full object-center object-cover"
                    fill
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
              </div>
            )}
            <div className="sticky top-4">
              <div className="flex flex-col space-y-4 pt-4">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
                    {product.name}
                  </h2>
                </div>
                <form className="">
                  {/* Colors */}
                  <div>
                    <h3 className="text-lg text-gray-600">Select Option</h3>
                    <div>
                      <select
                        id="location"
                        name="location"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-2 border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                        value={option}
                        onChange={(e) => {
                          setOption(e.target.value);
                          console.log(
                            e.target.options[e.target.selectedIndex].text
                          );
                          setOptionName(
                            e.target.options[e.target.selectedIndex].text
                          );
                        }}
                      >
                        <option value="" disabled>
                          Select an Option
                        </option>
                        {product.options &&
                          product.options.map((option) => (
                            <option value={option.id} key={option.id}>
                              {option.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-10 flex flex-col-reverse sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      {price > 0 ? (
                        <button
                          type="button"
                          className="max-w-xs flex-1 bg-green-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-green-500 sm:w-full"
                          onClick={() => {
                            addItem({
                              id: option,
                              quantity: 1,
                              price: price,
                              slug: product.slug,
                              option: optionName,
                              name: product.name,
                              image: product.image_url || (product.images && product.images.length > 0 && product.images[0].image_url) || null,
                              weight: product.weight,
                            });
                            updateCartSlide(true);
                          }}
                        >
                          Add to Cart
                        </button>
                      ) : (
                        <div className="max-w-xs flex-1 bg-gray-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500 sm:w-full cursor-not-allowed text-center">
                          Select an option to add to cart
                        </div>
                      )}
                    </div>
                    {price > 0 && (
                      <div className="ml-4 h-full flex flex-col items-center align-center text-2xl pt-2 w-full sm:w-1/2">
                        ${price}
                      </div>
                    )}
                  </div>
                </form>
                <div className="flex flex-col space-y-8 border-t-2 border-gray-100">
                  {product.instructions_url || product.product_pdf_url ? (
                    <section aria-labelledby="details-heading" className="mt-4">
                      <h2 className="text-xl font-bold text-gray-900">
                        Additional details
                      </h2>

                      <div className="flex flex-col space-y-4 pt-4">
                        {product.instructions_url && (
                          <div>
                            {loggedIn ? (
                              <Link href={product.instructions_url} className="text-lg cursor-pointer">
                                View Instructions
                              </Link>
                            ) : (
                              <Link href={`/login/`} className="text-lg cursor-pointer">
                                <div>
                                  View Instructions{" "}
                                  <span className="underline">
                                    (must login)
                                  </span>
                                </div>
                              </Link>
                            )}
                          </div>
                        )}
                        <div>
                          {product.product_pdf_url && (
                            <Link href={product.product_pdf_url} className="text-lg cursor-pointer">
                              View PDF Product Sheet
                            </Link>
                          )}
                        </div>
                      </div>
                    </section>
                  ) : (
                    ""
                  )}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Dimensions
                    </h2>
                    <div
                      className="text-base text-gray-700 space-y-6"
                      dangerouslySetInnerHTML={{ __html: product.dimensions }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0 w-full md:w-3/5">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              {product.name}
            </h1>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
            </div>

            <div className="mt-6 border-t border-gray-50">
              <h3 className="sr-only">Description</h3>

              <div
                className="text-base text-gray-700 space-y-6"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          </div>
        </div>
        {product.og_bundles.length > 0 && (
          <section
            aria-labelledby="related-heading"
            className="mt-10 border-t border-gray-200 py-16 px-4 sm:px-0"
          >
            <h2
              id="related-heading"
              className="text-xl font-bold text-gray-900"
            >
              This product is best when purchased with:
            </h2>

            <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
              {product.og_bundles &&
                product.og_bundles.map((bundle) => (
                  <div key={bundle.id}>
                    <div className="relative">
                      <div className="relative w-full h-72 rounded-lg overflow-hidden">
                        {bundle.image_url && (
                          <Image
                            src={bundle.image_url}
                            alt={`Related Bundle Product`}
                            className="w-full h-full object-center object-cover"
                            fill
                          />
                        )}
                      </div>
                      <div className="relative mt-4">
                        <h3 className="text-lg font-bold text-gray-900">
                          {bundle.name}
                        </h3>
                      </div>
                      <div className="absolute top-0 inset-x-0 h-72 rounded-lg p-4 flex items-end justify-end overflow-hidden">
                        <div
                          aria-hidden="true"
                          className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
                        />
                      </div>
                    </div>
                    <div className="mt-2 flex flex-col justify-center align-center mx-auto">
                      <Link href={bundle.href} className="button text-center no-underline">
                        View Product
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}
        {product.og.length > 0 && (
          <section
            aria-labelledby="related-heading"
            className="mt-10 border-t-2 border-gray-700 py-8 px-4 sm:px-0"
          >
            <h2
              id="related-heading"
              className="text-xl font-bold text-gray-900"
            >
              Similar Products
            </h2>

            <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
              {product.og &&
                product.og.map((related) => (
                  <div key={related.id}>
                    <div className="relative">
                      <div className="relative w-full h-72 rounded-lg overflow-hidden">
                        {related.image_url && (
                          <Image
                            src={related.image_url}
                            alt={`Related Product`}
                            className="w-full h-full object-center object-cover"
                            fill
                          />
                        )}
                      </div>
                      <div className="relative mt-4">
                        <h3 className="text-lg font-bold text-gray-900">
                          {related.name}
                        </h3>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-col justify-center align-center mx-auto">
                      <Link href={related.href} className="button text-center no-underline">
                        View Product
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

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
