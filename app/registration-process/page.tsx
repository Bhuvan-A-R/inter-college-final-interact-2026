"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowDownCircle,
  UserPlus,
  LogIn,
  List,
  User,
  CreditCard,
  CheckCircle,
  Clipboard,
  ShoppingCart,
} from "lucide-react";

interface InstructionStepProps {
  stepNumber: number;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

function InstructionStep({
  stepNumber,
  title,
  description,
  icon,
}: InstructionStepProps) {
  return (
    <div className="w-full max-w-xl bg-card border border-border rounded-lg p-6 shadow-lg transform hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center mb-4">
        {icon && <div className="mr-4 text-primary">{icon}</div>}
        <h2 className="text-2xl font-bold tracking-wide text-foreground font-display">
          Step {stepNumber}: {title}
        </h2>
      </div>
      <div className="mt-4">
        <p className="text-lg leading-relaxed text-muted-foreground font-body-out">{description}</p>
      </div>
    </div>
  );
}

const instructions = [
  {
    stepNumber: 1,
    title: "Create Account",
    description: "Begin by registering on the platform to create your personal account.",
    icon: <UserPlus className="h-10 w-10" />,
  },
  {
    stepNumber: 2,
    title: "Sign In",
    description: "Log in with your credentials to access your personalized dashboard.",
    icon: <LogIn className="h-10 w-10" />,
  },
  {
    stepNumber: 3,
    title: "Browse Events",
    description: "Explore the diverse range of events available for the festival on your dashboard.",
    icon: <List className="h-10 w-10" />,
  },
  {
    stepNumber: 4,
    title: "Join Events & Form Teams",
    description: "For solo events, add them directly to your cart. For team events, create a team and invite members using their registered email IDs. Members must accept invitations to join.",
    icon: <User className="h-10 w-10" />,
  },
  {
    stepNumber: 5,
    title: "Finalize Team Selection",
    description: "After your team is formed, return to the events page, select the event, choose your team, and add it to your cart.",
    icon: <Clipboard className="h-10 w-10" />,
  },
  {
    stepNumber: 6,
    title: "Review Cart & Proceed",
    description: "Review your selected events in the cart. Swipe the confirmation button from left to right to proceed to the order page.",
    icon: <ShoppingCart className="h-10 w-10" />,
  },
  {
    stepNumber: 7,
    title: "Complete Payment",
    description: "Verify your order details and complete the payment using the QR code displayed on the screen.",
    icon: <CreditCard className="h-10 w-10" />,
  },
  {
    stepNumber: 8,
    title: "Verification",
    description: "Our team will verify your payment. Upon successful verification, you will receive a confirmation email.",
    icon: <CheckCircle className="h-10 w-10" />,
  },
];

export default function RegistrationProcess() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-12 dot-grid mt-20">
      <h1 className="text-5xl font-extrabold mb-12 text-center tracking-wide font-display text-primary">
        Registration Process
      </h1>
      <div className="flex flex-col items-center space-y-8">
        {instructions.map((instruction, index) => (
          <React.Fragment key={instruction.stepNumber}>
            <InstructionStep {...instruction} />
            {index < instructions.length - 1 && (
              <ArrowDownCircle className="h-10 w-10 text-secondary animate-bounce" />
            )}
          </React.Fragment>
        ))}
      </div>
      {/* Bottom Navigation Buttons */}
      <div className="mt-12 flex flex-col md:flex-row md:items-center md:justify-center space-y-4 md:space-y-0 md:space-x-8">
        <Link
          href="/auth/signin"
          className="btn-primary"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}
