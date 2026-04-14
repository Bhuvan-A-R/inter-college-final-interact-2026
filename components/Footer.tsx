"use client";

import Image from "next/image";
import Link from "next/link";
import insta from "@/public/images/flogo2.png";
import yt from "@/public/images/flogo1.png";
import linkedin from "@/public/images/flogo4.png";

const Footer = () => {
  return (
    <footer className="bg-gat-midnight text-white pt-16 pb-24 md:pb-8 border-t border-gat-cobalt/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Brand & About */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="font-heading font-bold text-3xl tracking-wide">
                <span className="text-white">GAT</span>{" "}
                <span className="text-gat-gold">INTERACT</span>
              </span>
            </div>

            <p className="text-sm text-gat-steel font-body leading-relaxed pr-4">
              Join Global Academy of Technology for INTERACT 2026 – a
              celebration of innovation, creativity, and technology. Where Code
              Meets Culture.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/interact2026/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-gat-gold hover:border-gat-gold transition-all duration-300 group"
              >
                <Image
                  src={insta}
                  alt="Instagram"
                  width={18}
                  height={18}
                  className="brightness-0 invert opacity-70 group-hover:opacity-100 group-hover:invert-0 group-hover:brightness-100 transition-all"
                />
                <span className="text-sm font-bold text-gat-steel group-hover:text-gat-midnight transition-colors">
                  @interact2026
                </span>
              </a>
              </div>
              <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/gatbengaluru/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-gat-gold hover:border-gat-gold transition-all duration-300 group"
              >
                <Image
                  src={insta}
                  alt="Instagram"
                  width={18}
                  height={18}
                  className="brightness-0 invert opacity-70 group-hover:opacity-100 group-hover:invert-0 group-hover:brightness-100 transition-all"
                />
                <span className="text-sm font-bold text-gat-steel group-hover:text-gat-midnight transition-colors">
                  @gatbengaluru
                </span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-lg text-white mb-6 tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-3 font-body text-sm">
              <li>
                <Link
                  href="/"
                  className="text-gat-steel hover:text-gat-gold transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about/gat"
                  className="text-gat-steel hover:text-gat-gold transition-colors"
                >
                  About GAT
                </Link>
              </li>
              <li>
                <Link
                  href="/about/fest"
                  className="text-gat-steel hover:text-gat-gold transition-colors"
                >
                  About FEST
                </Link>
              </li>
              <li>
                <Link
                  href="/about/management"
                  className="text-gat-steel hover:text-gat-gold transition-colors"
                >
                  Management Team
                </Link>
              </li>
              <li>
                <Link
                  href="/about/interact-team"
                  className="text-gat-steel hover:text-gat-gold transition-colors"
                >
                  Interact Team
                </Link>
              </li>
              {/* <li>
                <Link href="/sponsors" className="text-gat-steel hover:text-gat-gold transition-colors">Sponsors</Link>
              </li> */}
              <li>
                <Link
                  href="/gallery"
                  className="text-gat-steel hover:text-gat-gold transition-colors"
                >
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Events */}
          {/* <div>
            <h3 className="font-heading font-bold text-lg text-white mb-6 tracking-wide">Events</h3>
            <ul className="space-y-3 font-body text-sm">
              <li>
                <Link href="/events?category=technical" className="text-gat-steel hover:text-gat-gold transition-colors">Technical Events</Link>
              </li>
              <li>
                <Link href="/events?category=cultural" className="text-gat-steel hover:text-gat-gold transition-colors">Cultural Events</Link>
              </li>
              <li>
                <Link href="/events?category=workshop" className="text-gat-steel hover:text-gat-gold transition-colors">Workshops</Link>
              </li>
              <li>
                <Link href="/events?category=gaming" className="text-gat-steel hover:text-gat-gold transition-colors">Gaming</Link>
              </li>
              <li>
                <Link href="/schedule" className="text-gat-steel hover:text-gat-gold transition-colors">Full Schedule</Link>
              </li>
            </ul>
          </div> */}

          {/* Column 3: Contact - Website Issues */}
          <div>
            <h3 className="font-heading font-bold text-lg text-white mb-1 tracking-wide">
              Website Issues
            </h3>
            <ul className="space-y-3 font-body text-sm text-gat-steel">
              <li className="text-gat-gold">
                Bhuvan A R <br />
                <a
                  href="callto:+91 83174 62097"
                  className="text-gat-steel hover:text-gat-gold transition-colors"
                >
                  +91 83174 62097
                </a>
              </li>
            </ul>

            <h3 className="font-heading font-bold text-lg text-white mt-3 mb-1 tracking-wide">
              Event Issues
            </h3>
            <ul className="space-y-2 font-body text-sm text-gat-steel">
              <li className="text-gat-gold">
                Cultural Coordinator <br />
                <a
                  href="callto:+91 95380 06513"
                  className="text-gat-steel hover:text-gat-gold transition-colors"
                >
                  Sohan S K - +91 95380 06513
                </a>
              </li>
              <li className="text-gat-gold">
                Technical Coordinator <br />
                <a
                  href="callto:+91 83174 62097"
                  className="text-gat-steel hover:text-gat-gold transition-colors"
                >
                  Aditi Rajesh - +91 81479 53199
                </a>
              </li>
              <li className="text-gat-gold">
                Sports Coordinator <br />
                <a
                  href="callto:+91 97400 35208"
                  className="text-gat-steel hover:text-gat-gold transition-colors"
                >
                  Sharath - +91 97400 35208
                </a>
              </li>
            </ul>

            <h3 className="font-heading font-bold text-lg text-white mt-6 mb-4 tracking-wide">
              Email Us:{" "}
              <a
                href="mailto:noreply@gatinteract.com"
                className="space-y-2 font-body text-sm text-gat-steel hover:text-gat-gold transition-colors"
              >
                noreply@gatinteract.com
              </a>
            </h3>
          </div>

          {/* Column 5: Legal & Contact */}
          {/* <div>
            <h3 className="font-heading font-bold text-lg text-white mb-6 tracking-wide">
              Legal
            </h3>
            <ul className="space-y-3 font-body text-sm mb-8">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gat-steel hover:text-gat-gold transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-services"
                  className="text-gat-steel hover:text-gat-gold transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-widest border border-gat-steel/20 bg-white/5 text-gat-steel hover:text-white hover:border-gat-gold hover:bg-gat-gold/10 rounded-lg transition-all duration-200"
            >
              ↑ Back to Top
            </button>
          </div> */}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gat-cobalt/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gat-steel font-body">
            Copyright © 2026 Global Academy of Technology · All Rights Reserved.
          </p>
          <p className="text-xs text-gat-steel font-body">
            Developed with ♥ by the Interact 2026 Website Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
