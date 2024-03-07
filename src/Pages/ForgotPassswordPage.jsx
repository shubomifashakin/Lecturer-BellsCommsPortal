import { useRef, useState } from "react";
import Lottie from "lottie-react";

import ForgotLottie from "../assets/forgotPasswordLottie.json";
import { ResetPassword } from "../Actions/SupabaseActions";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { InputGroup } from "../Components/InputGroup";
import { Button } from "../Components/Button";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const lottieRef = useRef(null);

  const navigate = useNavigate();

  async function handleReset(e) {
    e.preventDefault();
    if (!email) return;
    try {
      await ResetPassword(email);

      toast.success(`An reset link has been sent to ${email}`);

      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <main className="flex h-dvh w-full items-center justify-center bg-primaryBgColor px-6 py-4">
      <form
        className=" flex h-full w-full flex-col justify-center  space-y-3 rounded-sm  p-2 lg:w-1/2"
        onSubmit={handleReset}
      >
        <Lottie
          lottieRef={lottieRef}
          onMouseEnter={() => lottieRef.current.pause()}
          onMouseLeave={() => lottieRef.current.goToAndPlay(0, false)}
          className=" h-1/2"
          renderer="svg"
          autoplay={true}
          animationData={ForgotLottie}
          loop={true}
        />
        <h2 className="text-xl">Forgot Password?</h2>
        <p className="text-sm">
          Enter your email and we would send a link to reset your password.
        </p>

        <div className="w-full space-y-3">
          <InputGroup label={"Your Email"}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              className="input-style"
              onChange={(e) => setEmail(e.target.value)}
            />
          </InputGroup>

          <Button type="full" label={"Reset Password"} />

          <Link
            className="block text-center text-xs transition-colors duration-300 ease-in-out hover:text-bellsBlue"
            to={"/"}
          >
            Back to Log In
          </Link>
        </div>
      </form>
    </main>
  );
}

export default ForgotPasswordPage;
