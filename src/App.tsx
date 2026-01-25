import { useState, useEffect } from "react";
import "./index.css";
import { Admin } from "./components/admin/Admin";
import { schedule, getNextEventIndex } from "./data/schedule";

// Values data
const values = [
  // Row 1 - Inheritance
  {
    id: "heaven",
    name: "On Earth as in Heaven",
    shortDesc: "The Ultimate Aim",
    category: "Inheritance",
    description: "This is the pinnacle of our pursuit—bringing heaven's reality into our everyday lives. As men of God, we partner with Him to see His kingdom come in our homes, workplaces, and communities.",
  },
  // Row 2 - Alignment
  {
    id: "growing",
    name: "Growing",
    shortDesc: "Language of Invitation",
    category: "Alignment",
    description: "Growth is the language of invitation. We're always becoming, always learning, always stretching toward who God has called us to be. Stagnation is the enemy of manhood.",
  },
  {
    id: "fruitful",
    name: "Fruitful",
    shortDesc: "Fruit that Lasts",
    category: "Alignment",
    description: "We are called to bear fruit that lasts—not just activity, but lasting impact. Our lives should produce something that outlives us and points others to Christ.",
  },
  // Row 3 - Leadership
  {
    id: "husband",
    name: "Husband",
    shortDesc: "Sacrificial Love",
    category: "Leadership",
    description: "As husbands, we are called to love sacrificially—laying down our lives for our wives as Christ did for the church. This is servant leadership at its finest.",
  },
  {
    id: "father",
    name: "Father",
    shortDesc: "Inheritance",
    category: "Leadership",
    description: "Fathers pass on an inheritance—not just material wealth, but spiritual legacy, wisdom, and identity. We shape the next generation through our presence and intentionality.",
  },
  {
    id: "worker",
    name: "Worker",
    shortDesc: "Avodah & Shamar",
    category: "Leadership",
    description: "Work is worship (avodah) and stewardship (shamar). Whether in the office, the field, or the home, our work is an act of worship and a way we tend to what God has given us.",
  },
  {
    id: "community",
    name: "Community",
    shortDesc: "Compassion",
    category: "Leadership",
    description: "We are members of our community, called to character and compassion.",
  },
  // Row 4 - Foundations
  {
    id: "intimacy",
    name: "Intimacy",
    shortDesc: "Personal Connection to the Lord",
    category: "Foundations",
    description: "Intimacy with God is the foundation of everything. Without a personal, daily connection to the Lord, everything else crumbles. This is where we hear His voice and know His heart.",
  },
  {
    id: "identity",
    name: "Identity",
    shortDesc: "What the Father Says About Me",
    category: "Foundations",
    description: "Our identity is rooted in what the Father says about us—not our performance, our past, or what others think. We are sons of God, chosen, redeemed, and loved.",
  },
  {
    id: "integrity",
    name: "Integrity",
    shortDesc: "No Matter the Cost",
    category: "Foundations",
    description: "Integrity means being the same man in every room—at home, at work, at church, online. We live with integrity no matter the cost, because our character is our testimony.",
  },
];

