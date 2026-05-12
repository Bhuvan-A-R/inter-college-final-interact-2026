"use client";

import React, { useState, useEffect, useMemo } from "react";
import QRCode from "qrcode";
import { interCollegeEvents } from "@/data/eventCategories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Search, Users, CreditCard, Info, QrCode, ArrowRight } from "lucide-react";

export default function OnSpotPaymentPage() {
  const [selectedEventId, setSelectedEventId] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");

  const selectedEvent = useMemo(() => {
    return interCollegeEvents.find((e) => e.eventName === selectedEventId);
  }, [selectedEventId]);

  const upiLink = useMemo(() => {
    if (!selectedEvent) return "";
    const amount = Number(selectedEvent.amount || 0).toFixed(2);
    const params = new URLSearchParams({
      pa: "open9035761024943@yesbank",
      pn: "Global Academy Of Technology",
      am: amount,
      cu: "INR",
      tn: `On-Spot: ${selectedEvent.eventName}`,
    });
    return `upi://pay?${params.toString()}`;
  }, [selectedEvent]);

  useEffect(() => {
    if (!upiLink) {
      setQrDataUrl("");
      return;
    }
    let active = true;
    QRCode.toDataURL(upiLink, { width: 300, margin: 1 })
      .then((url: string) => {
        if (active) setQrDataUrl(url);
      })
      .catch(() => {
        if (active) setQrDataUrl("");
      });
    return () => {
      active = false;
    };
  }, [upiLink]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-12 dot-grid mt-20">
      <div className="max-w-6xl w-full px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: SELECTION */}
        <Card className="bg-card border border-blue-200 rounded-2xl shadow-lg overflow-hidden">
          <CardHeader className="bg-blue-50 p-4 border-b border-blue-200">
            <CardTitle className="text-xl font-bold flex items-center gap-2 text-primary font-display">
              <Search className="h-5 w-5" /> SELECTION
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex flex-col gap-4">
            <p className="text-sm text-foreground">
              Choose your event from the list below:
            </p>
            <select
              className="w-full p-3 border border-blue-200 rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
            >
              <option value="">Select an event</option>
              {interCollegeEvents.map((event) => (
                <option key={event.eventName} value={event.eventName}>
                  {event.eventName}
                </option>
              ))}
            </select>
            
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex gap-3 items-start">
              <Info className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-yellow-800">
                Need to change? Just pick another event from the dropdown anytime.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: EVENT DETAILS */}
        <Card className="bg-card border border-blue-200 rounded-2xl shadow-lg overflow-hidden">
          <CardHeader className="bg-blue-50 p-4 border-b border-blue-200">
            <CardTitle className="text-xl font-bold flex items-center gap-2 text-primary font-display">
              <Info className="h-5 w-5" /> EVENT DETAILS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex flex-col gap-4">
            {selectedEvent ? (
              <>
                <span className="self-start px-3 py-1 bg-blue-100 text-xs font-bold uppercase rounded-full text-primary">
                  {selectedEvent.category}
                </span>
                <h2 className="text-3xl font-black text-foreground uppercase font-display">
                  {selectedEvent.eventName}
                </h2>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-foreground">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="font-semibold uppercase text-xs tracking-wider">Team Size</span>
                  </div>
                  <span className="font-mono font-bold text-foreground text-lg">
                    {selectedEvent.minParticipant ? `${selectedEvent.minParticipant} - ${selectedEvent.maxParticipant}` : selectedEvent.maxParticipant}
                  </span>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-foreground">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <span className="font-semibold uppercase text-xs tracking-wider">Reg. Fee</span>
                  </div>
                  <span className="font-mono font-bold text-foreground text-lg">
                    ₹{selectedEvent.amount}
                  </span>
                </div>

                <div className="border-2 border-dashed border-blue-200 rounded-xl p-4 flex flex-col items-center justify-center bg-blue-50/50 mt-4">
                  <span className="text-xs uppercase tracking-widest text-foreground font-bold mb-1">
                    Total to Pay
                  </span>
                  <span className="text-4xl font-black text-primary font-display">
                    ₹{selectedEvent.amount}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-foreground py-12">
                <Info className="h-12 w-12 mb-4 opacity-50 text-primary" />
                <p className="text-center text-sm">Select an event to view details</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card 3: PAYMENT TERMINAL */}
        <Card className="bg-card border border-blue-200 rounded-2xl shadow-lg overflow-hidden">
          <CardHeader className="bg-blue-50 p-4 border-b border-blue-200">
            <CardTitle className="text-xl font-bold flex flex-col items-center text-primary font-display">
              <div className="flex items-center gap-2">
                <QrCode className="h-5 w-5" /> Payment Terminal
              </div>
              <span className="text-xs text-primary/80 font-normal mt-1">Scan with any UPI App</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex flex-col items-center justify-between h-[calc(100%-60px)]">
            {selectedEvent && qrDataUrl ? (
              <>
                <div className="flex flex-col items-center gap-3">
                  <img
                    src={qrDataUrl}
                    alt="UPI QR code"
                    className="rounded-2xl border border-blue-100 shadow-md"
                    width={220}
                    height={220}
                  />
                  <p className="text-xs text-foreground text-center">
                    Securely powered by Zwitch Payments
                  </p>
                </div>
                
                {/* <a
                  href={upiLink}
                  className="w-full btn-primary justify-center gap-2 text-base py-3 mt-4 rounded-xl"
                >
                  PAY NOW <ArrowRight className="h-5 w-5" />
                </a> */}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-foreground py-12">
                <QrCode className="h-12 w-12 mb-4 opacity-50 text-primary" />
                <p className="text-center text-sm">Select an event to generate QR code</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-12">
        <Link href="/" className="text-sm text-foreground hover:text-primary hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
