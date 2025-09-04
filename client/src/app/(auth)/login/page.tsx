"use client";

import React from "react";

import useLogin from "@/hooks/useLogin";

import { AuthFormWrapper } from "@/components/auth/AuthFormWrapper";

export default function LoginPage() {
  const { loginSchema, onSubmit, loginDefaultValues, isLoading } = useLogin();

  return (
    <AuthFormWrapper
      schema={loginSchema}
      defaultValues={loginDefaultValues}
      onSubmit={onSubmit}
      mode={"login"}
      isLoading={isLoading}
    />
  );
}
