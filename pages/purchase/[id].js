import nextCookie from "next-cookies";
import Head from "next/head";
import { withAuthSync } from "../../lib/auth";
import Router from "next/router";
import Image from "next/image";
import axios from "axios";
const Purchase = (props) => {
  return (
    <div className="bg-white">
      <Head>
        <title>Checkout</title>
      </Head>
      <div className="wide-load py-16 sm:py-24">
        <div className="max-w-xl">
          <h1 className="text-sm font-semibold uppercase tracking-wide text-green-600">
            Thank you!
          </h1>
          <p className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
            It&lsquo;s on the way!
          </p>
          <p className="mt-2 text-base text-gray-500">
            Your order #{props.sale_number} has been placed and will be with you
            soon.
          </p>
        </div>

        <div className="mt-10 border-t border-gray-200">
          <h2 className="sr-only">Your order</h2>

          <h3 className="sr-only">Items</h3>

          <div className="">
            <h3 className="sr-only">Your information</h3>

            <h4 className="sr-only">Addresses</h4>
            <dl className="grid grid-cols-2 gap-x-6 text-sm py-10">
              <div>
                <dt className="font-medium text-gray-900">Shipping address</dt>
                <dd className="mt-2 text-gray-700">
                  <address className="not-italic">
                    <span className="block">{props.shipping}</span>
                  </address>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900">Billing address</dt>
                <dd className="mt-2 text-gray-700">
                  <address className="not-italic">
                    <span className="block">{props.billing}</span>
                  </address>
                </dd>
              </div>
            </dl>
            {props.products.map((product) => (
              <div
                key={product.id}
                className="py-10 border-b border-gray-200 flex space-x-6"
              >
                <div className="h-20 w-20 rounded-lg sm:w-40 sm:h-40 bg-gray-100 relative">
                  <Image
                    src={product.image}
                    alt={`Product image for ${product.name}`}
                    className="object-center object-cover"
                    fill
                  />
                </div>
                <div className="flex-auto flex flex-col">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      <a href={product.href}>{product.name}</a>
                    </h4>
                    <p className="mt-2 text-sm text-gray-600">
                      {product.option}
                    </p>
                  </div>
                  <div className="mt-6 flex-1 flex items-end">
                    <dl className="flex text-sm divide-x divide-gray-200 space-x-4 sm:space-x-6">
                      <div className="flex">
                        <dt className="font-medium text-gray-900">Quantity:</dt>
                        <dd className="ml-2 text-gray-700">{product.amount}</dd>
                      </div>
                      <div className="pl-4 flex sm:pl-6">
                        <dt className="font-medium text-gray-900">Price:</dt>
                        <dd className="ml-2 text-gray-700">${product.price}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            ))}

            <h3 className="sr-only">Summary</h3>

            <dl className="space-y-6 border-t border-gray-200 text-sm pt-10">
              <div className="flex">
                <dt className="font-medium text-gray-900 w-32">Subtotal</dt>
                <dd className="text-gray-700 w-32">${props.order_total}</dd>
              </div>
              <div className="flex">
                <dt className="font-medium text-gray-900 w-32">Shipping</dt>
                <dd className="text-gray-700 w-32">
                  ${props.customer_shipping.toFixed(2)}
                </dd>
              </div>
              <div className="flex">
                <dt className="font-medium text-gray-900 w-32">Total</dt>
                <dd className="text-gray-900 w-32">
                  ${(props.order_total + props.customer_shipping).toFixed(2)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};
export async function getServerSideProps(ctx) {
  const { token } = nextCookie(ctx);
  
  // Auth check - redirect if no token
  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const redirectOnError = () => ({
    redirect: {
      destination: "/login",
      permanent: false,
    },
  });
  var environment = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const apiUrl = `${environment}/api/purchase/${ctx.query.id}/`;

  try {
    const response = await axios.get(apiUrl);
    if (response.status == 201) {
      const data = await response.data;
      console.log(data);
      return {
        props: { ...data, token },
      };
    } else {
      // https://github.com/developit/unfetch#caveats
      return redirectOnError();
    }
  } catch (error) {
    // Implementation or Network error
    return redirectOnError();
  }
}

export default withAuthSync(Purchase);
