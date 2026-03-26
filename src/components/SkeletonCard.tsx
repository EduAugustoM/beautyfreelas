"use client";

/**
 * SkeletonCard — animated placeholder for content loading states.
 * Uses CSS shimmer animation to signal loading without layout shift.
 */

interface SkeletonCardProps {
  variant?: "profile" | "professional-card" | "appointment-row" | "service-item";
}

export default function SkeletonCard({ variant = "professional-card" }: SkeletonCardProps) {
  if (variant === "profile") {
    return (
      <div className="max-w-4xl w-full glass-strong p-12 rounded-[3rem] flex flex-col items-center gap-6">
        <div className="skeleton w-40 h-40 rounded-full" />
        <div className="skeleton h-10 w-64 rounded-xl" />
        <div className="skeleton h-4 w-80 rounded-lg" />
        <div className="skeleton h-4 w-56 rounded-lg" />
        <div className="w-full skeleton h-96 rounded-[2rem] mt-4" />
      </div>
    );
  }

  if (variant === "professional-card") {
    return (
      <div className="glass p-6 rounded-[2.5rem] flex flex-col items-center text-center border border-white/20">
        <div className="skeleton w-24 h-24 rounded-full mb-4" />
        <div className="skeleton h-6 w-36 rounded-lg mb-2" />

        <div className="skeleton h-4 w-full rounded-lg mb-2" />
        <div className="skeleton h-4 w-4/5 rounded-lg mb-6" />
        <div className="w-full pt-4 border-t border-black/5 flex items-center justify-between">
          <div className="skeleton h-6 w-14 rounded-full" />
          <div className="skeleton h-5 w-20 rounded-lg" />
        </div>
      </div>
    );
  }

  if (variant === "appointment-row") {
    return (
      <tr>
        <td className="px-6 py-5">
          <div className="skeleton h-4 w-28 rounded-lg mb-1" />
          <div className="skeleton h-3 w-20 rounded-lg" />
        </td>
        <td className="px-6 py-5">
          <div className="skeleton h-5 w-20 rounded-full" />
        </td>
        <td className="px-6 py-5">
          <div className="skeleton h-4 w-24 rounded-lg mb-1" />
          <div className="skeleton h-3 w-20 rounded-lg" />
        </td>
        <td className="px-6 py-5 text-right">
          <div className="skeleton h-5 w-20 rounded-full ml-auto" />
        </td>
      </tr>
    );
  }

  if (variant === "service-item") {
    return (
      <div className="glass p-5 rounded-2xl flex items-center justify-between border border-white/20">
        <div>
          <div className="skeleton h-5 w-32 rounded-lg mb-2" />
          <div className="skeleton h-3 w-20 rounded-lg" />
        </div>
        <div className="flex items-center gap-3">
          <div className="skeleton h-6 w-16 rounded-lg" />
          <div className="skeleton h-8 w-8 rounded-full" />
        </div>
      </div>
    );
  }

  return null;
}
