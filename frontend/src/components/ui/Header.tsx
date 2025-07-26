import { HeadersProps } from "@/types/ui";
import React from "react";

export default function Header({ children }: HeadersProps) {
  return <div className="font-bold text-3xl mb-2">{children}</div>;
}
