"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Send, Users, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Counts = {
  PAID_APPROVED: number;
  PAID_PENDING: number;
  NOT_PAID: number;
  TEST?: number;
};

export default function AdminEmailsPage() {
  const router = useRouter();
  const [counts, setCounts] = useState<Counts | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [category, setCategory] = useState<"PAID_APPROVED" | "PAID_PENDING" | "NOT_PAID" | "TEST">("PAID_APPROVED");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const fetchCounts = async () => {
    try {
      const res = await fetch("/api/admin/emails/send");
      const data = await res.json();
      if (res.ok) {
        setCounts({ ...data.data.counts, TEST: 1 });
      } else {
        toast.error("Failed to load recipient counts.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  const handleSend = async () => {
    if (!subject.trim() || !content.trim()) {
      toast.error("Subject and content are required.");
      return;
    }

    const recipientCount = counts?.[category] || 0;
    if (recipientCount === 0) {
      toast.error("No recipients in this category.");
      return;
    }

    if (!confirm(`Are you sure you want to send this email to ${recipientCount} recipients?`)) {
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/admin/emails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, subject, content }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(`Successfully sent to ${data.data.count} recipients!`);
        setSubject("");
        setContent("");
      } else {
        toast.error(data.error?.message || "Failed to send email.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while sending.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gat-off-white pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-gat-steel mb-1">Admin Tool</p>
          <h1 className="text-4xl font-heading font-black text-gat-midnight flex items-center gap-3">
            <Mail className="h-8 w-8 text-gat-blue" />
            Email Communicator
          </h1>
          <p className="text-gat-steel mt-2">Send bulk announcements to participants based on their registration status.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Status Cards */}
          {[
            { id: "PAID_APPROVED", label: "Paid & Approved", count: counts?.PAID_APPROVED, color: "text-green-600", bg: "bg-green-50" },
            { id: "PAID_PENDING", label: "Paid but Pending", count: counts?.PAID_PENDING, color: "text-amber-600", bg: "bg-amber-50" },
            { id: "NOT_PAID", label: "Not Paid Yet", count: counts?.NOT_PAID, color: "text-red-600", bg: "bg-red-50" },
          ].map((item) => (
            <Card 
              key={item.id} 
              className={`${category === item.id ? "ring-2 ring-gat-blue" : ""} border-none shadow-sm cursor-pointer transition-all hover:shadow-md`} 
              onClick={() => setCategory(item.id as any)}
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className={`h-12 w-12 rounded-full ${item.bg} flex items-center justify-center mb-4`}>
                  <Users className={`h-6 w-6 ${item.color}`} />
                </div>
                <p className="text-sm font-medium text-gat-steel">{item.label}</p>
                <p className="text-3xl font-black text-gat-midnight mt-1">
                  {loading ? "..." : item.count}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-none shadow-md overflow-hidden">
          <div className="bg-gat-midnight px-6 py-4 flex items-center justify-between">
            <h2 className="text-white font-bold flex items-center gap-2 font-heading tracking-wide">
              <Send className="h-4 w-4" />
              COMPOSE MESSAGE
            </h2>
            <div className="px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider">
              BCC: {counts?.[category] || 0} Recipients
            </div>
          </div>
          <CardContent className="p-8 space-y-6">
            {/* Category Selection */}
            <div className="space-y-3">
              <Label className="text-gat-midnight font-bold">Select Recipient Group</Label>
              <RadioGroup value={category} onValueChange={(v: any) => setCategory(v)} className="flex flex-col space-y-2">
                <div className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${category === "PAID_APPROVED" ? "bg-gat-blue/5 border-gat-blue/30" : "hover:bg-gat-blue/5"}`}>
                  <RadioGroupItem value="PAID_APPROVED" id="paid_approved" />
                  <Label htmlFor="paid_approved" className="flex-1 cursor-pointer">
                    <span className="font-bold block text-gat-midnight">Paid and Approved</span>
                    <span className="text-xs text-gat-steel">Send to all students who have their payment verified.</span>
                  </Label>
                </div>
                <div className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${category === "PAID_PENDING" ? "bg-gat-blue/5 border-gat-blue/30" : "hover:bg-gat-blue/5"}`}>
                  <RadioGroupItem value="PAID_PENDING" id="paid_pending" />
                  <Label htmlFor="paid_pending" className="flex-1 cursor-pointer">
                    <span className="font-bold block text-gat-midnight">Paid but Not Approved</span>
                    <span className="text-xs text-gat-steel">Send to students who have uploaded proof but are waiting for admin check.</span>
                  </Label>
                </div>
                <div className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${category === "NOT_PAID" ? "bg-gat-blue/5 border-gat-blue/30" : "hover:bg-gat-blue/5"}`}>
                  <RadioGroupItem value="NOT_PAID" id="not_paid" />
                  <Label htmlFor="not_paid" className="flex-1 cursor-pointer">
                    <span className="font-bold block text-gat-midnight">Not Paid / No Submission</span>
                    <span className="text-xs text-gat-steel">Send to everyone else (unpaid or rejected).</span>
                  </Label>
                </div>
                <div className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${category === "TEST" ? "bg-gat-blue/5 border-gat-blue/30" : "hover:bg-gat-blue/5"}`}>
                  <RadioGroupItem value="TEST" id="test_mail" />
                  <Label htmlFor="test_mail" className="flex-1 cursor-pointer">
                    <span className="font-bold block text-gat-midnight">Test (Admin Only)</span>
                    <span className="text-xs text-gat-steel">Send a test mail to <strong>interact2k26@gmail.com</strong> to check layout.</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-gat-midnight font-bold">Subject</Label>
              <Input
                id="subject"
                placeholder="Enter email subject..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="border-gat-blue/20 focus-visible:ring-gat-blue"
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="content" className="text-gat-midnight font-bold">Message Content</Label>
                <span className="text-[10px] text-gat-steel font-bold uppercase tracking-widest">Plain text format</span>
              </div>
              <Textarea
                id="content"
                placeholder="Write your message here..."
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="border-gat-blue/20 focus-visible:ring-gat-blue resize-none min-h-[200px]"
              />
            </div>

            {/* CC Info */}
            <Alert className="bg-gat-blue/5 border-gat-blue/20">
              <Info className="h-4 w-4 text-gat-blue" />
              <AlertTitle className="text-gat-blue font-bold text-xs uppercase tracking-wider">Email Configuration</AlertTitle>
              <AlertDescription className="text-xs text-gat-steel">
                All recipients will be added to <strong>BCC</strong>. A copy will be sent to <strong>interact2k26@gmail.com</strong> (CC).
              </AlertDescription>
            </Alert>

            {/* Action */}
            <div className="pt-4">
              <Button 
                onClick={handleSend} 
                disabled={sending || loading} 
                className="w-full bg-gat-blue hover:bg-gat-navy text-white font-bold h-12 text-lg shadow-lg shadow-gat-blue/20 transition-all"
              >
                {sending ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {category === "TEST" ? "Sending test mail..." : `Sending to ${counts?.[category]} recipients...`}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    {category === "TEST" ? "Send Test Mail" : "Send Email Now"}
                  </span>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <div className="mt-12 space-y-4">
          <h3 className="text-gat-midnight font-bold flex items-center gap-2 font-heading uppercase tracking-wider">
            <Info className="h-4 w-4 text-gat-blue" />
            Quick Guide
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gat-blue/10 shadow-sm">
              <p className="text-xs font-bold text-gat-midnight mb-1">Email Delivery</p>
              <p className="text-xs text-gat-steel leading-relaxed">Emails are sent in batches to ensure high deliverability and comply with server limits.</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gat-blue/10 shadow-sm">
              <p className="text-xs font-bold text-gat-midnight mb-1">Recipient Privacy</p>
              <p className="text-xs text-gat-steel leading-relaxed">Recipients cannot see each other because they are in the BCC field. Privacy is maintained.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
