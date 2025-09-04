"use client";

import Image from "next/image";

interface IconProps {
  path: string | "";
  alt?: string;
}

const Icon = ({ path, alt = "alt" }: IconProps) => {
  return <Image src={path} alt={alt} width={20} height={20} />;
};

export default Icon;
