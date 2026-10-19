import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "light" | "dark" | "creme";

const BASE =
  "group/btn inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-7 py-3 text-[0.95rem] font-semibold tracking-wide transition-all duration-300 ease-doux disabled:cursor-not-allowed disabled:opacity-60";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-argile text-lin shadow-[0_14px_30px_-14px_rgba(138,40,70,0.8)] hover:bg-argile-fonce",
  secondary: "btn-secondaire border border-nuit/40 bg-transparent text-nuit hover:border-nuit hover:bg-nuit hover:text-lin",
  light: "border border-lin/50 text-lin hover:bg-lin hover:text-nuit",
  dark: "bg-nuit text-lin hover:bg-nuit-doux",
  creme: "bg-lin text-nuit shadow-[0_14px_40px_-12px_rgba(244,183,156,0.55)] hover:bg-sable",
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
