import Link from "next/link";

const Form = ({ errorMessage, onSubmit }) => (
  <form
    onSubmit={onSubmit}
    className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4"
  >
    <div>
      <label>
        <span>First Name</span>
        <input
          type="text"
          name="first_name"
          required
          className="input"
          autoComplete="given-name"
        />
      </label>
    </div>
    <div>
      <label>
        <span>Last Name</span>
        <input
          type="text"
          name="last_name"
          required
          className="input"
          autoComplete="family-name"
        />
      </label>
    </div>
    <div className="sm:col-span-2">
      <label>
        <span>Email Address</span>
        <input
          type="email"
          name="email"
          required
          className="input"
          autoComplete="email"
        />
      </label>
    </div>
    <div className="sm:col-span-2">
      <label>
        <span>Cell Number</span>
        <input
          type="tel"
          name="phone_number"
          required
          className="input"
          autoComplete="tel"
          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
        />
        <p className="text-xs">Format ###-###-####</p>
      </label>
    </div>
    <div>
      <label>
        <span>Password</span>
        <input
          type="password"
          name="password"
          required
          className="input"
          autoComplete="new-password"
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
        <button type="submit" className="button w-1/3">
          Signup
        </button>
        <Link href="/login/" className="w-1/2">
          Login to existing account?
        </Link>
      </>
    </div>

    {errorMessage && (
      <p className="p-4 bg-red-400 border-left-4 border-red-900 my-4">
        {errorMessage}
      </p>
    )}
  </form>
);

export default Form;
