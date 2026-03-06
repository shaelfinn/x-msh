import { SignUpForm } from "@/components/auth/signup";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create a new account",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
