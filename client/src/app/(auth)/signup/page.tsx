"use client";

import React from "react";

import { useSignup } from "@/hooks/useSignup";

import { AuthFormWrapper } from "@/components/auth/AuthFormWrapper";

export default function SignupPage() {
  const { signupSchema, defaultValues, onSubmit, isLoading } = useSignup();

  return (
    <AuthFormWrapper
      schema={signupSchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      mode={"signup"}
      isLoading={isLoading}
    />
  );
}
