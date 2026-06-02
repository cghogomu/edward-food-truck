import { DELIVERY_ZIPS } from "@/content/zips";

const ZONE_PATH =
  "M 215,120 L 360,118 L 395,180 L 430,250 L 445,335 L 430,420 L 400,495 L 360,560 L 250,565 L 205,490 L 185,400 L 175,315 L 185,225 Z";

const ZIP_PINS: Array<{ zip: string; cx: number; cy: number; label: string }> = [
  { zip: "78664", cx: 305, cy: 150, label: "Round Rock" },
  { zip: "78660", cx: 320, cy: 240, label: "Pflugerville" },
  { zip: "78758", cx: 285, cy: 320, label: "N. Austin" },
  { zip: "78757", cx: 240, cy: 380, label: "N. Austin" },
  { zip: "78753", cx: 330, cy: 395, label: "N. Austin" },
  { zip: "78754", cx: 365, cy: 450, label: "N. Austin" },
  { zip: "78752", cx: 290, cy: 510, label: "N. Austin" },
];

export function DeliveryAreaMap() {
  return (
    <figure className="bg-(--bg-card) border border-(--color-line) rounded-2xl p-6 sm:p-8">
      <figcaption className="mb-5">
        <p className="text-(--amber) text-xs uppercase tracking-[0.18em] font-semibold mb-2">
          Free delivery zone
        </p>
        <p className="text-(--text-soft) text-sm leading-relaxed">
          Bounded by Hwy 79 north, Hwy 290 south, Toll 130 east, and Mopac Loop 1
          west. {DELIVERY_ZIPS.size} ZIP codes covered.
        </p>
      </figcaption>

      <div className="relative aspect-square w-full max-w-md mx-auto">
        <svg
          viewBox="0 0 600 680"
          role="img"
          aria-label="Iron Oaks delivery zone map covering Round Rock, Pflugerville, and north Austin"
          className="w-full h-full"
        >
          <defs>
            <pattern
              id="hatch-out"
              patternUnits="userSpaceOnUse"
              width="10"
              height="10"
              patternTransform="rotate(45)"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="10"
                stroke="#7D766B"
                strokeOpacity="0.28"
                strokeWidth="1.25"
              />
            </pattern>
            <linearGradient id="zone-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D89A3A" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#D89A3A" stopOpacity="0.10" />
            </linearGradient>
            <mask id="outside-zone">
              <rect x="0" y="0" width="600" height="680" fill="white" />
              <path d={ZONE_PATH} fill="black" />
            </mask>
          </defs>

          {/* base */}
          <rect
            x="40"
            y="60"
            width="520"
            height="580"
            rx="8"
            fill="#1C1A17"
            stroke="#3A332B"
            strokeWidth="1"
          />

          {/* hatch outside the zone (clipped to the base rect via mask) */}
          <g mask="url(#outside-zone)">
            <rect
              x="40"
              y="60"
              width="520"
              height="580"
              fill="url(#hatch-out)"
            />
          </g>

          {/* boundary highway labels */}
          <g
            fontFamily="ui-sans-serif, system-ui, sans-serif"
            fontSize="13"
            fontWeight="600"
            fill="#B8B0A3"
            letterSpacing="1.4"
          >
            <text x="300" y="45" textAnchor="middle">HWY 79</text>
            <text x="300" y="665" textAnchor="middle">HWY 290</text>
            <text
              x="22"
              y="350"
              textAnchor="middle"
              transform="rotate(-90 22 350)"
            >
              MOPAC · LOOP 1
            </text>
            <text
              x="578"
              y="350"
              textAnchor="middle"
              transform="rotate(90 578 350)"
            >
              TOLL 130
            </text>
          </g>

          {/* boundary tick marks */}
          <g stroke="#3A332B" strokeWidth="1">
            <line x1="40" y1="60" x2="560" y2="60" />
            <line x1="40" y1="640" x2="560" y2="640" />
            <line x1="40" y1="60" x2="40" y2="640" />
            <line x1="560" y1="60" x2="560" y2="640" />
          </g>

          {/* I-35 spine reference */}
          <g>
            <line
              x1="300"
              y1="80"
              x2="300"
              y2="620"
              stroke="#3A332B"
              strokeWidth="1.5"
              strokeDasharray="4 5"
            />
            <text
              x="308"
              y="92"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
              fontSize="10"
              fill="#7D766B"
              letterSpacing="0.8"
            >
              I-35
            </text>
          </g>

          {/* delivery zone */}
          <path
            d={ZONE_PATH}
            fill="url(#zone-fill)"
            stroke="#D89A3A"
            strokeWidth="2.25"
            strokeLinejoin="round"
          />

          {/* zip pins */}
          <g
            fontFamily="ui-sans-serif, system-ui, sans-serif"
            fontWeight="600"
          >
            {ZIP_PINS.map((p) => (
              <g key={p.zip}>
                <circle cx={p.cx} cy={p.cy} r="4" fill="#D89A3A" />
                <text
                  x={p.cx + 9}
                  y={p.cy + 4}
                  fontSize="12"
                  fill="#F2EDE5"
                >
                  {p.zip}
                </text>
              </g>
            ))}
          </g>

          {/* outside-zone reference labels */}
          <g
            fontFamily="ui-sans-serif, system-ui, sans-serif"
            fontSize="11"
            fill="#7D766B"
            letterSpacing="1.2"
          >
            <text x="475" y="290" textAnchor="middle">MANOR</text>
            <text x="475" y="305" textAnchor="middle" fontSize="9">
              (not yet)
            </text>
            <text x="110" y="475" textAnchor="middle">SOUTH AUSTIN</text>
            <text x="110" y="490" textAnchor="middle" fontSize="9">
              (not yet)
            </text>
          </g>

          {/* legend */}
          <g transform="translate(60, 605)">
            <rect
              x="0"
              y="0"
              width="14"
              height="10"
              fill="url(#zone-fill)"
              stroke="#D89A3A"
              strokeWidth="1.5"
            />
            <text
              x="20"
              y="9"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
              fontSize="11"
              fill="#B8B0A3"
            >
              Free delivery
            </text>
          </g>
        </svg>
      </div>

      <ul className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-xs text-(--text-soft) font-mono">
        {[...DELIVERY_ZIPS].sort().map((zip) => (
          <li key={zip} className="tabular-nums">
            {zip}
          </li>
        ))}
      </ul>
      <p className="mt-5 text-xs text-(--text-muted) italic">
        Outside the zone? I&apos;ll still travel for large catering orders — drop
        me a line.
      </p>
    </figure>
  );
}
