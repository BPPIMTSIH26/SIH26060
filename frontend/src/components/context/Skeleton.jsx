import React from "react";

export default function Skeleton({ className = "", ...props }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 dark:bg-slate-800/80 ${className}`}
      {...props}
    />
  );
}