export interface Event {
    eventId: number;
    domain: string;
    eventName: string;
    venue: string;
    date: string;
    timings: string;
}

export const events: Event[] = [
    { eventId: 1, domain: "Dance", eventName: "Classical Solo Dance", venue: "Auditorium", date: "15th May", timings: "11:00 AM TO 2:00 PM" },
    { eventId: 2, domain: "Dance", eventName: "Dance Battle", venue: "Main Stage", date: "15th May", timings: "11:00 AM TO 1:00 PM" },
    { eventId: 3, domain: "Dance", eventName: "Semi Classical Group", venue: "Main Stage", date: "15th May", timings: "8:30 AM TO 11:00 AM" },
    { eventId: 4, domain: "Dance", eventName: "Western Group Dance", venue: "Main Stage", date: "15th May", timings: "2:00 PM TO 6:00 PM" },
    { eventId: 5, domain: "Dance", eventName: "Western Solo Dance", venue: "Auditorium", date: "15th May", timings: "2:00 PM TO 4:00 PM" },

    { eventId: 6, domain: "Fashion", eventName: "Group Ramp Walk", venue: "Main Stage", date: "15th May", timings: "6:00 PM TO 8:00 PM" },

    { eventId: 7, domain: "Fine Arts", eventName: "Cartooning", venue: "AIB 103", date: "14th May", timings: "8:30 AM TO 10:30 AM" },
    { eventId: 8, domain: "Fine Arts", eventName: "Clay Modelling", venue: "Civil FM Lab", date: "13th May", timings: "12:00 PM TO 2:00 PM" },
    { eventId: 9, domain: "Fine Arts", eventName: "Digital Art", venue: "AIB Lab", date: "13th May", timings: "9:00 AM TO 11:00 AM" },
    { eventId: 10, domain: "Fine Arts", eventName: "On Spot Painting", venue: "AIB 201, AIB 202", date: "14th May", timings: "2:00 PM TO 6:00 PM" },
    { eventId: 11, domain: "Fine Arts", eventName: "On Spot Photography", venue: "Main Building 416", date: "13th May", timings: "Reporting: 8:30 AM | Presentation: 1:00 PM" },
    { eventId: 12, domain: "Fine Arts", eventName: "Rangoli", venue: "NEF Entry", date: "14th May", timings: "11:00 AM TO 1:00 PM" },

    { eventId: 13, domain: "General Events", eventName: "Content Creation", venue: "Auditorium", date: "13th May", timings: "Reporting: 8:30 AM | Presentation: 1:00 PM" },
    { eventId: 14, domain: "General Events", eventName: "Radio Jockey", venue: "AIB 101", date: "13th May", timings: "2:00 PM TO 4:00 PM" },
    { eventId: 15, domain: "General Events", eventName: "Short Film", venue: "Auditorium", date: "13th May", timings: "10:00 AM TO 1:00 PM" },

    { eventId: 16, domain: "Literary", eventName: "Creative Writing", venue: "Main Building 202", date: "13th May", timings: "9:00 AM TO 11:00 AM" },
    { eventId: 17, domain: "Literary", eventName: "Debate", venue: "SJB 001", date: "13th May", timings: "3:00 PM TO 6:00 PM" },
    { eventId: 18, domain: "Literary", eventName: "Elocution", venue: "Main Building 316", date: "13th May", timings: "11:30 AM TO 1:00 PM" },
    { eventId: 19, domain: "Literary", eventName: "Poetry", venue: "Main Building 318", date: "13th May", timings: "12:00 PM TO 2:00 PM" },

    { eventId: 20, domain: "Music", eventName: "Battle of Bands", venue: "Main Stage", date: "14th May", timings: "3:00 PM TO 6:00 PM" },
    { eventId: 21, domain: "Music", eventName: "Beatboxing", venue: "AIB 402", date: "14th May", timings: "8:30 AM TO 10:30 AM" },
    { eventId: 22, domain: "Music", eventName: "Classical Vocal Solo", venue: "Auditorium", date: "14th May", timings: "8:30 AM TO 11:00 AM" },
    { eventId: 23, domain: "Music", eventName: "Instrumental Solo", venue: "AIB 402", date: "14th May", timings: "10:30 AM TO 12:00 PM" },
    { eventId: 24, domain: "Music", eventName: "Voice of Interact", venue: "Main Stage", date: "14th May", timings: "11:00 AM TO 1:00 PM" },
    { eventId: 25, domain: "Music", eventName: "Western Singing Solo", venue: "AIB 102", date: "14th May", timings: "11:00 AM TO 1:00 PM" },

    { eventId: 26, domain: "Sports", eventName: "Basketball (M & W)", venue: "Basketball Court", date: "13th May", timings: "8:00 AM TO 6:00 PM" },
    { eventId: 27, domain: "Sports", eventName: "Best Physique (M)", venue: "Quadrangle", date: "13th May", timings: "3:00 PM TO 5:00 PM" },
    { eventId: 28, domain: "Sports", eventName: "Crossfit (M & W)", venue: "Basketball Court", date: "10th May", timings: "9:00 AM TO 12:00 PM" },
    { eventId: 29, domain: "Sports", eventName: "Deadlift (M & W)", venue: "PED", date: "14th May", timings: "10:30 AM TO 5:00 PM" },
    { eventId: 31, domain: "Sports", eventName: "Short Pitch Cricket (M)", venue: "Ground 1 & 2", date: "13th, 14th & 15th May", timings: "8:00 AM TO 5:00 PM" },
    { eventId: 32, domain: "Sports", eventName: "Throwball (W)", venue: "Volleyball Court", date: "14th May", timings: "8:00 AM TO 6:00 PM" },
    { eventId: 33, domain: "Sports", eventName: "Volleyball (M & W)", venue: "Volleyball Court", date: "13th May", timings: "8:00 AM TO 6:00 PM" },

    { eventId: 34, domain: "Technical", eventName: "AI Reel Contest", venue: "Main Building 306", date: "14th May", timings: "2:00 PM TO 4:00 PM" },
    { eventId: 35, domain: "Technical", eventName: "Bits & Bytes", venue: "Main Building 202 & 203", date: "14th May", timings: "8:30 AM TO 12PM" },
    { eventId: 36, domain: "Technical", eventName: "E-Sports", venue: "AIB 301, 302 & 303", date: "13th May", timings: "10:00 AM TO 2:00 PM" },
    { eventId: 37, domain: "Technical", eventName: "Frontend Frenzy", venue: "Main Building 208", date: "13th May", timings: "11:00 AM TO 1:00 PM" },
    { eventId: 38, domain: "Technical", eventName: "Glow Up: ID Edition", venue: "Main Building 307", date: "13th May", timings: "2:00 PM TO 4:00 PM" },
    { eventId: 39, domain: "Technical", eventName: "Re-brand it & Slay it", venue: "Main Building 208", date: "14th May", timings: "2:00 PM TO 4:00 PM" },
    { eventId: 40, domain: "Technical", eventName: "ReWeb: Reverse the Website", venue: "Main Building 207 & 208", date: "14th May", timings: "11:00 AM TO 1:00 PM" },
    { eventId: 41, domain: "Technical", eventName: "Shark Tank Pitch", venue: "AIB 201 & 202", date: "13th May", timings: "8:30 AM TO 12:00 PM" },

    { eventId: 42, domain: "Theatre", eventName: "Mime", venue: "Auditorium", date: "14th May", timings: "2:00 PM TO 3:00 PM" },
    { eventId: 43, domain: "Theatre", eventName: "Mimicry", venue: "Main Building 316", date: "14th May", timings: "9:00 AM TO 11:00 AM" },
    { eventId: 44, domain: "Theatre", eventName: "Mono Acting", venue: "Main Building 309", date: "14th May", timings: "9:00 AM TO 11:00 AM" },
    { eventId: 45, domain: "Theatre", eventName: "Skit", venue: "Auditorium", date: "14th May", timings: "3:00 PM TO 6:00 PM" },

    { eventId: 46, domain: "Technical", eventName: "Capture The Flag (CTF)", venue: "Main Building Lab 1 & 2", date: "13th May", timings: "8:00 AM TO 5:00 PM" },

    { eventId: 47, domain: "Quiz", eventName: "General Quiz", venue: "Auditorium", date: "14th May", timings: "11:00 AM TO 1:00 PM" },

];

export const domains = [...new Set(events.map(e => e.domain))];

export function getEventsByDomain(domain: string): Event[] {
    return events.filter(e => e.domain === domain);
}

export function getEventsByDate(date: string): Event[] {
    return events.filter(e => e.date === date);
}

export function getEventById(id: number): Event | undefined {
    return events.find(e => e.eventId === id);
}