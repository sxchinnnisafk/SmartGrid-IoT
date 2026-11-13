"use client";

import React from "react";
import AuthLayout from "../components/AuthLayout";
import AuthPortalCard from "../components/AuthPortalCard";

export default function SignInPage() {
  return (
    <AuthLayout>
      <AuthPortalCard initialMode="signin" redirectTo="/" />
    </AuthLayout>
  );
}
