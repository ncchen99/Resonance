export interface HamburgerIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function HamburgerIcon({ size = 22, color = 'currentColor', strokeWidth = 1.8 }: HamburgerIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3.4,6.6 C6.8,6.1 12.1,7.4 16.3,6.5 C18.7,6.0 20.2,6.9 20.7,6.8" />
      <path d="M3.1,12.1 C6.6,11.6 11.8,12.8 16.6,11.9 C19.1,11.4 20.3,12.2 20.9,12.0" />
      <path d="M3.5,17.5 C7.1,17.0 11.9,18.2 16.1,17.2 C18.7,16.7 20.1,17.6 20.6,17.4" />
    </svg>
  );
}
