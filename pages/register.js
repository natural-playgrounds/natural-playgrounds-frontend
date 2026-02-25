import { useState } from "react";
import Router from "next/router";
import Form from "../components/registerForm";
import axios from "axios";
import { login } from "../lib/auth";

const Login = () => {
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (errorMsg) setErrorMsg("");

    const formatFieldErrors = (data) => {
      if (!data || typeof data !== "object") return "";
      const entries = Object.entries(data).filter(
        ([key, value]) => key !== "non_field_errors" && Array.isArray(value)
      );
      if (!entries.length) return "";
      return entries
        .map(([key, value]) => `${key}: ${value.join(" ")}`)
        .join(" ");
    };

    try {
      var environment =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await axios.post(`${environment}/api/register/`, {
        email: e.currentTarget.email.value,
        first_name: e.currentTarget.first_name.value,
        last_name: e.currentTarget.last_name.value,
        password: e.currentTarget.password.value,
        password2: e.currentTarget.password2.value,
      });
      if (res.status === 201) {
        const { token } = await res.data;
        await login({ token });
        Router.push("/account");
      } else {
        throw new Error(await res.data);
      }
    } catch (error) {
      console.log(error.response);
      const responseData = error?.response?.data;
      const nonFieldError = responseData?.non_field_errors?.[0];
      const fieldErrors = formatFieldErrors(responseData);

      if (nonFieldError) {
        setErrorMsg(nonFieldError);
      } else if (fieldErrors) {
        setErrorMsg(fieldErrors);
      } else {
        setErrorMsg("Registration failed. Please check your details.");
      }
    }
  }

  return (
    <div className="login wide-load py-12 lg:py-16 flex flex-col space-y-12">
      <div className="w-full">
        <h1 className="text-center text-4xl">
          Enter Your Information Below To Create An Account
        </h1>
      </div>
      <div className="w-full max-w-2xl mx-auto">
        <Form isLogin errorMessage={errorMsg} onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default Login;
