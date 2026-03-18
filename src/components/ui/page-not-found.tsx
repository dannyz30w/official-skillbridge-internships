"use client";
import { useNavigate } from "react-router-dom";

export function PageNotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-xl">
        <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{ color: "#f5f5f5" }}>Oh no! You wandered off the bridge.</h1>
        <p className="text-lg mb-8" style={{ color: "rgba(245,245,245,0.85)" }}>
          This page does not exist. Let us get you back to finding your internship.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => navigate(-1)} className="btn-glass-secondary h-11 px-6">Go Back</button>
          <button onClick={() => navigate("/")} className="btn-glass-primary h-11 px-6">Go Home</button>
        </div>
      </div>
    </div>
  );
}
