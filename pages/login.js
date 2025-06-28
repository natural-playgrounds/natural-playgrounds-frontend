import { useState } from "react";
import Router from "next/router";
import Form from "../components/userForm";
import axios from "axios";
import { login } from "../lib/auth";
import Link from "next/link";
import { useAuthState } from "../hooks/auth.js";

const Login = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const { updateIsLoggedIn, updateUserToken } = useAuthState();

  async function handleSubmit(e) {
    e.preventDefault();

    if (errorMsg) setErrorMsg("");

    const body = {
      email: e.currentTarget.email.value,
      password: e.currentTarget.password.value,
    };

    try {
      var environment =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await axios.post(`${environment}/api/auth-token/`, {
        username: e.currentTarget.email.value,
        password: e.currentTarget.password.value,
      });
      if (res.status === 200) {
        const { token } = await res.data;
        updateIsLoggedIn(true);
        updateUserToken(token);
        await login({ token });
        Router.push("/account");
      } else {
        throw new Error(await res.data);
      }
    } catch (error) {
      console.error("An unexpected error happened occurred:", error);
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
    <div className="login wide-load py-12 lg:py-16 flex flex-col space-y-6">
      <div className="w-full flex flex-col items-center">
        <h1 className="text-center text-4xl">Please sign in to continue</h1>
        <p className="mt-8">
          <span>Don&#39;t have an account,&nbsp;</span>
          <Link href="/register">
            create one here
          </Link>
          <span>.</span>
        </p>
      </div>
      <div className="w-full max-w-2xl mx-auto">
        <Form errorMessage={errorMsg} onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default Login;
