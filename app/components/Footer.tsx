"use client";

import { InstagramIcon, XIcon, LinkedinIcon } from "lucide-react";

export default function Footer() {
    return (
        <footer id="footer" className="relative bg-black text-white">
            {/* Gradient overlay */}
            <div className="pointer-events-none absolute inset-0">
                <div
                    className="absolute inset-0 bg-[radial-gradient(80%_40%_at_50%_0%,rgba(120,0,0,0.18),transparent_60%)] md:bg-[radial-gradient(60%_35%_at_50%_0%,rgba(120,0,0,0.22),transparent_55%)] lg:bg-[radial-gradient(50%_30%_at_50%_0%,rgba(120,0,0,0.25),transparent_50%)] " />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-6 pt-36 pb-24 md:pt-44 md:pb-28">
                <div className="grid grid-cols-1 gap-24 md:grid-cols-3">
                    {/* Brand */}
                    <div>
                        <h2 className="text-2xl font-semibold tracking-wide">
                            KROWN
                        </h2>

                        <p className="mt-4 max-w-sm text-base text-white/65">
                            Chennai’s exclusive café membership
                        </p>

                        <div className="mt-8 flex gap-5">
                            <SocialIcon
                                icon={<InstagramIcon className="h-6 w-6" />}
                                href="https://www.instagram.com/thekrownguy/"
                                label="Krown on Instagram"
                            />

                            <SocialIcon
                                icon={<XIcon className="h-6 w-6" />}
                                href="https://x.com/thekrownguy"
                                label="Krown on X"
                            />

                            <SocialIcon
                                icon={<LinkedinIcon className="h-6 w-6" />}
                                href="https://www.linkedin.com/company/krown-private-limited/about"
                                label="Krown on LinkedIn"
                            />
                        </div>
                    </div>

                    <FooterColumn
                        title="FOR BUSINESS"
                        links={[
                            "Partner with Us",
                            "Café Dashboard",
                            "Marketing Support",
                            "Success Stories",
                            "Partnerships",
                        ]}
                    />

                    <FooterColumn
                        title="COMPANY"
                        links={[
                            "About Us",
                            "Contact",
                            "Careers",
                            "Privacy Policy",
                            "Terms of Service",
                        ]}
                    />
                </div>

                <div className="my-20 h-px w-full bg-white/10" />

                <p className="text-center text-sm text-white/45">
                    © 2026 Krown. Built for Chennai.
                </p>
            </div>
        </footer>
    );
}

function FooterColumn({
    title,
    links,
}: {
    title: string;
    links: string[];
}) {
    return (
        <div>
            <h3 className="mb-6 text-sm font-semibold tracking-widest text-white/85">
                {title}
            </h3>

            <ul className="space-y-4 text-base text-white/65">
                {links.map((link) => (
                    <li
                        key={link}
                        className="cursor-pointer transition hover:text-white"
                    >
                        {link}
                    </li>
                ))}
            </ul>
        </div>
    );
}

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
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-white/75 transition hover:border-white/50 hover:text-white active:scale-95"
        >
            {icon}
        </a>
    );
}
