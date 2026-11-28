import nextCookie from "next-cookies";
import Head from "next/head";
import { withAuthSync } from "../../lib/auth";
import Router from "next/router";
import Image from "next/image";
import axios from "axios";
import { jsPDF } from "jspdf";
import { useRef } from "react";
import ReactToPrint from "react-to-print";
const Purchase = (props) => {
  const instructionsRef = useRef(null);
  const money = value => Number(value || 0).toLocaleString("en-US", {style:"currency",currency:"USD"});
  const statusText = props.payment_status === "COMPLETED" ? "Payment received." : props.payment_status === "PENDING" ? "Payment pending." : `Payment status: ${props.payment_status || "Unknown"}`;
  const downloadOrder = () => {
    const doc = new jsPDF();
    let y = 20;
    const line = (value, size = 11) => {
      doc.setFontSize(size);
      const lines = doc.splitTextToSize(String(value || ""), 174);
      for (const part of lines) {
        if (y > 275) { doc.addPage(); y = 20; }
        doc.text(part, 18, y); y += size * 0.45 + 2;
      }
    };
    line("Natural Playgrounds", 19);
    line("Saved Order #" + props.sale_number, 15);
    line(statusText);
    y += 5;
    line("Shipping address: " + props.shipping);
    line("Billing address: " + props.billing);
    y += 5;
    props.products.forEach(p => {
      line(p.name, 12);
      line(p.option);
      line("Quantity: " + p.amount + " | Price: " + money(p.price));
      y += 3;
    });
    line("Subtotal: " + money(props.order_total));
    line("Shipping: " + money(props.customer_shipping));
    line("Total: " + money(Number(props.order_total) + Number(props.customer_shipping)), 14);
    doc.save("Order-" + props.sale_number + ".pdf");
  };
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
            Order #{props.sale_number}
          </p>
          <p className="mt-2 text-base text-gray-500">
            Order #{props.sale_number}. {statusText}
          </p>
          <a href="/account" className="block mt-4 underline">Back to Order History</a>
          <button type="button" onClick={downloadOrder} className="mt-6 rounded bg-green-800 px-5 py-3 font-semibold text-white">Download Order PDF</button>
          <ReactToPrint documentTitle={`Installation-Instructions-${props.sale_number}`} content={() => instructionsRef.current} pageStyle="@page { size: letter; margin: 0.5in; } @media print { img { max-width: 100%; height: auto; } }" trigger={() => <button type="button" className="mt-3 block rounded bg-green-800 px-5 py-3 font-semibold text-white">Print / Save Installation Instructions PDF</button>} />
          <div style={{display:"none"}}><div ref={instructionsRef}>
            <h1>Installation Instructions — Order #{props.sale_number}</h1>
            {(props.instructions || []).map((p,i) => <section key={p.href} style={{breakBefore:i ? "page" : "auto"}}><h2>{p.name}</h2>{p.instructions ? <div dangerouslySetInnerHTML={{__html:p.instructions}} /> : <p>Instructions unavailable. Contact info@naturalplaygrounds.com.</p>}</section>)}
          </div></div>
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
                  {product.image && <Image
                    src={product.image}
                    alt={`Product image for ${product.name}`}
                    className="object-center object-cover"
                    fill
                  />}
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
                        <dd className="ml-2 text-gray-700">{money(product.price)}</dd>
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
                <dd className="text-gray-700 w-32">{money(props.order_total)}</dd>
              </div>
              <div className="flex">
                <dt className="font-medium text-gray-900 w-32">Shipping</dt>
                <dd className="text-gray-700 w-32">
                  {money(props.customer_shipping)}
                </dd>
              </div>
              <div className="flex">
                <dt className="font-medium text-gray-900 w-32">Total</dt>
                <dd className="text-gray-900 w-32">
                  {money(Number(props.order_total) + Number(props.customer_shipping))}
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
    const response = await axios.get(apiUrl, {headers: {Authorization: `Token ${token}`}});
    if (response.status == 201) {
      const data = await response.data;
      const unique = [...new Map(data.products.map(p => [p.href,p])).values()];
      const instructions = await Promise.all(unique.map(async p => {
        try {
          const slug = p.href.split("/").filter(Boolean).pop();
          const {data: product} = await axios.get(`${environment}/api/products/${encodeURIComponent(slug)}/?format=json`, {timeout:10000});
          return {href:p.href,name:p.name,instructions:product.instructions || ""};
        } catch { return {href:p.href,name:p.name,instructions:""}; }
      }));
      return {
        props: { ...data, token, instructions },
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
