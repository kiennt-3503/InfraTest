import Header from "@/components/Layout/Header";
import React from "react";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="relative h-screen box-border">
        <Header />
        <div className="overflow-auto box-border h-full">{children}</div>
      </div>
    </>
  );
};
