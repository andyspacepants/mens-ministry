// Shared schedule data for 2026 Men's Ministry
// Used by: frontend display, ICS generation, admin view

export interface ScheduleEvent {
  month: string;
  day: number;
  year: number;
  title: string;
  description: string;
  category: string;
  valueId: string | null;
}

export const schedule: ScheduleEvent[] = [
  { month: "Feb", day: 21, year: 2026, title: "Vision & Invitation", description: "The year begins. Dream about what 2026 could be.", category: "Kickoff", valueId: null },
  { month: "Mar", day: 21, year: 2026, title: "Intimacy", description: "I have a personal connection to the Lord", category: "Foundations", valueId: "intimacy" },
  { month: "Apr", day: 18, year: 2026, title: "Identity", description: "I know what the Father says about me", category: "Foundations", valueId: "identity" },
  { month: "May", day: 16, year: 2026, title: "Integrity", description: "I live with integrity no matter the cost", category: "Foundations", valueId: "integrity" },
  { month: "Jun", day: 13, year: 2026, title: "Husband", description: "Sacrificial Love", category: "Leadership", valueId: "husband" },
  { month: "Jul", day: 18, year: 2026, title: "Father", description: "Inheritance", category: "Leadership", valueId: "father" },
  { month: "Aug", day: 15, year: 2026, title: "Worker", description: "Avodah & Shamar", category: "Leadership", valueId: "worker" },
  { month: "Sep", day: 19, year: 2026, title: "Member", description: "Compassion", category: "Leadership", valueId: "member" },
  { month: "Oct", day: 17, year: 2026, title: "Growing", description: "Language of Invitation", category: "Alignment", valueId: "growing" },
  { month: "Nov", day: 14, year: 2026, title: "Fruitful", description: "Fruit that lasts", category: "Alignment", valueId: "fruitful" },
  { month: "Dec", day: 12, year: 2026, title: "On Earth as in Heaven", description: "The ultimate aim", category: "Inheritance", valueId: "heaven" },
];

// Event constants
export const EVENT_LOCATION = "2289 Cedar St. Holt, MI 48842";
export const EVENT_START_HOUR = 9; // 9:00 AM
export const EVENT_END_HOUR = 11; // 11:00 AM
export const EVENT_TIMEZONE = "America/New_York";

// Helper to convert month name to number (0-indexed)
export const monthToNum: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
};

// Find the next upcoming event index
export function getNextEventIndex(): number {
  const today = new Date();
  for (let i = 0; i < schedule.length; i++) {
    const event = schedule[i];
    const eventDate = new Date(event.year, monthToNum[event.month], event.day);
    if (eventDate >= today) {
      return i;
    }
  }
  return schedule.length - 1;
}

// Find the next value-based event (excludes kickoff)
export function getNextValueId(): string {
  const today = new Date();
  for (const event of schedule) {
    const eventDate = new Date(event.year, monthToNum[event.month], event.day);
    if (eventDate >= today && event.valueId) {
      return event.valueId;
    }
  }
  return "intimacy";
}
