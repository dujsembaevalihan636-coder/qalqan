import type { ConsequenceStep } from "@/lib/types";

const SEV: Record<ConsequenceStep["severity"], string> = {
  info: "#5FA8A0",
  warning: "#C9A227",
  danger: "#E23D3D",
};

export function ConsequenceTimeline({ steps }: { steps: ConsequenceStep[] }) {
  return (
    <div className="fade-up relative mt-8">
      <div
        className="absolute bottom-2 left-[10px] top-2 w-px"
        style={{
          background:
            "linear-gradient(to bottom, #5FA8A0, #C9A227, #E23D3D)",
          opacity: 0.35,
        }}
        aria-hidden
      />
      <ul className="space-y-8">
        {steps.map((s, i) => (
          <li
            key={i}
            className="relative pl-10 fade-up"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <span
              className="absolute left-0 top-1 flex h-[21px] w-[21px] items-center justify-center rounded-full"
              style={{
                background: "#0A0A0B",
                border: `1.5px solid ${SEV[s.severity]}`,
              }}
              aria-hidden
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: SEV[s.severity] }}
              />
            </span>
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: SEV[s.severity] }}
            >
              {s.time}
            </p>
            <p className="t-subheading mt-1 text-[#F0EBE3]">{s.event}</p>
            <p className="t-body-sm mt-1.5 max-w-xl text-[#A39E96]">{s.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
