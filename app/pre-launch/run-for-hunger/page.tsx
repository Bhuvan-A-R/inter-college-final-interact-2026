import React from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Medal,
  Shirt,
  Coffee,
  Music,
  Activity,
  Trophy,
  ArrowRight,
  Ticket
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Run for Hunger 4.0 | GAT INTERACT",
  description: "Participate in Run for Hunger 4.0, a pre-launch event for GAT INTERACT. Lace up. Show up. Make a difference.",
};

const RunForHungerPage = () => {
  return (
    <div className="min-h-screen bg-gat-off-white text-gat-charcoal font-body flex flex-col items-center pt-32 pb-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="dot-grid bg-[length:24px_24px] absolute inset-0 pointer-events-none opacity-50" />
      
      {/* Top Gradient */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-gat-blue/10 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 max-w-6xl flex flex-col items-center">
        
        {/* Header Section */}
        <span className="eyebrow mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gat-blue/10 text-gat-blue border border-gat-blue/20 font-bold tracking-wider text-sm uppercase shadow-blue">
          <span className="text-lg">🏃‍♂️💥</span> Run for Hunger 4.0 Is Here!
        </span>
        
        <h1 className="font-heading text-5xl md:text-7xl xl:text-8xl font-black leading-[0.95] text-center mb-6 uppercase text-gat-midnight drop-shadow-sm">
          RUN FOR HUNGER <span className="text-gat-blue">4.0</span>
        </h1>
        
        <p className="text-xl md:text-2xl font-medium max-w-2xl mx-auto text-center mb-10 text-gat-midnight/80">
          Lace up. Show up. <span className="text-gat-blue font-bold">Make a difference.</span>
        </p>

        {/* Action Button & Deadline - Top */}
        <div className="flex flex-col items-center gap-4 mb-16">
            <Link 
                href="https://linktr.ee/qr/907574c0-5e03-4c42-94d0-29ec87623b70" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center px-10 py-5 font-heading font-black text-lg text-white transition-all duration-300 bg-gat-blue rounded-full hover:bg-gat-cobalt hover:scale-105 shadow-blue"
            >
                REGISTER NOW
                <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
            </Link>
            <div className="text-sm font-bold flex items-center text-red-600 bg-red-500/10 px-5 py-2.5 rounded-full border border-red-500/20 shadow-sm backdrop-blur-sm shadow-red-500/10 animate-pulse">
                <Clock className="w-4 h-4 mr-2" />
                Registrations CLOSE on April 24th! Spots are filling fast!
            </div>
        </div>

        {/* Date, Time, Location Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-16">
            <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-white border border-gat-blue/10 backdrop-blur-md shadow-card hover:bg-gat-off-white transition-colors">
                <div className="w-14 h-14 rounded-2xl bg-gat-blue/10 text-gat-blue flex items-center justify-center mb-4">
                    <Calendar className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-black text-xl mb-1 text-gat-midnight">Date</h3>
                <p className="text-gat-steel font-medium">Sunday, May 3, 2026</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-white border border-gat-blue/10 backdrop-blur-md shadow-card hover:bg-gat-off-white transition-colors">
                <div className="w-14 h-14 rounded-2xl bg-gat-blue/10 text-gat-blue flex items-center justify-center mb-4">
                    <Clock className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-black text-xl mb-1 text-gat-midnight">Time</h3>
                <p className="text-gat-steel font-medium">Report: 6:00 AM<br/>Flag-off: 6:30 AM</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-white border border-gat-blue/10 backdrop-blur-md shadow-card hover:bg-gat-off-white transition-colors">
                <div className="w-14 h-14 rounded-2xl bg-gat-blue/10 text-gat-blue flex items-center justify-center mb-4">
                    <MapPin className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-black text-xl mb-1 text-gat-midnight">Location</h3>
                <p className="text-gat-steel font-medium">Global Academy of Technology,<br/>Bengaluru</p>
            </div>
        </div>

        {/* Two Columns: Categories vs Inclusions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-6xl">
            
            {/* Left Col: Categories & Prizes */}
            <div className="lg:col-span-7 flex flex-col gap-8">
                
                {/* Prize Pool Highlight */}
                <div className="bg-gat-gold/5 border-2 border-gat-gold/30 rounded-[2rem] p-8 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 relative overflow-hidden backdrop-blur-sm hover:border-gat-gold/50 hover:shadow-gold transition-colors">
                    <div className="absolute -right-10 -top-10 opacity-10 transform rotate-12 pointer-events-none">
                        <Trophy className="w-64 h-64 text-gat-gold" />
                    </div>
                    <div className="w-20 h-20 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0 shadow-[0_0_30px_rgba(243,195,23,0.5)] relative z-10 text-white">
                        <Trophy className="w-10 h-10" />
                    </div>
                    <div className="relative z-10 pt-1">
                        <h2 className="text-3xl sm:text-4xl font-heading font-black text-gat-dark-gold mb-2 uppercase tracking-wider">₹50,000 Prize Pool!</h2>
                        <p className="text-lg text-gat-charcoal font-medium">Win big in the <strong className="text-gat-midnight">5K Run</strong> category!</p>
                    </div>
                </div>

                {/* Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 5K Run */}
                    <div className="rounded-[2rem] border-2 border-gat-blue/10 bg-white overflow-hidden flex flex-col p-8 relative hover:border-gat-blue/40 shadow-card hover:shadow-card-hover transition-all">
                        <div className="absolute top-0 right-0 bg-gat-blue text-white text-[10px] sm:text-xs font-black px-4 py-2 rounded-bl-2xl tracking-widest shadow-sm">
                            COMPETITIVE
                        </div>
                        <h3 className="font-heading text-3xl font-black mb-3 text-gat-midnight uppercase">5K Run</h3>
                        <p className="text-gat-steel font-medium mb-8 flex-grow">Compete for the ultimate prize pool and push your physical limits to the maximum.</p>
                        
                        <div className="mt-auto">
                            <div className="flex items-baseline gap-1.5 mb-4 border-t border-gat-blue/10 pt-4">
                                <span className="text-sm font-bold text-gat-steel uppercase tracking-wider">Starting at</span>
                                <span className="text-4xl font-heading font-black text-gat-midnight">₹349</span>
                            </div>
                            <Link 
                                href="https://linktr.ee/qr/907574c0-5e03-4c42-94d0-29ec87623b70" 
                                target="_blank"
                                className="w-full block text-center py-3.5 rounded-xl bg-gat-off-white hover:bg-gat-blue/10 text-gat-midnight hover:text-gat-blue border border-gat-blue/10 hover:border-gat-blue/30 transition-all font-bold text-lg"
                            >
                                Register 5K
                            </Link>
                        </div>
                    </div>

                    {/* 3K Run */}
                    <div className="rounded-[2rem] border-2 border-gat-blue/10 bg-white overflow-hidden flex flex-col p-8 relative hover:border-gat-navy/40 shadow-card hover:shadow-navy transition-all">
                        <div className="absolute top-0 right-0 bg-gat-midnight text-white text-[10px] sm:text-xs font-black px-4 py-2 rounded-bl-2xl tracking-widest">
                            OPEN FOR ALL
                        </div>
                        <h3 className="font-heading text-3xl font-black mb-3 text-gat-midnight uppercase">3K Run</h3>
                        <p className="text-gat-steel font-medium mb-8 flex-grow">Join the fun run. Perfect for beginners and open for all ages to enjoy!</p>
                        
                        <div className="mt-auto">
                            <div className="flex items-baseline gap-1.5 mb-4 border-t border-gat-blue/10 pt-4">
                                <span className="text-4xl font-heading font-black text-gat-midnight">₹399</span>
                                <span className="text-sm font-bold text-gat-steel uppercase tracking-wider">Flat rate</span>
                            </div>
                            <Link 
                                href="https://linktr.ee/qr/907574c0-5e03-4c42-94d0-29ec87623b70" 
                                target="_blank"
                                className="w-full block text-center py-3.5 rounded-xl bg-gat-off-white hover:bg-gat-midnight/10 text-gat-midnight transition-all font-bold text-lg border border-gat-blue/10"
                            >
                                Register 3K
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Col: Inclusions */}
            <div className="lg:col-span-5">
                <div className="rounded-[2rem] border-2 border-gat-blue/10 bg-white shadow-card p-8 h-full flex flex-col relative overflow-hidden backdrop-blur-sm">
                    {/* Background blob for style */}
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-gat-blue/5 rounded-full blur-3xl pointer-events-none" />
                    
                    <h3 className="font-heading text-2xl font-black mb-8 text-gat-midnight uppercase flex items-center gap-3 border-b border-gat-blue/10 pb-6 relative z-10">
                        <Ticket className="w-7 h-7 text-gat-blue" />
                        What You Get
                    </h3>
                    
                    <ul className="space-y-6 relative z-10">
                        <li className="flex items-start gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-gat-blue/10 text-gat-blue flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-gat-blue group-hover:text-white transition-all shadow-sm group-hover:shadow-blue">
                                <Medal className="w-6 h-6" />
                            </div>
                            <div className="pt-1">
                                <h4 className="font-bold text-lg text-gat-midnight leading-tight mb-1">Finisher Medal</h4>
                                <p className="text-[15px] font-medium text-gat-steel">A beautifully crafted medal to commemorate your successful run.</p>
                            </div>
                        </li>
                        
                        <li className="flex items-start gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-gat-blue/10 text-gat-blue flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-gat-blue group-hover:text-white transition-all shadow-sm group-hover:shadow-blue">
                                <Shirt className="w-6 h-6" />
                            </div>
                            <div className="pt-1">
                                <h4 className="font-bold text-lg text-gat-midnight leading-tight mb-1">T-Shirt & Bib</h4>
                                <p className="text-[15px] font-medium text-gat-steel">Exclusive event t-shirt and your unique runner assessment bib.</p>
                            </div>
                        </li>

                        <li className="flex items-start gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-gat-blue/10 text-gat-blue flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-gat-blue group-hover:text-white transition-all shadow-sm group-hover:shadow-blue">
                                <Coffee className="w-6 h-6" />
                            </div>
                            <div className="pt-1">
                                <h4 className="font-bold text-lg text-gat-midnight leading-tight mb-1">Breakfast</h4>
                                <p className="text-[15px] font-medium text-gat-steel">Nutritious and healthy post-run meal to completely refuel your energy.</p>
                            </div>
                        </li>

                        <li className="flex items-start gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-gat-blue/10 text-gat-blue flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-gat-blue group-hover:text-white transition-all shadow-sm group-hover:shadow-blue">
                                <Music className="w-6 h-6" />
                            </div>
                            <div className="pt-1">
                                <h4 className="font-bold text-lg text-gat-midnight leading-tight mb-1">Entertainment</h4>
                                <p className="text-[15px] font-medium text-gat-steel">Warm up with Pre-Run Zumba and celebrate with our Post-Run DJ.</p>
                            </div>
                        </li>

                        <li className="flex items-start gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-gat-blue/10 text-gat-blue flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-gat-blue group-hover:text-white transition-all shadow-sm group-hover:shadow-blue">
                                <Activity className="w-6 h-6" />
                            </div>
                            <div className="pt-1">
                                <h4 className="font-bold text-lg text-gat-midnight leading-tight mb-1">Support & Certificate</h4>
                                <p className="text-[15px] font-medium text-gat-steel">On-site expert physiotherapy support and an official E-Certificate.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
};

export default RunForHungerPage;
