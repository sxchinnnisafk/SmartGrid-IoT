"use client";

import React from "react";
import AuthLayout from "../components/AuthLayout";
import SignUpForm from "../components/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <AuthLayout>
      <div className="flex items-center justify-center h-full py-12 px-4">
        <SignUpForm />
      </div>
    </AuthLayout>
  );
}
