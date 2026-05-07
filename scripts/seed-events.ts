import { EventType } from '@prisma/client';
import prisma from '../lib/db';
import { eventCategories } from '../data/eventCategories';

async function main() {
  for (const eventData of eventCategories) {
    const existingEvent = await prisma.event.findFirst({
      where: { name: eventData.eventName },
    });

    if (existingEvent) {
      console.log(`Skipping existing event: ${eventData.eventName}`);
      continue;
    }

    const isTeam = eventData.maxParticipant > 1;
    const type: EventType = isTeam ? 'TEAM' : 'SOLO';

    let parsedDate: Date | null = null;
    if (eventData.date) {
      if (eventData.date.includes('13th May')) parsedDate = new Date('2026-05-13T00:00:00Z');
      else if (eventData.date.includes('14th May')) parsedDate = new Date('2026-05-14T00:00:00Z');
      else if (eventData.date.includes('15th May')) parsedDate = new Date('2026-05-15T00:00:00Z');
    }

    await prisma.event.create({
      data: {
        name: eventData.eventName,
        category: eventData.category,
        type,
        price: eventData.amount ?? 0,
        venue: eventData.venue,
        time: eventData.date ? `${eventData.date} | ${eventData.time}` : eventData.time,
        date: parsedDate,
        minTeamSize: isTeam ? (eventData.minParticipant ?? 1) : null,
        maxTeamSize: isTeam ? eventData.maxParticipant : null,
        description: `Max Participants: ${eventData.maxParticipant}`,
      },
    });

    console.log(`Created EVENT: ${eventData.eventName}`);
  }
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
