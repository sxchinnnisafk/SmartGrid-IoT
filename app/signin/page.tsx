"use client";

import React from "react";
import AuthLayout from "../components/AuthLayout";
import SignInForm from "../components/auth/SignInForm";

export default function SignInPage() {
  return (
    <AuthLayout>
      <div className="flex items-center justify-center h-full py-12 px-4">
        <SignInForm />
      </div>
    </AuthLayout>
  );
}
