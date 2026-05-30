import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: number;
  priority?: boolean;
}

export default function Logo({
  className = "",
  size = 64,
  priority = false,
}: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="Om symbol — Hindu Graveyard Construction"
      width={size}
      height={size}
      priority={priority}
      className={`object-contain ${className}`}
    />
  );
}