// Icons
const ArrowIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const AvodahLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 443 388" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 134.325 156.529 L 126.151 171 143.075 171 C 152.384 171, 160 170.704, 160 170.342 C 160 169.170, 143.837 141.999, 143.158 142.029 C 142.796 142.045, 138.821 148.570, 134.325 156.529 M 336.245 229.271 C 333.354 234.347, 329.605 240.863, 327.912 243.750 L 324.835 249 341.837 249 L 358.839 249 350.670 234.503 C 346.176 226.530, 342.275 220.015, 342 220.024 C 341.725 220.034, 339.135 224.195, 336.245 229.271 M 168.470 366.153 C 164.086 373.837, 160.350 380.546, 160.167 381.062 C 159.968 381.622, 166.525 382, 176.417 382 C 185.537 382, 193 381.680, 193 381.288 C 193 380.622, 179.973 357.489, 177.544 353.841 C 176.621 352.454, 175.130 354.476, 168.470 366.153" fill="#86c1e7" fillRule="evenodd"/>
    <path d="M 189.670 64.051 L 158.024 119.120 195.203 184.060 L 232.382 249 263.654 249 L 294.926 249 301.290 238.250 C 304.791 232.338, 312.013 220.043, 317.341 210.928 L 327.027 194.357 274.598 102.096 C 245.762 51.353, 221.977 9.644, 221.742 9.409 C 221.507 9.174, 207.075 33.763, 189.670 64.051 M 59.239 288.320 C 29.957 339.111, 6 380.855, 6 381.084 C 6 381.681, 125.864 381.065, 129.681 380.449 C 132.723 379.958, 134.425 377.206, 168.786 317.218 C 188.545 282.723, 205.178 253.600, 205.748 252.500 C 206.622 250.814, 204.327 246.258, 191.138 223.500 L 175.492 196.500 143.985 196.236 L 112.477 195.973 59.239 288.320 M 218.228 280.250 C 204.380 303.809, 191.527 326.462, 191.732 326.949 C 191.860 327.252, 198.812 339.465, 207.180 354.089 L 222.396 380.678 273.363 381.339 C 339.775 382.200, 436 382.188, 436 381.318 C 436 380.943, 421.712 356.207, 404.250 326.349 L 372.500 272.063 297.789 272.031 L 223.077 272 218.228 280.250" fill="#2c4b5b" fillRule="evenodd"/>
  </svg>
);

// Compute these once at module load
const nextEventIndex = getNextEventIndex();

