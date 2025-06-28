import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Connected() {
  const [email, setEmail] = useState();
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  async function handleSubmit(e) {
    try {
      setIsSubmitting(true);
      e.preventDefault();
      const environment =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await axios.post(`${environment}/api/subscribe/`, {
        email: email,
      });

      if (res.status === 201) {
        toast.success("We'll be in touch soon.", { duration: 3000 });
      } else {
        setIsSubmitting(false);
        throw new Error(await res.data);
      }
    } catch (error) {
      setIsSubmitting(false);
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
    <div className="connected relative mt-8">
      <div className="flex flex-col md:flex-row py-4 wide-load space-y-8 md:space-x-8">
        <div className="w-full md:w-1/2 flex flex-col">
          <h3>Keep Connected</h3>
          <p className="font-bold">
            Stay up to date by subscribing to our newsletter.
          </p>
        </div>
        {!isSubmitting && (
          <form
            onSubmit={handleSubmit}
            className="w-full md:w-1/2 flex flex-row space-x-4 items-center"
          >
            <input
              type="email"
              name="email"
              className="input"
              id="email"
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
            ></input>
            <div>
              <button type="submit" className="button">
                Subscribe
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
