import { useState, useEffect } from "react";
import { TrashIcon } from "@heroicons/react/solid";
import { useCart } from "react-use-cart";
import { Switch } from "@headlessui/react";
import axios from "axios";
import nextCookie from "next-cookies";
import { withAuthSync } from "../lib/auth";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import Router from "next/router";
import Image from "next/image";
import Link from "next/link";
import GoogleAutocomplete from "../components/GoogleAutocomplete";
import toast from "react-hot-toast";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const Checkout = (props) => {
  console.log('Google Maps API Key:', process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
  const { cartTotal, items, removeItem, updateItemQuantity, emptyCart } =
    useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [total, updateTotal] = useState(0);
  const [shippingAmount, updateShippingAmount] = useState(() =>
    getShippingAmount()
  );
  const [company, setCompany] = useState(props.company);
  const [billing, setBilling] = useState(props.raw_billing);
  const [shipping, setShipping] = useState(props.raw_shipping);
  const [billingShippingSame, setBillingShippingSame] = useState(props.same_as);
  const [userEmail, setUserEmail] = useState(props.email);
  const [firstName, setFirstName] = useState(props.first_name);
  const [fax, setFax] = useState(props.fax_number);
  const [phone, setPhone] = useState(props.phone_number);
  const [lastName, setLastName] = useState(props.last_name);
  const [billingDirty, setBillingDirty] = useState(false);
  const [shippingDirty, setShippingDirty] = useState(false);

  // CardPointe Hosted iFrame Tokenizer state
  const [paymentToken, setPaymentToken] = useState('');
  const [isTokenReady, setIsTokenReady] = useState(false);
  const [tokenError, setTokenError] = useState('');
  useEffect(() => {
    setBilling("");
  }, [billingShippingSame]);

  // Listen for payment token from Hosted iFrame Tokenizer
  useEffect(() => {
    const handleTokenMessage = (event) => {
      // Only process messages that look like JSON and are from CardPointe
      if (typeof event.data !== 'string' || !event.data.startsWith('{')) {
        return; // Ignore non-JSON messages
      }
      
      try {
        const tokenData = JSON.parse(event.data);
        
        // Only process messages that have CardPointe token structure
        if (!tokenData.hasOwnProperty('message') && !tokenData.hasOwnProperty('validationError')) {
          return; // Ignore messages not from CardPointe
        }
        
        // Successful tokenization
        if (tokenData.message && !tokenData.validationError) {
          setPaymentToken(tokenData.message);
          setIsTokenReady(true);
          setTokenError('');
          console.log('Payment token received:', tokenData.message);
        }
        
        // Validation errors
        if (tokenData.validationError) {
          setTokenError(`Payment validation error: ${tokenData.validationError}`);
          setIsTokenReady(false);
        }
        
      } catch (error) {
        // Silently ignore JSON parse errors from other sources (like Google Maps)
        return;
      }
    };

    window.addEventListener('message', handleTokenMessage, false);
    
    return () => {
      window.removeEventListener('message', handleTokenMessage, false);
    };
  }, []);
  function getShippingAmount() {
    var shipping_amount = 0;
    items.map((item) => {
      shipping_amount =
        shipping_amount + parseFloat(item.quantity * item.weight);
    });
    if (shipping_amount >= 300 && cartTotal < 1500) {
      return 600;
    }
    if (shipping_amount > 300) {
      return cartTotal * 1.33;
    }
    if (shipping_amount >= 100) {
      return cartTotal * 1.3;
    }
    if (shipping_amount >= 40) {
      return cartTotal * 1.1;
    }

    return shipping_amount;
  }
  async function handleSubmit(e) {
    try {
      e.preventDefault();
      
      if (!paymentToken) {
        toast.error("Please enter your payment information");
        return;
      }
      
      setIsSubmitting(true);
      const environment =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      console.log('Submitting checkout with shipping:', shipping);
      console.log('Submitting checkout with billing:', billing);
      console.log('Using secure payment token:', paymentToken.substring(0, 10) + '...');
      
      const res = await axios.post(`${environment}/api/checkout/`, {
        token: props.token,
        firstName: firstName,
        lastName: lastName,
        email: userEmail,
        billing: billing,
        shipping: shipping,
        customer_shipping: shippingAmount,
        same_as: billingShippingSame,
        company: company,
        fax: fax,
        phone: phone,
        cardToken: paymentToken, // Send secure token from Hosted iFrame Tokenizer
        items: items,
      });

      if (res.status === 201) {
        const data = await res.data;
        
        // CardPointe authorization successful
        if (data.success) {
          emptyCart();
          toast.success(`Order authorized successfully! Order #${data.orderNumber}`);
          Router.push(`/purchase/${data.saleId}`);
        } else {
          // Handle authorization failure
          toast.error(data.error || "Payment authorization failed");
          setIsSubmitting(false);
        }
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error('Checkout error:', error);
      
      // Show specific error if available
      const errorMessage = error.response?.data?.error || 
        "Issue processing your order. Please try again or contact us at info@naturalplaygrounds.com";
      
      toast.error(errorMessage);
    }
  }
  return (
    <div className="">
      <div className="max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        {!isSubmitting ? (
          <form
            className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16"
            onSubmit={handleSubmit}
          >
            <div>
              <div className="">
                <h2 className="text-lg font-medium text-gray-900">
                  Contact information
                </h2>

                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  <div>
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      First name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="first-name"
                        name="first-name"
                        autoComplete="given-name"
                        required={true}
                        defaultValue={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm p-2 border-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="last-name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Last name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="last-name"
                        name="last-name"
                        required={true}
                        autoComplete="family-name"
                        defaultValue={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm p-2 border-2"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="company"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Company
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="company"
                        id="company"
                        required={true}
                        defaultValue={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm p-2 border-2"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-1">
                    <label
                      htmlFor="fax"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Fax Number
                    </label>
                    <div className="mt-1">
                      <input
                        type="tel"
                        name="fax"
                        id="fax"
                        autoComplete="tel"
                        defaultValue={fax}
                        onChange={(e) => setFax(e.target.value)}
                        pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm p-2 border-2"
                      />
                      <p className="text-xs">Format ###-###-####</p>
                    </div>
                  </div>
                  <div className="sm:col-span-1">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone
                    </label>
                    <div className="mt-1">
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        required={true}
                        defaultValue={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        autoComplete="tel"
                        pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm p-2 border-2"
                      />
                      <p className="text-xs">Format ###-###-####</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="mt-10 pt-10">
                <h2 className="text-lg font-medium text-gray-900">
                  Shipping/Billing Information
                </h2>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label
                      htmlFor="street-address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Shipping address
                    </label>
                    <div className="mt-1">
                      <GoogleAutocomplete
                        className="shadow-sm focus:ring-i-500 focus:border-i-500 block w-full sm:text-sm border-gray-300 rounded-md border-2 py-2 px-4"
                        defaultValue={typeof shipping === 'string' ? shipping : shipping?.formatted_address || ''}
                        required={true}
                        onChange={(e) => {
                          setShippingDirty(true);
                        }}
                        onPlaceSelected={(place) => {
                          console.log('Google Places selected:', place);
                          setShipping(place);
                          setShippingDirty(false);
                        }}
                        options={{
                          types: ["address"],
                          componentRestrictions: { country: ["us", "ca"] },
                        }}
                      />
                      {shippingDirty && (
                        <p className="text-red-500 text-xs italic">
                          Please select a valid address
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="sm:col-span-6">
                    <div className="w-full">
                      <Switch.Group
                        as="div"
                        className="flex items-center justify-between"
                      >
                        <span className="flex-grow flex flex-col">
                          <Switch.Label
                            as="span"
                            className="text-sm font-medium text-gray-900"
                            passive
                          >
                            Billing address same as shipping?
                          </Switch.Label>
                          <Switch.Description
                            as="span"
                            className="text-sm text-gray-500"
                          >
                            If your Billing and Shipping address is the same,
                            please select.
                          </Switch.Description>
                        </span>
                        <Switch
                          checked={billingShippingSame}
                          onChange={setBillingShippingSame}
                          className={classNames(
                            billingShippingSame
                              ? "bg-green-600"
                              : "bg-gray-200",
                            "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={classNames(
                              billingShippingSame
                                ? "translate-x-5"
                                : "translate-x-0",
                              "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                            )}
                          />
                        </Switch>
                      </Switch.Group>
                    </div>
                  </div>
                  {!billingShippingSame && (
                    <div className="sm:col-span-6">
                      <label
                        htmlFor="street-address"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Billing address
                      </label>
                      <div className="mt-1">
                        <GoogleAutocomplete
                          className="shadow-sm focus:ring-i-500 focus:border-i-500 block w-full sm:text-sm border-gray-300 rounded-md border-2 py-2 px-4"
                          defaultValue={typeof billing === 'string' ? billing : billing?.formatted_address || ''}
                          required={!billingShippingSame}
                          onChange={(e) => {
                            setBillingDirty(true);
                          }}
                          onPlaceSelected={(place) => {
                            console.log('Billing place selected:', place);
                            setBilling(place);
                            setBillingDirty(false);
                          }}
                          options={{
                            types: ["address"],
                            componentRestrictions: { country: ["us", "ca"] },
                          }}
                        />
                        {billingDirty && (
                          <p className="text-red-500 text-xs italic">
                            Please select a valid address
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-10 pt-10">
                <h2 className="text-lg font-medium text-gray-900">Payment Information</h2>
                
                {/* Hosted iFrame Tokenizer for secure payment processing */}
                <div className="mt-6">
                  <iframe
                    id="tokenFrame"
                    name="tokenFrame"
                    src={`https://fts-uat.cardconnect.com/itoke/ajax-tokenizer.html?useexpiry=true&usecvv=true&formatinput=true&tokenizewheninactive=true&inactivityto=2000&cardlabel=Card%20Number&expirylabel=Expiration&cvvlabel=CVV&css=${encodeURIComponent('input{width:100%;padding:12px;border:2px solid #e1e5e9;border-radius:8px;font-size:16px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;transition:border-color 0.2s ease;}input:focus{border-color:#10b981;outline:none;box-shadow:0 0 0 3px rgba(16,185,129,0.1);}label{font-weight:600;color:#374151;margin-bottom:6px;display:block;}.error{border-color:#dc3545;background-color:#fef2f2;}')}`}
                    frameBorder="0"
                    scrolling="no"
                    style={{
                      width: '100%',
                      height: '140px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '8px',
                      backgroundColor: '#ffffff'
                    }}
                  />
                  
                  {/* Token status indicator */}
                  <div className="mt-3">
                    {isTokenReady ? (
                      <div className="flex items-center text-green-600">
                        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium">Payment information secured</span>
                      </div>
                    ) : tokenError ? (
                      <div className="flex items-center text-red-600">
                        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">{tokenError}</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-500">
                        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">Enter payment details above</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">
                        Secure Payment Processing
                      </h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>
                          Your payment information is processed securely and never stored on our servers. 
                          This form uses bank-level encryption and is PCI DSS compliant.
                        </p>
                        <ul className="mt-2 list-disc list-inside">
                          <li>Payment data goes directly to secure CardPointe servers</li>
                          <li>256-bit SSL encryption</li>
                          <li>Your card will be authorized now, charged when ready to ship</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div className="mt-10 lg:mt-0">
              <h2 className="text-lg font-medium text-gray-900">
                Order summary
              </h2>

              <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h3 className="sr-only">Items in your cart</h3>
                <ul role="list" className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <li key={item.id} className="flex py-6 px-4 sm:px-6">
                      <div className="flex-shrink-0 h-32 w-32 relative">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={`Product Image of ${item.name}`}
                            className="object-center object-cover"
                            fill
                          />
                        )}
                      </div>

                      <div className="ml-6 flex-1 flex flex-col">
                        <div className="flex">
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm">
                              <Link
                                href={`/products/${item.slug}`}
                                className="font-medium text-gray-700 hover:text-gray-800"
                              >
                                {item.name}
                              </Link>
                            </h4>
                            <p className="mt-1 text-sm text-gray-500">
                              {item.option}
                            </p>
                          </div>

                          <div className="ml-4 flex-shrink-0 flow-root">
                            <button
                              type="button"
                              className="-m-2.5 bg-white p-2 border-2.5 flex items-center justify-center text-gray-400 hover:text-gray-500"
                              onClick={() => removeItem(item.id)}
                            >
                              <span className="sr-only">Remove</span>
                              <TrashIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>

                        <div className="pt-2 flex items-end justify-between">
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            ${item.price}
                          </p>

                          <div className="ml-4 w-16">
                            <label htmlFor="quantity" className="sr-only">
                              Quantity
                            </label>
                            <select
                              id={`quantity-${item.id}`}
                              name={`quantity-${item.id}`}
                              value={item.quantity}
                              onChange={(e) => {
                                updateItemQuantity(item.id, e.target.value);
                              }}
                              className="w-full max-w-full rounded-md border border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            >
                              <option value={1}>1</option>
                              <option value={2}>2</option>
                              <option value={3}>3</option>
                              <option value={4}>4</option>
                              <option value={5}>5</option>
                              <option value={6}>6</option>
                              <option value={7}>7</option>
                              <option value={8}>8</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <dl className="border-t border-gray-200 py-6 px-4 space-y-6 sm:px-6">
                  <div className="flex items-center justify-between">
                    <dt className="text-sm">Subtotal</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      ${cartTotal.toFixed(2)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-sm">
                      Shipping
                      <br />
                      <div className="w-3/4 text-xs italic">
                        This is our best guess. Due to the nature of our
                        products we put an estimate together. Once the product
                        is ready to ship, we&lsquo;ll reach back out with actual
                        shipping amounts. Your card will be charge then.
                      </div>
                    </dt>
                    <dd className="text-sm font-medium text-gray-900">
                      ${shippingAmount.toFixed(2)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                    <dt className="text-base font-medium">Total</dt>
                    <dd className="text-base font-medium text-gray-900">
                      ${(cartTotal + shippingAmount).toFixed(2)}
                    </dd>
                  </div>
                </dl>

                <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                  {items.length <= 0 ? (
                    <p className="text-white bg-red-600 p-4 border-left-4 border-red-800">
                      Cart can&apos;t be empty
                    </p>
                  ) : (
                    <>
                      {items.length > 0 &&
                      !shippingDirty &&
                      !billingDirty &&
                      isTokenReady ? (
                        <button type="submit" className="w-full button">
                          Place Order
                        </button>
                      ) : (
                        <button type="button" className="w-full button-empty">
                          {!isTokenReady ? 'Enter payment information' : 'Please check shipping/billing addresses and cart items'}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="h-screen flex justify-center align-center items-center">
            <Loader type="Puff" color="#0d5352" height={100} width={100} />
          </div>
        )}
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

  var environment = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const apiUrl = `${environment}/api/account/`;

  const redirectOnError = () => ({
    redirect: {
      destination: "/login",
      permanent: false,
    },
  });

  try {
    const response = await axios.post(apiUrl, {
      token: token,
    });

    if (response.status == 201) {
      const data = await response.data;
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

export default withAuthSync(Checkout);
