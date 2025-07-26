import { SubTextProps } from "@/types/ui";
import React from "react";

export default function SubText({ children }: SubTextProps) {
  return <p className="font-[500] text-gray-500 mb-7">{children}</p>;
}
