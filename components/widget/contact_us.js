import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import toast from "react-hot-toast";

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

export default function Profile() {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [captcha, setCaptcha] = useState();
  const [message, setMessage] = useState();
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function onChange(value) {
    setCaptcha(value);
  }

  async function handleSubmit(e) {
    try {
      if (captcha) {
        setIsSubmitting(true);
        e.preventDefault();
        const environment =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await axios.post(`${environment}/api/contact/`, {
          name: name,
          email: email,
          message: message,
        });

        if (res.status === 201) {
          toast.success("We'll be in touch soon.", { duration: 3000 });
          setName();
          setEmail();
          setMessage();
        } else {
          throw new Error(await res.data);
        }
        isSubmitting(false);
      }
    } catch (error) {
      toast.error(`An unexpected error happened occurred: ${error}`, { duration: 3000 });
      if (
        error.response &&
        error.response.data &&
        error.response.data.non_field_errors
      ) {
        setErrorMsg(error.response.data.non_field_errors[0]);
      }
    }
  }

  return (
    <main>
      <div className="wide-load">
        <div className="flex flex-col">
          <div>
            <p className="mt-2 text-sm text-gray-900">
              Natural Playgrounds Company
            </p>
            <p className="mt-2 text-sm text-gray-900">
              Email:{" "}
              <a href="mailto:info@naturalplaygrounds.com">
                info@naturalplaygrounds.com
              </a>
            </p>
          </div>
          <div className="pt-4">
            {!isSubmitting ? (
              <form
                className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6"
                onSubmit={handleSubmit}
              >
                <div className="sm:col-span-3">
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      defaultValue={name}
                      required={true}
                      onChange={(e) => setName(e.target.value)}
                      className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md border-2 py-2 px-4"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required={true}
                      onChange={(e) => setEmail(e.target.value)}
                      className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md border-2 py-2 px-4"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Message
                  </label>
                  <div className="mt-1">
                    <textarea
                      className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md border-2 py-2 px-4"
                      rows="8"
                      onChange={(e) => setMessage(e.target.value)}
                      required={true}
                    ></textarea>
                  </div>
                </div>
                <ReCAPTCHA
                  sitekey="6Le9mjwcAAAAAAu37I4HaFLVI30idmZpAHgCW81K"
                  onChange={onChange}
                />

                <div className="w-full sm:col-span-6">
                  {captcha ? (
                    <button type="submit" className="button w-32">
                      Contact Us
                    </button>
                  ) : (
                    <button disabled className="button-empty w-32">
                      Contact Us
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <div className="h-screen flex justify-center align-center items-center">
                <Loader type="Puff" color="#0d5352" height={100} width={100} />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
