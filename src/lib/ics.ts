// ICS calendar file generation
import {
  schedule,
  EVENT_LOCATION,
  EVENT_START_HOUR,
  EVENT_END_HOUR,
  EVENT_TIMEZONE,
  monthToNum,
  type ScheduleEvent,
} from "../data/schedule";

// Format date for ICS (YYYYMMDD)
function formatDate(year: number, month: number, day: number): string {
  const m = (month + 1).toString().padStart(2, "0");
  const d = day.toString().padStart(2, "0");
  return `${year}${m}${d}`;
}

// Format time for ICS (HHMMSS)
function formatTime(hour: number): string {
  return `${hour.toString().padStart(2, "0")}0000`;
}

// Generate a unique ID for an event
function generateUID(event: ScheduleEvent): string {
  return `${event.year}${monthToNum[event.month]}${event.day}-mens-ministry@jlc`;
}

// Escape special characters for ICS text fields
function escapeICS(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

// Generate VEVENT block for a single event
function generateVEvent(event: ScheduleEvent): string {
  const month = monthToNum[event.month];
  const dateStr = formatDate(event.year, month, event.day);
  const startTime = formatTime(EVENT_START_HOUR);
  const endTime = formatTime(EVENT_END_HOUR);

  const summary = "JLC Men's Ministry";
  const description = "Come Ready";

  return `BEGIN:VEVENT
UID:${generateUID(event)}
DTSTART;TZID=${EVENT_TIMEZONE}:${dateStr}T${startTime}
DTEND;TZID=${EVENT_TIMEZONE}:${dateStr}T${endTime}
SUMMARY:${escapeICS(summary)}
DESCRIPTION:${escapeICS(description)}
LOCATION:${escapeICS(EVENT_LOCATION)}
END:VEVENT`;
}

// Generate timezone block for America/New_York
function generateTimezone(): string {
  return `BEGIN:VTIMEZONE
TZID:America/New_York
BEGIN:STANDARD
DTSTART:20261101T020000
TZOFFSETFROM:-0400
TZOFFSETTO:-0500
TZNAME:EST
END:STANDARD
BEGIN:DAYLIGHT
DTSTART:20260308T020000
TZOFFSETFROM:-0500
TZOFFSETTO:-0400
TZNAME:EDT
END:DAYLIGHT
END:VTIMEZONE`;
}

// Generate full ICS file content
function generateICSContent(events: ScheduleEvent[]): string {
  const vevents = events.map(generateVEvent).join("\n");

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Journey Life Church//Men's Ministry 2026//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:JLC Men's Ministry 2026
${generateTimezone()}
${vevents}
END:VCALENDAR`;
}

// Generate ICS for a single event by index
export function generateSingleEventICS(eventIndex: number): string | null {
  const event = schedule[eventIndex];
  if (!event) return null;
  return generateICSContent([event]);
}

// Generate ICS for remaining events from today onwards
export function generateRemainingEventsICS(): string {
  const today = new Date();
  const remainingEvents = schedule.filter((event) => {
    const eventDate = new Date(event.year, monthToNum[event.month], event.day);
    return eventDate >= today;
  });

  if (remainingEvents.length === 0) {
    // If all events have passed, return all events
    return generateICSContent(schedule);
  }

  return generateICSContent(remainingEvents);
}

// Generate ICS for all events
export function generateAllEventsICS(): string {
  return generateICSContent(schedule);
}

// Get filename for download
export function getFilename(type: "single" | "remaining" | "all", eventIndex?: number): string {
  if (type === "single" && eventIndex !== undefined) {
    const event = schedule[eventIndex];
    if (event) {
      const slug = event.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return `jlc-mens-ministry-${event.month.toLowerCase()}-${event.day}-${slug}.ics`;
    }
  }
  return "jlc-mens-ministry-2026.ics";
}
