import type { ReactNode } from "react";

export function Frame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[68rem] px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}
