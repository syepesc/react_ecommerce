import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CredentialsSignUpForm from "@/components/auth/credentials-sign-up-form";

export const metadata: Metadata = {
  title: "Sign Up",
};

const SignUp = async (props: { searchParams: Promise<{ callbackUrl: string }> }) => {
  const searchParams = await props.searchParams;
  const { callbackUrl } = searchParams;
  const session = await auth();

  if (session) {
    return redirect(callbackUrl || "/");
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Link href="/" className="flex-center">
            <Image priority={true} src="/images/logo.svg" width={100} height={100} alt={`${APP_NAME} logo`} />
          </Link>
          <CardTitle className="text-center">Create Account</CardTitle>
          <CardDescription className="text-center">Enter your information below to create your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CredentialsSignUpForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;

// TODO: Add field errors under each field, not all of the errors concatenated at the bottom (current behavior).
// TODO: Do not erase the form data on error, so that the user can correct the errors without losing their input.
