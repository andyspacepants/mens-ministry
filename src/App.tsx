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
        <p className="text-xs text-text-ghost tracking-wider">
          <a href="https://www.journeylifechurch.com" className="text-text-faint hover:text-card-foreground transition-colors">
            Journey Life Church
          </a>
          {" · "}Men's Ministry
        </p>
      </footer>
    </div>
  );
}

export default App;
