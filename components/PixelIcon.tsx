import Image from "next/image";

interface PixelIconProps {
  name: string;
  variant?: "brands" | "solid" | "regular" | "purcats";
  width?: number;
  height?: number;
  className?: string;
}

export function PixelIcon({ 
  name, 
  variant = "solid", 
  width = 24, 
  height = 24,
  className 
}: PixelIconProps) {
  const iconPath = `/icons/${variant}/${name}.svg`;
  
  return (
    <Image
      src={iconPath}
      alt={name}
      width={width}
      height={height}
      className={className}
    />
  );
}

