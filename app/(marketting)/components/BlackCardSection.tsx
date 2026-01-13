
export default function HowPartnershipWorks() {
    return (
        <section className="relative w-full bg-black py-24 overflow-hidden">
            {/* Subtle background glow */}
            <div className="pointer-events-none absolute inset-0">
                <div
                    className="absolute inset-0 bg-[radial-gradient(90%_45%_at_50%_0%,rgba(120,0,0,0.18),transparent_60%)] md:bg-[radial-gradient(70%_40%_at_50%_0%,rgba(120,0,0,0.22),transparent_50%)] lg:bg-[radial-gradient(60%_40%_at_50%_0%,rgba(120,0,0,0.25),transparent_45%)]" />
            </div>

            <div className="relative z-10 mx-auto max-w-6xl px-6">
                {/* Title */}
                <h2 className="text-center text-3xl md:text-4xl font-semibold text-white">
                    How the Partnership Works
                </h2>

                {/* Steps */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-16 text-center md:text-left">
                    {/* Step 01 */}
                    <div>
                        <div className="text-[#8C001A] text-6xl font-bold mb-6">
                            01
                        </div>
                        <h3 className="text-xl font-semibold text-white">
                            Apply to Partner
                        </h3>
                        <p className="mt-3 text-sm text-white/60 max-w-xs mx-auto md:mx-0">
                            Share café details with Krown
                        </p>
                    </div>

                    {/* Step 02 */}
                    <div>
                        <div className="text-[#8C001A] text-6xl font-bold mb-6">
                            02
                        </div>
                        <h3 className="text-xl font-semibold text-white">
                            Get Onboarded
                        </h3>
                        <p className="mt-3 text-sm text-white/60 max-w-xs mx-auto md:mx-0">
                            We align on experiences &amp; community fit
                        </p>
                    </div>

                    {/* Step 03 */}
                    <div>
                        <div className="text-[#8C001A] text-6xl font-bold mb-6">
                            03
                        </div>
                        <h3 className="text-xl font-semibold text-white">
                            Host Experiences
                        </h3>
                        <p className="mt-3 text-sm text-white/60 max-w-xs mx-auto md:mx-0">
                            Welcome Krown members into your space
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
