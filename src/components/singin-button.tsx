"use client";

import { signIn } from "next-auth/react";
import { Button } from "./ui/button";

type Props = {
  children: React.ReactNode;
};

const SignInButton = ({ children }: Props) => {
  return <Button onClick={() => signIn("google")}>{children}</Button>;
};

export default SignInButton;
