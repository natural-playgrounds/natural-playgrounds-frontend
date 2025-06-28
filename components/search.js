import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { PlusSmIcon } from "@heroicons/react/solid";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import Link from "next/link";
import Image from "next/image";

export default function Search({ results, category, topSeller }) {
  const [localResults, setLocalResults] = useState(results);
  const [filterable, setFilterable] = useState([]);
  const [selling, setSelling] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (router.query.search) {
      filterSearch(router.query.search);
    }
    if (router.query.category_search) {
      filterSelected(router.query.category_search);
      filterTop(router.query.category_search);
    }
  }, [router.query.search, router.query.category_search]);

  const filterSearch = (value) => {
    setLoading(true);
    if (value) {
      let filteredResults = [];
      let lower = value.toLowerCase();
      results.filter(function (_result) {
        if (_result.search && _result.search.includes(lower)) {
          filteredResults.push(_result);
        }
      });
      console.log(filteredResults);
      setLocalResults(filteredResults);
    }

    setLoading(false);
  };
  const filterTop = (value) => {
    setLoading(true);
    if (value) {
      let sellingList = [];
      topSeller.filter(function (_result) {
        if (_result.name && _result.name === value) {
          _result.products.filter(function (_product) {
            sellingList.push(_product);
          });
        }
      });
      setSelling(sellingList);
    }

    setLoading(false);
  };

  const filterSelected = (value) => {
    // Save the filters
    var localFilters = [...filterable];
    var index = localFilters.indexOf(value);
    if (index === -1) {
      localFilters.push(value);
    } else {
      localFilters.splice(index, 1);
    }
    console.log(localFilters.length);
    if (localFilters.length === 1) {
      filterTop(localFilters[0]);
    } else setSelling([]);

    setFilterable(localFilters);
    // Now Filter the data
    let filteredResults = [];
    setLoading(true);
    if (localFilters.length !== 0) {
      localFilters.filter(function (_filter) {
        results.filter(function (_result) {
          _result.category.filter(function (_category) {
            if (_category.name.includes(_filter)) {
              filteredResults.push(_result);
            }
          });
        });
      });
    } else {
      filteredResults = results;
    }
    setTimeout(
      function () {
        //Start the timer
        setLoading(false); //After 1.5 second, set loading to false
      }.bind(this),
      1500
    );
    setLocalResults([...new Set(filteredResults)]);
  };

  return (
    <main className="max-w-2xl mx-auto px-4 lg:max-w-6xl lg:px-8">
      <div className="pt-12 pb-24 lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
        <aside>
          <h2 className="sr-only">Filters</h2>

          <div className="sticky top-16">
            <h3 className="text-2xl font-medium leading-6 text-gray-900 pb-4">
              Select a Category
            </h3>
            <form className="overflow-auto">
              <div className="max-h-96 overflow-auto space-y-6">
                {category.map((option, optionIdx) => (
                  <div key={optionIdx} className="flex items-center">
                    <input
                      id={`${optionIdx}`}
                      name={`${option.name}`}
                      type="checkbox"
                      onChange={(event) => filterSelected(option.name)}
                      className="focus:ring-dark-green h-4 w-4 text-dark-green border-gray-300 rounded"
                      checked={filterable.includes(option.name) && true}
                    />
                    <label
                      htmlFor={`${optionIdx}`}
                      className="ml-3 text-sm text-gray-600 flex flex-row w-full"
                    >
                      <div className="flex-1">{option.name}</div>
                      <div className="flex justify-end">
                        <PlusSmIcon
                          className="ml-1 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </form>
          </div>
        </aside>
        <section
          aria-labelledby="product-heading"
          className="mt-6 lg:mt-0 lg:col-span-2 xl:col-span-3"
        >
          <h2 id="product-heading" className="sr-only">
            Products
          </h2>
          {!loading ? (
            <div className="flex flex-col space-y-4">
              {selling && selling.length > 0 && (
                <div className="flex flex-col border-b-4 border-light-green pb-4 space-y-4">
                  <h2 className="text-2xl">Top Selling Product</h2>
                  <div className="grid grid-cols-1 gap-7">
                    {selling.map((seller, sellerIdx) => (
                      <div className="grid grid-cols-3 gap-7" key={sellerIdx}>
                        <div className="col-span-1">
                          <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8 relative">
                            {seller.image_url || (seller.images && seller.images.length > 0 && seller.images[0].image_url) ? (
                              <Image
                                src={seller.image_url || seller.images[0].image_url}
                                alt={`Image for ${seller.name}`}
                                className="w-full h-full object-center object-cover group-hover:opacity-75"
                                fill
                              />
                            ) : (
                              <div className="w-full h-full object-center object-cover sm:w-full sm:h-full"></div>
                            )}
                          </div>
                        </div>
                        <div className="col-span-2  flex flex-col h-full justify-between">
                          <Link
                            key={sellerIdx}
                            href={seller.link}
                            className="group no-underline"
                          >
                            <h3 className="text-2xl font-extrabold tracking-tight  text-gray-700">
                              {seller.name}
                            </h3>
                          </Link>
                          {seller.meta_description && (
                            <div
                              className="mt-1 text-lg font-medium text-gray-900"
                              dangerouslySetInnerHTML={{
                                __html: seller.meta_description,
                              }}
                            />
                          )}
                          <div className="flex-1 flex items-end">
                            <button
                              type="button"
                              className="max-w-xs flex-1 bg-green-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-green-500 sm:w-full"
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 xl:grid-cols-3">
                {localResults.map((product, productIdx) => (
                  <Link key={productIdx} href={product.link} className="group">
                    <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8 relative">
                      {product.image_url || (product.images && product.images.length > 0 && product.images[0].image_url) ? (
                        <Image
                          src={product.image_url || product.images[0].image_url}
                          alt={`Product Image for ${product.name}`}
                          className="w-full h-full object-center object-cover group-hover:opacity-75"
                          fill
                        />
                      ) : (
                        <div className="w-full h-full object-center object-cover sm:w-full sm:h-full"></div>
                      )}
                    </div>
                    <h3 className="mt-4 text-sm text-gray-700">
                      {product.name}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-screen flex justify-center align-center items-center">
              <Loader type="Puff" color="#0d5352" height={100} width={100} />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
