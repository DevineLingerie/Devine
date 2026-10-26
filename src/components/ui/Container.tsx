import type { ReactNode } from "react";

type ContainerProps = { children: ReactNode; className?: string; size?: "narrow" | "default" | "wide" | "full" };

const SIZES = { narrow: "max-w-3xl", default: "max-w-6xl", wide: "max-w-7xl", full: "max-w-none lg:px-14 xl:px-20" } as const;

export function Container({ children, className = "", size = "default" }: ContainerProps) {
  return <div className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${SIZES[size]} ${className}`}>{children}</div>;
}
