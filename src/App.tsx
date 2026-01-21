import { useState, useEffect } from "react";
import "./index.css";
import { Admin } from "./components/admin/Admin";
import { schedule, getNextEventIndex, getNextValueId } from "./data/schedule";

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
    id: "member",
    name: "Member",
    shortDesc: "Compassion",
    category: "Leadership",
    description: "We are members of a body, called to compassion and community. No man is meant to walk alone. We bear one another's burdens and build each other up.",
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

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

// Compute these once at module load
const nextEventIndex = getNextEventIndex();
const nextValueId = getNextValueId();

export function App() {
  const [selectedValue, setSelectedValue] = useState(values.find(v => v.id === nextValueId)!);
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
    <div className="min-h-screen bg-black text-[#e5e5e5]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-6 flex justify-between items-center bg-gradient-to-b from-black to-transparent">
        <div className="text-white text-xs font-bold uppercase tracking-[3px]">
          Journey Life Church
        </div>
        <a
          href="https://www.journeylifechurch.com"
          className="text-[#555] text-xs tracking-wider hover:text-white transition-colors"
        >
          Back to JLC
        </a>
      </header>

      {/* Hero Section */}
      <section className="snap-section hero-gradient h-screen flex flex-col justify-center items-center text-center px-6 pt-32 pb-20 relative overflow-hidden">
        <p className="text-sm uppercase tracking-[5px] text-[#3b82f6] mb-7 font-semibold">
          Men's Ministry 2026
        </p>
        <h1 className="text-[clamp(32px,6vw,72px)] font-extrabold text-white leading-[1.1] mb-8 tracking-[-2px] max-w-[800px]">
          We're building a <span className="text-[#3b82f6]">culture</span>, not a crowd.
        </h1>
        <p className="text-xl text-[#555] max-w-[500px] mb-12">
          Being a man isn't once a month—it's every day, all the time. This is where we sharpen what that means, together.
        </p>
        <a
          href="#schedule"
          className="inline-flex items-center gap-3 text-[#3b82f6] text-sm font-semibold uppercase tracking-wider hover:gap-5 transition-all"
        >
          See the Schedule
          <ArrowIcon />
        </a>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3.5 text-white">
          <span className="text-sm uppercase tracking-[4px] font-medium">Scroll</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* Values Section */}
      <section id="values" className="snap-section min-h-screen flex items-center py-24 px-6 md:px-16">
        <div className="max-w-[1200px] mx-auto w-full">
          {/* Values Header */}
          <div className="text-center mb-16">
            <h2 className="text-base uppercase tracking-[5px] text-[#3b82f6] mb-5 font-semibold">
              The 10 Values of Manhood
            </h2>
            <p className="text-xl text-[#666] font-medium leading-relaxed max-w-[700px] mx-auto">
              These anchor our gatherings and lay the foundation of our culture. We want to live them so wholeheartedly that people <em>experience</em> them.
            </p>
          </div>

          {/* Values Content - Stacked */}
          <div className="flex flex-col items-center gap-12">
            {/* Pyramid */}
            <div className="pyramid">
              {/* Row 1 */}
              <div className="pyramid-row pyramid-row-1">
                <button
                  className={`pyramid-block ${selectedValue.id === "heaven" ? "active" : ""}`}
                  onClick={() => setSelectedValue(values.find(v => v.id === "heaven")!)}
                >
                  <div className="block-name text-white font-semibold text-[15px] mb-1.5 transition-colors">On Earth as in Heaven</div>
                  <div className="block-desc text-xs text-[#666]">The Ultimate Aim</div>
                </button>
              </div>

              {/* Row 2 */}
              <div className="pyramid-row pyramid-row-2">
                {["growing", "fruitful"].map(id => {
                  const value = values.find(v => v.id === id)!;
                  return (
                    <button
                      key={id}
                      className={`pyramid-block ${selectedValue.id === id ? "active" : ""}`}
                      onClick={() => setSelectedValue(value)}
                    >
                      <div className="block-name text-white font-semibold text-[15px] mb-1.5 transition-colors">{value.name}</div>
                      <div className="block-desc text-xs text-[#666]">{value.shortDesc}</div>
                    </button>
                  );
                })}
              </div>

              {/* Row 3 */}
              <div className="pyramid-row pyramid-row-3">
                {["husband", "father", "worker", "member"].map(id => {
                  const value = values.find(v => v.id === id)!;
                  return (
                    <button
                      key={id}
                      className={`pyramid-block ${selectedValue.id === id ? "active" : ""}`}
                      onClick={() => setSelectedValue(value)}
                    >
                      <div className="block-name text-white font-semibold text-[15px] mb-1.5 transition-colors">{value.name}</div>
                      <div className="block-desc text-xs text-[#666]">{value.shortDesc}</div>
                    </button>
                  );
                })}
              </div>

              {/* Row 4 */}
              <div className="pyramid-row pyramid-row-4">
                {["intimacy", "identity", "integrity"].map(id => {
                  const value = values.find(v => v.id === id)!;
                  return (
                    <button
                      key={id}
                      className={`pyramid-block ${selectedValue.id === id ? "active" : ""}`}
                      onClick={() => setSelectedValue(value)}
                    >
                      <div className="block-name text-white font-semibold text-[15px] mb-1.5 transition-colors">{value.name}</div>
                      <div className="block-desc text-xs text-[#666]">{value.shortDesc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Value Detail Panel */}
            <div className="bg-[#080808] border border-[#1a1a1a] rounded-lg p-8 md:p-10 w-full max-w-[800px] text-center">
              <div className="text-[11px] uppercase tracking-[3px] text-[#3b82f6] mb-3 font-semibold">
                {selectedValue.category}
              </div>
              <h3 className="text-2xl md:text-[28px] text-white mb-2 font-bold">
                {selectedValue.name}
              </h3>
              <p className="text-base text-[#555] mb-4">
                {selectedValue.shortDesc}
              </p>
              <div className="text-[#888] text-[15px] leading-relaxed max-w-[600px] mx-auto">
                <p>{selectedValue.description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="snap-section h-screen flex items-center justify-center px-10">
        <p className="text-[clamp(24px,4vw,40px)] text-white font-semibold max-w-[900px] mx-auto leading-relaxed">
          "We want to live these values so wholeheartedly that when people interact with us—at home, at Journey, at work, in our community—<span className="text-[#3b82f6]">they experience them.</span>"
        </p>
      </section>

      {/* Schedule Section */}
      <section id="schedule" className="snap-section bg-[#050505] min-h-screen py-24 px-6 md:px-16">
        <div className="max-w-[1200px] mx-auto">
          {/* Schedule Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 pb-6 border-b border-[#151515] gap-4">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-[-2px]">
              2026 Schedule
            </h2>
            <a
              href="/api/calendar/remaining"
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold bg-[#3b82f6] text-white rounded-md hover:bg-[#2563eb] transition-colors"
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
                    <div className="text-xs uppercase tracking-[2px] text-[#444]">{item.month}</div>
                    <div className="text-3xl font-bold text-white">{item.day}</div>
                  </div>
                  <div>
                    <h3 className="text-lg text-white mb-1 transition-colors">
                      {item.title}
                      {isNext && (
                        <span className="inline-block bg-[#3b82f6] text-white text-[10px] font-bold px-2.5 py-1 rounded ml-3 tracking-wider align-middle">
                          NEXT UP
                        </span>
                      )}
                    </h3>
                    <p className="text-[#555] text-sm">{item.description}</p>
                    <span className="inline-block text-[10px] uppercase tracking-[2px] text-[#3b82f6] mt-1.5">
                      {item.category}
                    </span>
                  </div>
                  <div className="timeline-actions">
                    <a
                      href={`/api/calendar/${index}`}
                      className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-[#1a1a1a] text-[#888] border border-[#222] rounded-md hover:bg-[#222] hover:text-white hover:border-[#333] transition-colors"
                    >
                      <PlusIcon />
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
      <footer className="py-10 text-center border-t border-[#0a0a0a]">
        <p className="text-xs text-[#333] tracking-wider">
          <a href="https://www.journeylifechurch.com" className="text-[#444] hover:text-white transition-colors">
            Journey Life Church
          </a>
          {" · "}Men's Ministry 2026
        </p>
      </footer>
    </div>
  );
}

export default App;
