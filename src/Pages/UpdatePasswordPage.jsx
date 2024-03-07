import { useRef, useState } from "react";

import { useNavigate } from "react-router";

import toast from "react-hot-toast";

import { InputError, InputGroup } from "../Components/InputGroup";
import { Button } from "../Components/Button";

import { UpdatePassword } from "../Actions/SupabaseActions";

import { invalidPassword } from "../Actions/HelperActions";

function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const passwordRef = useRef(null);

  const navigate = useNavigate();

  async function handleUpdate(e) {
    e.preventDefault();

    if (!password) {
      setPasswordError("Please enter a new password");
      passwordRef.current.focus();
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+/.test(password)) {
      setPasswordError(invalidPassword);
      passwordRef.current.focus();
      return;
    }

    try {
      await UpdatePassword(password);

      toast.success("Password Changed Successfully");

      setPasswordError("");

      //leave user logged in and go to home page
      navigate("/home");
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="flex h-dvh items-center justify-center bg-primaryBgColor p-6">
      <form
        className="w-full space-y-2 rounded-sm bg-white p-4 outline outline-1 outline-stone-200 md:w-3/4 lg:w-1/2"
        onSubmit={handleUpdate}
      >
        <h2 className="text-2xl font-semibold capitalize">
          Enter your new password
        </h2>

        {passwordError ? <InputError errorMessage={passwordError} /> : null}

        <InputGroup label={"Password"}>
          <input
            ref={passwordRef}
            id="Password"
            type="password"
            className="input-style"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </InputGroup>

        <Button label={"Update Password"} type="full" />
      </form>
    </div>
  );
}

export default UpdatePasswordPage;
