import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "light" | "dark";

const BASE =
  "group/btn inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-7 py-3 text-[0.95rem] font-bold transition-all duration-300 ease-doux disabled:cursor-not-allowed disabled:opacity-60";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-nuit text-lin hover:bg-argile hover:-translate-y-0.5",
  secondary: "border-2 border-nuit bg-transparent text-nuit hover:bg-nuit hover:text-lin",
  light: "border border-lin/40 text-lin hover:bg-lin hover:text-nuit",
  dark: "bg-argile text-lin hover:bg-argile-fonce hover:-translate-y-0.5",
};

export function buttonClasses(variant: Variant = "primary", className = ""): string {
  return `${BASE} ${VARIANTS[variant]} ${className}`;
}

type ButtonLinkProps = { href: string; children: ReactNode; variant?: Variant; className?: string; arrow?: boolean } & Omit<
  ComponentProps<typeof Link>,
  "href" | "className" | "children"
>;

export function ButtonLink({ href, children, variant = "primary", className = "", arrow = false, ...rest }: ButtonLinkProps) {
  return (
    <Link href={href} className={buttonClasses(variant, className)} {...rest}>
      {children}
      {arrow ? (
        <span aria-hidden="true" className="transition-transform duration-300 group-hover/btn:translate-x-1">
          →
        </span>
      ) : null}
    </Link>
  );
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant };

export function Button({ variant = "primary", className = "", type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, className)} {...rest} />;
}
