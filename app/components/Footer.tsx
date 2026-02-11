"use client";

import {
    InstagramIcon,
    LinkedinIcon,
    Facebook,
    Youtube,
    Mail,
    Phone,
} from "lucide-react";

export default function Footer() {
    return (
        <footer className="relative bg-black text-white overflow-hidden">
            {/* Ambient glow */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(70%_35%_at_50%_0%,rgba(120,0,0,0.22),transparent_60%)]" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-6 pt-28 pb-20">
                {/* TOP */}
                <div className="grid grid-cols-1 gap-16 md:grid-cols-2 items-start">
                    {/* Brand */}
                    <div>
                        <h2 className="text-3xl font-semibold tracking-wide">KROWN</h2>

                        <p className="mt-4 max-w-sm text-white/65 leading-relaxed">
                            Chennai’s exclusive café membership.
                            <br />
                            Early access. Invite only.
                        </p>

                        {/* Socials */}
                        <div className="mt-8 flex gap-4">
                            <SocialIcon
                                icon={<InstagramIcon className="h-5 w-5" />}
                                href="https://www.instagram.com/krownpass/"
                                label="Instagram"
                            />
                            <SocialIcon
                                icon={<Facebook className="h-5 w-5" />}
                                href="https://facebook.com"
                                label="Facebook"
                            />
                            <SocialIcon
                                icon={<LinkedinIcon className="h-5 w-5" />}
                                href="https://www.linkedin.com/company/krown-private-limited"
                                label="LinkedIn"
                            />
                            <SocialIcon
                                icon={<Youtube className="h-5 w-5" />}
                                href="https://youtube.com"
                                label="YouTube"
                            />

                        </div>
                        <div className="mt-8 flex flex-col gap-2 text-sm text-white/50">
                            <a
                                href="https://www.termsfeed.com/live/dc53b9dd-8387-407b-be28-e8c53292a7c4"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-white transition"
                            >
                                Terms & Conditions
                            </a>

                            <a
                                href="https://www.termsfeed.com/live/069258b4-4adc-4b41-95f2-cf9d8095cb27"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-white transition"
                            >
                                Privacy Policy
                            </a>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="md:text-right">
                        <p className="text-xs uppercase tracking-widest text-white/45">
                            Reach us
                        </p>

                        <div className="mt-6 space-y-4 text-sm">
                            <a
                                href="mailto:hello@krownpass.com"
                                className="flex md:justify-end items-center gap-3 text-white/70 hover:text-white transition"
                            >
                                <Mail className="h-4 w-4" />
                                info@krownpass.com
                            </a>

                            <a
                                href="tel:+917305138391"
                                className="flex md:justify-end items-center gap-3 text-white/70 hover:text-white transition"
                            >
                                <Phone className="h-4 w-4" />
                                +91 73051 38391
                            </a>
                        </div>

                        <p className="mt-6 text-sm text-white/45 max-w-xs md:ml-auto">
                            For partnerships, cafés, or early access enquiries.
                        </p>
                    </div>
                </div>

                {/* Divider */}
                <div className="my-20 h-px w-full bg-white/10" />

                {/* Bottom */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/45">
                    <span>© 2026 Krown Built for Chennai</span>
                </div>
            </div>
        </footer>
    );
}

/* ---------------- Helpers ---------------- */

function SocialIcon({
    icon,
    href,
    label,
}: {
    icon: React.ReactNode;
    href: string;
    label: string;
}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white/70 transition hover:border-white/50 hover:text-white active:scale-95"
        >
            {icon}
        </a>
    );
}
