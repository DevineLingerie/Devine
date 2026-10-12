import type { ReactNode } from "react";

type ContainerProps = { children: ReactNode; className?: string; size?: "narrow" | "default" | "wide" };

const SIZES = { narrow: "max-w-3xl", default: "max-w-6xl", wide: "max-w-7xl" } as const;

export function Container({ children, className = "", size = "default" }: ContainerProps) {
  return <div className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${SIZES[size]} ${className}`}>{children}</div>;
}
