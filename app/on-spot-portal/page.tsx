"use client";

import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { QrCode, ExternalLink, ArrowRight, Sparkles } from "lucide-react";

export default function OnSpotPortalPage() {
  const [qrDay1, setQrDay1] = useState("");
  const [qrDay2, setQrDay2] = useState("");

  const day1FormUrl = "https://forms.gle/ppz7EoZgq8tqGpXF6";
  const day2FormUrl = "https://forms.gle/placeholderDay2";

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(day1FormUrl, { width: 200, margin: 1 })
      .then((url: string) => {
        if (active) setQrDay1(url);
      });
    QRCode.toDataURL(day2FormUrl, { width: 200, margin: 1 })
      .then((url: string) => {
        if (active) setQrDay2(url);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-12 dot-grid mt-20">
      <div className="max-w-4xl w-full px-4 flex flex-col items-center">
        
        {/* Badge */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-full px-4 py-1.5 flex items-center gap-2 mb-6 shadow-sm">
          <Sparkles className="h-4 w-4 text-yellow-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-yellow-700">Quick Registration</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-black text-center tracking-tight font-display text-primary uppercase mb-3">
          On-Spot Portal
        </h1>
        <p className="text-center text-muted-foreground mb-12">
          Scan the QR code or click the button to register for events.
        </p>

        {/* Links / Cards */}
        <div className="w-full space-y-6">
          
          {/* Payment Link (No QR code needed on this page, links to the payment page) */}
          <Link href="/on-spot-registration-payment" className="block">
            <div className="bg-card border border-blue-200 rounded-2xl p-5 flex items-center justify-between hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                  <QrCode className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    INTERACT 2026 – Event Payment Details
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Generate QR code for event-wise payments
                  </p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Day 1 Registration */}
          <div className="bg-card border border-blue-200 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 hover:shadow-lg transition-shadow">
            <div className="flex-1 flex flex-col gap-2">
              <h2 className="text-xl font-bold text-foreground">
                INTERACT 2026 – On Spot Registration - DAY - 01
              </h2>
              <p className="text-sm text-muted-foreground">
                Scan the QR code or click the button to open the registration form for Day 1.
              </p>
              <a
                href={day1FormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-2 self-start flex items-center gap-2"
              >
                Open Form <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            {qrDay1 ? (
              <div className="bg-white p-2 rounded-xl border border-blue-100 shadow-sm flex-shrink-0">
                <img src={qrDay1} alt="Day 1 Form QR" width={150} height={150} className="rounded-lg" />
              </div>
            ) : (
              <div className="w-[150px] h-[150px] bg-blue-50/50 rounded-xl border border-dashed border-blue-200 flex items-center justify-center flex-shrink-0">
                <span className="text-xs text-muted-foreground">Generating QR…</span>
              </div>
            )}
          </div>

          {/* Day 2 Registration */}
          {/* <div className="bg-card border border-blue-200 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 hover:shadow-lg transition-shadow">
            <div className="flex-1 flex flex-col gap-2">
              <h2 className="text-xl font-bold text-foreground">
                INTERACT 2026 – On Spot Registration - DAY - 02
              </h2>
              <p className="text-sm text-muted-foreground">
                Scan the QR code or click the button to open the registration form for Day 2.
              </p>
              <a
                href={day2FormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-2 self-start flex items-center gap-2"
              >
                Open Form <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            {qrDay2 ? (
              <div className="bg-white p-2 rounded-xl border border-blue-100 shadow-sm flex-shrink-0">
                <img src={qrDay2} alt="Day 2 Form QR" width={150} height={150} className="rounded-lg" />
              </div>
            ) : (
              <div className="w-[150px] h-[150px] bg-blue-50/50 rounded-xl border border-dashed border-blue-200 flex items-center justify-center flex-shrink-0">
                <span className="text-xs text-muted-foreground">Generating QR…</span>
              </div>
            )}
          </div> */}

        </div>

        <p className="text-xs text-muted-foreground mt-8 text-center">
          Clicking a button will redirect you to the registration page or form.
        </p>

        <div className="mt-12">
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
