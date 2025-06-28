import Link from "next/link";
import Social from "./social";
export default function Contact() {
  return (
    <div className="bg-light-gray border-b-2 border-gray-400 py-4">
      <div className="wide-load flex md:flex-row">
        <div className="w-full md:w-1/2 flex flex-row items-center space-x-6">
          <p>Follow Us</p>
          <div className="flex flex-row space-x-6">
            <Social classProps="h-5 w-5 text-gray-500 hover:text-gray-800 cursor-pointer" />
          </div>
        </div>
        <div className="hidden md:flex w-1/2 flex-row justify-end space-x-8">
          <div>
            <Link href="/contact/" className="no-underline">
              Contact Us
            </Link>
          </div>
          <div>
            <Link href="/products/" className="no-underline">
              Shop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
