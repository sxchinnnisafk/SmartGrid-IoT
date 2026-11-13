"use client";

import React from "react";
import AuthLayout from "../components/AuthLayout";
import AuthPortalCard from "../components/AuthPortalCard";

export default function SignUpPage() {
  return (
    <AuthLayout>
      <AuthPortalCard initialMode="signup" redirectTo="/" />
    </AuthLayout>
  );
}
