import React from "react";
import { Navigation } from "../app/components/navigation";
import RegionForm from "./components/RegionForm";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <div className="flex-1 flex flex-col mx-8 items-center justify-center">
        <RegionForm />
      </div>
    </div>
  );
}
