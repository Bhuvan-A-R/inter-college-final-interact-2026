"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, BedDouble, Utensils, CalendarDays, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function AccommodationPage() {
  const packages = [
    { name: "Only Accommodation", price: "Rs. 300", type: "Dormitory", icon: <BedDouble size={24} /> },
    { name: "Only Food", price: "Rs. 300", type: "Meals Only", icon: <Utensils size={24} /> },
    { name: "Accommodation + Food", price: "Rs. 500", type: "Dormitory", icon: <CheckCircle2 size={24} /> },
    { name: "Accommodation + Food", price: "Rs. 700", type: "3-Sharing Lodging Room", icon: <CheckCircle2 size={24} /> },
  ];

  const dates = [
    "13th May 2026 (10:00 AM) to 14th May 2026 (10:00 AM)",
    "14th May 2026 (10:00 AM) to 15th May 2026 (10:00 AM)",
    "15th May 2026 (10:00 AM) to 16th May 2026 (10:00 AM)",
  ];

  const rules = [
    "Accommodation will be allocated based on the availability of the slabs (Type of accommodations).",
    "Charges will be taken for one day (Check-in timings 10 a.m. to Check-out 10 a.m. next day).",
    "For only accommodation dormitory will be provided.",
    "For slab 1, 3-sharing rooms will be provided.",
    "Students should get their valid college ID.",
    "No Unauthorized guests are allowed inside the rooms.",
    "Keep valuables safe; college/hotel is not responsible for loss.",
    "Strictly no: Alcohol consumption, Smoking, Drugs or illegal substances, Loud music or disturbance.",
    "Any damage to hotel property must be paid by the student.",
    "Students should be reachable at all times.",
    "Charges are not transferable/refundable."
  ];

  // Using a placeholder Google Form link for now.
  const GOOGLE_FORM_LINK = "https://forms.gle/BmgnYJMP7s3E9wYM6"; 

  return (
    <div className="bg-gat-midnight min-h-screen text-gat-steel font-body pb-20">
      {/* Header */}
      <header className="relative pt-28 pb-16 text-center bg-gradient-to-b from-gat-midnight to-gat-midnight/80 border-b border-gat-cobalt/20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gat-gold/5 blur-[100px]"></div>
          <div className="absolute top-1/2 -left-24 w-72 h-72 rounded-full bg-gat-cobalt/10 blur-[80px]"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="text-gat-gold text-sm font-bold uppercase tracking-widest mb-4 block">Interact 2026</span>
            <h1 className="text-white font-heading font-bold text-4xl md:text-5xl lg:text-6xl mb-6">
              Accommodation & Food
            </h1>
            <p className="text-gat-steel text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Plan your stay during INTERACT 2026. Choose from our comfortable accommodation and food packages tailored for participants.
            </p>
          </motion.div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 mt-12 space-y-16">
        
        {/* Packages Section */}
        <section>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
            <h2 className="text-3xl font-heading font-bold text-white flex items-center gap-3">
              <span className="w-8 h-1 bg-gat-gold rounded-full inline-block"></span> Packages
            </h2>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            {packages.map((pkg, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-gat-gold/50 transition-colors group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 text-white/10 group-hover:text-gat-gold/20 transition-colors">
                  {pkg.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
                <p className="text-gat-steel mb-4">{pkg.type}</p>
                <div className="text-3xl font-bold text-gat-gold">{pkg.price}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Available Dates */}
        <section>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
            <h2 className="text-3xl font-heading font-bold text-white flex items-center gap-3">
              <span className="w-8 h-1 bg-gat-gold rounded-full inline-block"></span> Available Dates
            </h2>
          </motion.div>

          <div className="grid gap-4">
            {dates.map((date, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-5"
              >
                <div className="bg-gat-gold/10 p-3 rounded-lg text-gat-gold">
                  <CalendarDays size={20} />
                </div>
                <span className="text-white font-medium">{date}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Rules and Regulations */}
        <section>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
            <h2 className="text-3xl font-heading font-bold text-white flex items-center gap-3">
              <span className="w-8 h-1 bg-gat-gold rounded-full inline-block"></span> Rules and Regulations
            </h2>
          </motion.div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
            <ul className="space-y-4">
              {rules.map((rule, idx) => (
                <motion.li 
                  key={idx}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-start gap-4 text-gat-steel leading-relaxed"
                >
                  <div className="mt-1 min-w-[20px] text-gat-gold">
                    <CheckCircle2 size={18} />
                  </div>
                  <span>{rule}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }} 
          whileInView={{ opacity: 1, scale: 1 }} 
          viewport={{ once: true }}
          className="text-center py-12"
        >
          <a 
            href={GOOGLE_FORM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-gat-gold text-gat-midnight font-bold px-8 py-4 rounded-full text-lg hover:bg-white transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,204,0,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
          >
            Register via Google Forms
            <ArrowRight size={20} />
          </a>
          <p className="mt-4 text-sm text-gat-steel">
            Clicking this button will redirect you to the official registration form.
          </p>
        </motion.section>

      </main>
    </div>
  );
}
