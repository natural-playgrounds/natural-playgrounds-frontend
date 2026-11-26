import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Router, { useRouter } from "next/router";

const Login = () => {
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== e.currentTarget.elements.password2.value) {
      toast.error("Passwords do not match.");
      return;
    }
    if (typeof router.query.token !== "string" || !router.query.token) {
      toast.error("Invalid reset link. Please request a new password reset.");
      return;
    }
    try {
      var environment =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await axios.post(`${environment}/api/forgot/confirm/`, {
        password: password,
        token: router.query.token,
      });
      if (res.status === 200) {
        toast.success("Please login with your new password.", { duration: 3000 });
        Router.push("/login");
      } else {
        toast.error("Issue resetting your password.", { duration: 3000 });
      }
    } catch (error) {
      const errors = error.response?.data?.password;
      toast.error(Array.isArray(errors) && errors.length ? errors.join(" ") : "Unable to reset your password. The link may have expired. Please request a new reset link.", { duration: 6000 });
    }
  }

  return (
    <div className="login wide-load py-12 lg:py-16 flex flex-col space-y-12">
      <div className="w-full">
        <h1 className="text-center text-4xl">Enter a new password</h1>
      </div>
      <div className="w-full max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col space-y-4">
          <div>
            <label>
              <span>Password</span>
              <input
                type="password"
                name="password"
                required
                className="input"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              <span>Repeat password</span>
              <input
                type="password"
                name="password2"
                required
                className="input"
                autoComplete="new-password"
              />
            </label>
          </div>
          <div className="flex flex-row justify-between w-full items-center space-x-0 md:space-x-4">
            <>
              <button type="submit" className="button w-1/2">
                Reset Password
              </button>
            </>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
