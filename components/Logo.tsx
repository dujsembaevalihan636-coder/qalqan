import Image from "next/image";

/**
 * Qalqan mark — angular geometric Q (brand asset).
 * Source PNG is black on transparent; inverted for dark UI.
 */
export function Logo({
  size = 28,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        width: size,
        height: size,
        flexShrink: 0,
        position: "relative",
        // Black mark → paper-white on dark canvas
        filter: "invert(1) brightness(1.05)",
      }}
      aria-hidden
    >
      <Image
        src="/logo-q.png"
        alt=""
        width={size}
        height={size}
        priority
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          display: "block",
        }}
      />
    </span>
  );
}
