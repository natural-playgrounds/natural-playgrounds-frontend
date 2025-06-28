import Link from "next/link";
import { Disclosure } from "@headlessui/react";
import { SearchIcon } from "@heroicons/react/solid";
import Logo from "../images/logo.png";
import Image from "next/image";
import { useCartSlide } from "../hooks/use-cart-slide";
import {
  ShoppingCartIcon,
  MenuIcon,
  XIcon,
  UserIcon,
} from "@heroicons/react/outline";
import { CartProvider, useCart } from "react-use-cart";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const navigation = [
  { name: "About", href: "/about/", current: true },
  { name: "Store Products", href: "/products/", current: false },
  { name: "Services", href: "/design/", current: false },
  { name: "Gallery", href: "/gallery/", current: false },
];

const mobileNavigation = [
  { name: "About", href: "/about/", current: true },
  { name: "Store Products", href: "/products/", current: false },
  { name: "Services", href: "/design/", current: false },
  { name: "Gallery", href: "/gallery/", current: false },
  { name: "Shopping Cart", href: "/cart/", current: false },
  { name: "My Account", href: "/account/", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const router = useRouter();
  const { search } = router.query;
  const { updateCartSlide } = useCartSlide();
  const { totalUniqueItems } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (router.query.search) {
      setSearchTerm(router.query.search);
    } else if (search) {
      setSearchTerm(search);
    }
  }, [router.query, search]);

  return (
    <Disclosure as="header" className="bg-white shadow">
      {({ open }) => (
        <>
          <div>
            <div className="wide-load">
              <div className="relative h-28 flex justify-between">
                <div className="relative px-2 flex lg:px-0">
                  <div className="flex-shrink-0 flex items-center">
                    <Link href="/" className="z-10">
                      <Image
                        className="h-16 w-auto no-underline"
                        src={Logo}
                        alt="Natural Playgrounds Logo"
                        width={161}
                        height={100}
                      />
                    </Link>
                  </div>
                </div>
                <div className="relative z-0 flex-1 px-2 flex items-center justify-center sm:absolute sm:inset-0">
                  <form
                    className="w-full sm:max-w-xs hidden md:block"
                    action="/products"
                  >
                    <label htmlFor="search" className="sr-only">
                      Search
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                        <SearchIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                      <input
                        id="search"
                        name="search"
                        className="block w-full bg-white border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Search"
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </form>
                </div>
                <div className="relative flex items-center lg:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500">
                    <span className="sr-only">Open menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="hidden lg:ml-4 lg:flex lg:items-center space-x-4">
                  <div className="flex flex-row justify-between space-x-1 items-center  no-underline cursor-pointer  text-black">
                    <button className="">
                      <span className="sr-only">View Shopping Cart</span>
                      <span
                        className="inline-block relative"
                        onClick={() => updateCartSlide(true)}
                      >
                        <ShoppingCartIcon
                          className="h-6 w-6"
                          aria-hidden="true"
                        />
                        {mounted && totalUniqueItems > 0 && (
                          <span className="absolute top-0 right-0 h-5 w-5 transform -translate-y-1/2 translate-x-1/2 rounded-full ring-2 ring-white bg-dark-green flex justify-center items-center">
                            <span className="text-xs text-white">
                              {totalUniqueItems}
                            </span>
                          </span>
                        )}
                      </span>
                    </button>
                    <span
                      onClick={() => updateCartSlide(true)}
                      style={{ zIndex: 1 }}
                      className="uppercase text-sm"
                    >
                      Shopping Cart
                    </span>
                  </div>
                  <Link 
                    href="/account/" 
                    className="flex flex-row justify-between space-x-1 items-center h no-underline relative cursor-pointer text-black"
                    style={{ zIndex: 1 }}
                  >
                    <button className="flex-shrink-0 bg-white rounded-full p-">
                      <span className="sr-only">View my account</span>
                      <UserIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                    <p className="uppercase text-sm">My Account</p>
                  </Link>
                </div>
              </div>
            </div>
            <div className="bg-dark-green flex flex-row">
              <div className="w-1/4"></div>
              <div className=" flex-1">
                <div className="wide-load">
                  <nav
                    className="hidden lg:py-2 lg:flex lg:space-x-8"
                    aria-label="Global"
                  >
                    {navigation.map((item) => (
                      <a
                        className={
                          "rounded-md py-2 px-3 inline-flex items-center text-sm uppercase font-medium text-white  no-underline"
                        }
                        aria-current={item.current ? "page" : undefined}
                        href={item.href}
                        key={item.href}
                      >
                        {item.name}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel as="nav" className="lg:hidden" aria-label="Global">
            <div className="pt-2 pb-3 px-2 space-y-1">
              {mobileNavigation.map((item) => (
                <Link 
                  href={item.href} 
                  key={item.name}
                  className="block rounded-md py-2 px-3 text-base font-medium no-underline"
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
