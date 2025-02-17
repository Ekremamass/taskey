import { signIn } from "next-auth/react";

const LoginButton = () => {
  return (
    <button
      className="h-12 rounded-lg bg-white font-bold px-5"
      onClick={() => signIn()}
    >
      Sign In
    </button>
  );
};
export default LoginButton;
