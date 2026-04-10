import Link from "next/link";
import React from "react";

export type EventCardProps = {
  eventNo: number | null;
  eventName: string;
  category?: string | null;
  type?: string | null;
  registrationStatus?: "VERIFIED" | "SUCCESSFUL" | null;
  transactionId?: string | null;
  registrationDate?: string | null;
};

export default function EventCard({
  eventNo,
  eventName,
  category,
  type,
  registrationStatus,
  transactionId,
  registrationDate,
}: EventCardProps) {
  const href = eventNo ? `/events/${eventNo}` : "/events";
  const hasVerified =
    registrationStatus === "VERIFIED" || registrationStatus === "SUCCESSFUL";

  return (
    <Link
      href={href}
      className="group block rounded-xl border border-gat-blue/10 bg-white p-5 shadow-sm transition-all hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gat-steel">
            {category ?? "Event"}
          </p>
          <h3 className="text-lg font-heading font-black text-gat-midnight mt-1">
            {eventName}
          </h3>
          {type && <p className="text-xs text-gat-steel mt-1">{type}</p>}
        </div>
        {hasVerified && (
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-green-200 bg-green-50 text-green-700">
            Registered
          </span>
        )}
      </div>

      {hasVerified && (transactionId || registrationDate) && (
        <div className="mt-4 grid gap-1 text-xs text-gat-steel">
          {transactionId && (
            <div>
              <span className="font-semibold text-gat-midnight">Txn:</span>{" "}
              {transactionId}
            </div>
          )}
          {registrationDate && (
            <div>
              <span className="font-semibold text-gat-midnight">
                Registered:
              </span>{" "}
              {registrationDate}
            </div>
          )}
        </div>
      )}

      <p className="mt-4 text-xs font-bold text-gat-blue group-hover:text-gat-midnight">
        View details →
      </p>
    </Link>
  );
}
