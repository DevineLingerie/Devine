import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "light";

const BASE =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-medium transition-colors duration-200 ease-doux disabled:cursor-not-allowed disabled:opacity-60";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-argile text-lin hover:bg-argile-fonce",
  secondary: "border border-nuit/70 text-nuit hover:border-nuit hover:bg-nuit hover:text-lin",
  light: "border border-lin/70 text-lin hover:bg-lin hover:text-nuit",
};

export function buttonClasses(variant: Variant = "primary", className = ""): string {
  return `${BASE} ${VARIANTS[variant]} ${className}`;
}

type ButtonLinkProps = { href: string; children: ReactNode; variant?: Variant; className?: string } & Omit<
  ComponentProps<typeof Link>,
  "href" | "className" | "children"
>;

export function ButtonLink({ href, children, variant = "primary", className = "", ...rest }: ButtonLinkProps) {
  return (
    <Link href={href} className={buttonClasses(variant, className)} {...rest}>
      {children}
    </Link>
  );
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant };

export function Button({ variant = "primary", className = "", type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, className)} {...rest} />;
}