export function App() {
  const [pathname, setPathname] = useState(window.location.pathname);

  // Handle browser navigation
  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Render admin page if on /admin route
  if (pathname === "/admin") {
    return <Admin />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-6 flex justify-between items-center bg-gradient-to-b from-background to-transparent">
        <div className="text-card-foreground text-sm font-bold uppercase tracking-[3px]">
          Journey Life Church
        </div>
        <a
          href="https://www.journeylifechurch.com"
          className="text-text-subtle text-xs tracking-wider hover:text-card-foreground transition-colors"
        >
          Back to JLC
        </a>
      </header>

      {/* Hero Section */}
      <section className="snap-section hero-gradient h-screen flex flex-col justify-center items-center text-center px-6 pt-32 pb-20 relative overflow-hidden">
        <p className="text-base md:text-lg uppercase tracking-[5px] text-primary mb-7 font-semibold">
          Men's Ministry
        </p>
        <h1 className="text-[clamp(32px,6vw,72px)] font-extrabold text-card-foreground leading-[1.1] mb-8 tracking-[-2px] max-w-[800px]">
          We're building a <span className="text-primary">culture</span>, not a crowd.
        </h1>
        <p className="text-base md:text-xl text-text-subtle max-w-[500px] mb-12 px-2">
          Being a man isn't once a month—it's every day, all the time. This is where we sharpen what that means, together.
        </p>
        <a
          href="#schedule"
          className="inline-flex items-center gap-3 text-primary text-sm font-semibold uppercase tracking-wider hover:gap-5 transition-all"
        >
          See the Schedule
          <ArrowIcon />
        </a>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3.5 text-card-foreground">
          <span className="text-sm uppercase tracking-[4px] font-medium">Scroll</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* Values Section */}
      <section id="values" className="snap-section min-h-screen flex items-center py-24 px-6 md:px-16">
        <div className="max-w-[1200px] mx-auto w-full">
          {/* Values Header */}
          <div className="text-center mb-16">
            <h2 className="text-base uppercase tracking-[5px] text-primary mb-5 font-semibold">
              The 10 Values of Manhood
            </h2>
          </div>

          {/* Values Content - Stacked */}
          <div className="flex flex-col items-center gap-12">
            {/* Pyramid */}
            <div className="pyramid">
              {/* Row 1 */}
              <div className="pyramid-row pyramid-row-1">
                <div className="pyramid-block">
                  <div className="block-name text-card-foreground font-semibold text-[15px] mb-1.5">On Earth as in Heaven</div>
                  <div className="block-desc text-xs text-muted-foreground">The Ultimate Aim</div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="pyramid-row pyramid-row-2">
                {["growing", "fruitful"].map(id => {
                  const value = values.find(v => v.id === id)!;
                  return (
                    <div key={id} className="pyramid-block">
                      <div className="block-name text-card-foreground font-semibold text-[15px] mb-1.5">{value.name}</div>
                      <div className="block-desc text-xs text-muted-foreground">{value.shortDesc}</div>
                    </div>
                  );
                })}
              </div>

              {/* Row 3 */}
              <div className="pyramid-row pyramid-row-3">
                {["husband", "father", "worker", "community"].map(id => {
                  const value = values.find(v => v.id === id)!;
                  return (
                    <div key={id} className="pyramid-block">
                      <div className="block-name text-card-foreground font-semibold text-[15px] mb-1.5">{value.name}</div>
                      <div className="block-desc text-xs text-muted-foreground">{value.shortDesc}</div>
                    </div>
                  );
                })}
              </div>

              {/* Row 4 */}
              <div className="pyramid-row pyramid-row-4">
                {["intimacy", "identity", "integrity"].map(id => {
                  const value = values.find(v => v.id === id)!;
                  return (
                    <div key={id} className="pyramid-block">
                      <div className="block-name text-card-foreground font-semibold text-[15px] mb-1.5">{value.name}</div>
                      <div className="block-desc text-xs text-muted-foreground">{value.shortDesc}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Values List - Categorized */}
            <div className="mobile-values w-full">
              {/* Foundations */}
              <div className="mb-6">
                <div className="text-[10px] uppercase tracking-[3px] text-primary mb-3 font-semibold">Foundations</div>
                <div className="space-y-2">
                  {["intimacy", "identity", "integrity"].map(id => {
                    const value = values.find(v => v.id === id)!;
                    return (
                      <div
                        key={id}
                        className="w-full text-left p-3 rounded-lg border bg-card border-border"
                      >
                        <div className="font-medium text-sm text-card-foreground">{value.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{value.shortDesc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Leadership */}
              <div className="mb-6">
                <div className="text-[10px] uppercase tracking-[3px] text-primary mb-3 font-semibold">Leadership</div>
                <div className="space-y-2">
                  {["husband", "father", "worker", "community"].map(id => {
                    const value = values.find(v => v.id === id)!;
                    return (
                      <div
                        key={id}
                        className="w-full text-left p-3 rounded-lg border bg-card border-border"
                      >
                        <div className="font-medium text-sm text-card-foreground">{value.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{value.shortDesc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Alignment */}
              <div className="mb-6">
                <div className="text-[10px] uppercase tracking-[3px] text-primary mb-3 font-semibold">Alignment</div>
                <div className="space-y-2">
                  {["growing", "fruitful"].map(id => {
                    const value = values.find(v => v.id === id)!;
                    return (
                      <div
                        key={id}
                        className="w-full text-left p-3 rounded-lg border bg-card border-border"
                      >
                        <div className="font-medium text-sm text-card-foreground">{value.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{value.shortDesc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Inheritance */}
              <div className="mb-6">
                <div className="text-[10px] uppercase tracking-[3px] text-primary mb-3 font-semibold">Inheritance</div>
                <div className="space-y-2">
                  {["heaven"].map(id => {
                    const value = values.find(v => v.id === id)!;
                    return (
                      <div
                        key={id}
                        className="w-full text-left p-3 rounded-lg border bg-card border-border"
                      >
                        <div className="font-medium text-sm text-card-foreground">{value.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{value.shortDesc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Value Detail Panel - Hidden for now, content preserved in values array above
            <div className="bg-card border border-border rounded-lg p-6 md:p-10 w-full max-w-[800px] text-center mx-4 md:mx-0">
              <div className="text-[11px] uppercase tracking-[3px] text-primary mb-3 font-semibold">
                {selectedValue.category}
              </div>
              <h3 className="text-2xl md:text-[28px] text-card-foreground mb-2 font-bold">
                {selectedValue.name}
              </h3>
              <p className="text-base text-text-subtle mb-4">
                {selectedValue.shortDesc}
              </p>
              <div className="text-secondary-foreground text-[15px] leading-relaxed max-w-[600px] mx-auto">
                <p>{selectedValue.description}</p>
              </div>
            </div>
            */}
          </div>
        </div>
      </section>

      {/* Quote Section - Removed for simplicity, preserved here:
      "We want to live these values so wholeheartedly that when people interact with us—at home, at Journey, at work, in our community—they experience them."
      */}

      {/* Schedule Section */}
      <section id="schedule" className="snap-section bg-muted min-h-screen py-16 md:py-24 px-4 md:px-16">
        <div className="max-w-[1200px] mx-auto">
          {/* Schedule Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 pb-4 md:pb-6 border-b border-border-muted gap-3 md:gap-4">
            <h2 className="text-3xl md:text-5xl font-extrabold text-card-foreground tracking-[-2px]">
              2026 Schedule
            </h2>
            <a
              href="/api/calendar/remaining"
              className="inline-flex items-center gap-2 px-4 py-2.5 md:px-5 md:py-3 text-xs md:text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:bg-primary-hover transition-colors"
            >
              <CalendarIcon />
              Add All to Calendar
            </a>
          </div>

          {/* Timeline */}
          <div className="timeline">
            {schedule.map((item, index) => {
              const isNext = index === nextEventIndex;
              return (
                <div key={index} className={`timeline-item ${isNext ? "next-up" : ""}`}>
                  <div className="text-right">
                    <div className="text-[10px] md:text-xs uppercase tracking-[2px] text-text-faint">{item.month}</div>
                    <div className="text-2xl md:text-3xl font-bold text-card-foreground">{item.day}</div>
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg text-card-foreground mb-1 transition-colors">
                      {item.title}
                      {isNext && (
                        <span className="inline-block bg-primary text-primary-foreground text-[9px] md:text-[10px] font-bold px-2 py-0.5 md:px-2.5 md:py-1 rounded ml-2 md:ml-3 tracking-wider align-middle">
                          NEXT UP
                        </span>
                      )}
                    </h3>
                    <p className="text-text-subtle text-xs md:text-sm">{item.description}</p>
                    <span className="inline-block text-[9px] md:text-[10px] uppercase tracking-[2px] text-primary mt-1">
                      {item.category}
                    </span>
                  </div>
                  <div className="timeline-actions">
                    <a
                      href={`/api/calendar/${index}`}
                      className="inline-flex items-center gap-1.5 md:gap-2 px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm font-semibold bg-border text-secondary-foreground border border-input rounded-md hover:bg-input hover:text-card-foreground hover:border-text-ghost transition-colors"
                    >
                      <CalendarIcon />
                      Add
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center border-t border-muted">
        <p className="text-xs text-text-ghost tracking-wider mb-4">
          <a href="https://www.journeylifechurch.com" className="text-text-faint hover:text-card-foreground transition-colors">
            Journey Life Church
          </a>
          {" · "}Men's Ministry
        </p>
        <a
          href="https://www.avodah.dev/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-text-ghost hover:text-text-faint transition-colors"
        >
          <span className="text-[10px] tracking-wider">Powered by</span>
          <AvodahLogo className="h-4 w-auto" />
        </a>
      </footer>
    </div>
  );
}

export default App;
