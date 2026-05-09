import { notFound } from "next/navigation";
import { eventCategories } from "@/data/eventCategories";
import { eventsList } from "@/data/eventList";
import EventDetailClient from "./EventDetailClient";
import { Metadata } from "next";

interface Props {
  params: Promise<{ eventNo: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { eventNo: eventNoStr } = await params;
  const eventNo = parseInt(eventNoStr, 10);
  
  const category = eventCategories.find((e) => e.eventNo === eventNo);
  const detail = eventsList.find((e) => e.eventNo === eventNo);

  if (!category) {
    return {
      title: "Event Not Found | GAT Interact 2026",
    };
  }

  const title = `${category.eventName} | GAT Interact 2026`;
  const description = `Join us for ${category.eventName} at GAT Interact 2026! Category: ${category.category}, Venue: ${category.venue || 'TBA'}, Date: ${category.date || 'TBA'}.`;
  
  // Construct absolute URL for the image
  let imageUrl = "https://www.gatinteract.com/og-image.jpg";
  if (detail?.image?.src) {
    imageUrl = detail.image.src.startsWith('http') 
      ? detail.image.src 
      : `https://www.gatinteract.com${detail.image.src}`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.gatinteract.com/events/${eventNo}`,
      siteName: "GAT Interact 2026",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export async function generateStaticParams() {
  return eventCategories.map((e) => ({ eventNo: String(e.eventNo) }));
}

export default async function EventDetailPage({ params }: Props) {
  const { eventNo: eventNoStr } = await params;
  const eventNo = parseInt(eventNoStr, 10);
  if (isNaN(eventNo)) notFound();

  const category = eventCategories.find((e) => e.eventNo === eventNo);
  if (!category) notFound();

  // Find matching eventList entry(ies) by eventNo mapping
  const details = eventsList.filter((e) => e.eventNo === eventNo);

  return <EventDetailClient category={category} details={details} />;
}
