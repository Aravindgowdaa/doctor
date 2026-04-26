import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { FiArrowRight, FiChevronRight, FiMonitor, FiStar } from "react-icons/fi";

import { getDashboardPath } from "../utils/helpers";

const steps = [
  {
    id: 1,
    eyebrow: "Step 01 / 03",
    title: "Take care of your health",
    description:
      "A calm, trustworthy onboarding moment that immediately feels premium. The card stays fixed while the content changes with smooth motion.",
    ctaLabel: "Get Started",
    accent: "from-sky-400/30 via-cyan-300/15 to-transparent",
    preview: {
      type: "image",
      src: "/reel/onboarding.jpg",
      label: "Welcome screen",
      note: "Friendly onboarding with a single clear action.",
    },
  },
  {
    id: 2,
    eyebrow: "Step 02 / 03",
    title: "Meet your care team",
    description:
      "Show credibility with a polished doctor profile preview, clear rating system, and a direct booking path that feels like a product demo.",
    ctaLabel: "Continue",
    accent: "from-violet-400/25 via-indigo-300/15 to-transparent",
    preview: {
      type: "image",
      src: "/reel/doctor-sarah.jpg",
      label: "Doctor profile",
      note: "Availability, trust signals, and conversion-focused layout.",
    },
  },
  {
    id: 3,
    eyebrow: "Step 03 / 03",
    title: "Dashboard preview",
    description:
      "Finish with a dashboard-style summary that makes the app feel real, complete, and ready to use. The final screen is a polished product tease.",
    ctaLabel: "Enter Dashboard",
    accent: "from-emerald-400/20 via-teal-300/10 to-transparent",
    preview: {
      type: "dashboard",
      label: "Final screen",
      note: "Appointments, quick actions, and progress cards.",
    },
  },
];

const MotionContent = {
  initial: { opacity: 0, x: 28 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeInOut" } },
  exit: { opacity: 0, x: -18, transition: { duration: 0.3, ease: "easeInOut" } },
};

const Home = () => {
  const user = useSelector((state) => state.auth.user);
  const [step, setStep] = useState(0);
  const current = steps[step];

  const nextHref = useMemo(() => {
    if (step < steps.length - 1) return null;
    return user ? getDashboardPath(user.role) : "/login";
  }, [step, user]);

  const advance = () => {
    setStep((currentStep) => Math.min(currentStep + 1, steps.length - 1));
  };

  const goBack = () => {
    setStep((currentStep) => Math.max(currentStep - 1, 0));
  };

  return (
    <>
      <main className="relative min-h-screen overflow-hidden bg-[#03050e] text-white flex items-center justify-center">
        {/* Animated workspace backdrop. */}
        <motion.div
          className="absolute inset-0"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(29,127,242,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(23,178,106,0.12),transparent_22%),linear-gradient(180deg,#03050e_0%,#05081a_100%)]" />
          <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:56px_56px]" />
        </motion.div>

        <motion.div
          aria-hidden="true"
          className="absolute left-[7%] top-[13%] h-72 w-[26rem] rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
          animate={{ y: [0, -14, 0], rotate: [-1, 0.5, -1] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="space-y-3">
            {["main.jsx", "App.jsx", "onboarding.jsx", "dashboard.jsx"].map((file, index) => (
              <div key={file} className="flex items-center gap-3 rounded-2xl bg-black/20 px-4 py-3">
                <div className={`h-2.5 w-2.5 rounded-full ${index === 0 ? "bg-sky-400" : index === 1 ? "bg-emerald-400" : index === 2 ? "bg-violet-400" : "bg-amber-300"}`} />
                <div className="h-2.5 w-24 rounded-full bg-white/25" />
                <div className="ml-auto h-2.5 w-16 rounded-full bg-white/10" />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          aria-hidden="true"
          className="absolute right-[9%] bottom-[11%] h-56 w-56 rounded-full bg-brand-500/15 blur-3xl"
          animate={{ scale: [1, 1.18, 1] }}
          transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.section
          className="relative z-10 w-[min(900px,calc(100vw-48px))] rounded-[24px] border border-white/10 bg-white/5 p-8 shadow-[0_24px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl lg:p-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          whileHover={{ y: -4 }}
        >
          <div className="grid min-h-[540px] gap-8 lg:grid-cols-[1.55fr_1fr]">
            <div className="flex flex-col justify-between">
              <div>
                <div className="mb-7 flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/55">
                    <FiStar className="text-brand-300" />
                    Premium onboarding
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Live motion flow
                  </div>
                </div>

                {/* Current step text transitions out and the next one slides in from the right. */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    variants={MotionContent}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="max-w-[640px]"
                  >
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/40">{current.eyebrow}</p>
                    <h1 className="mt-4 text-5xl font-black leading-[1.02] tracking-tight text-white lg:text-6xl">
                      {current.title}
                    </h1>
                    <p className="mt-5 max-w-[560px] text-base leading-8 text-white/65 lg:text-lg">
                      {current.description}
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      {nextHref ? (
                        <button
                          type="button"
                          onClick={advance}
                          className="group inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-950 shadow-[0_14px_32px_rgba(255,255,255,0.08)] transition duration-200 hover:scale-[1.05] hover:shadow-[0_18px_38px_rgba(255,255,255,0.14)]"
                        >
                          {current.ctaLabel}
                          <FiArrowRight className="ml-2 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </button>
                      ) : (
                        <Link
                          to={current.id === 3 ? nextHref || "/login" : "/signup"}
                          className="group inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-950 shadow-[0_14px_32px_rgba(255,255,255,0.08)] transition duration-200 hover:scale-[1.05] hover:shadow-[0_18px_38px_rgba(255,255,255,0.14)]"
                        >
                          {current.ctaLabel}
                          <FiArrowRight className="ml-2 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </Link>
                      )}

                      {step > 0 && (
                        <button
                          type="button"
                          onClick={goBack}
                          className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white/75 transition duration-200 hover:bg-white/10 hover:text-white"
                        >
                          Previous
                        </button>
                      )}

                      <Link
                        to={user ? getDashboardPath(user.role) : "/login"}
                        className="inline-flex items-center justify-center rounded-full border border-white/10 bg-transparent px-6 py-3 text-sm font-semibold text-white/75 transition duration-200 hover:border-white/20 hover:bg-white/5 hover:text-white"
                      >
                        Skip demo
                      </Link>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-8 grid gap-3 md:grid-cols-3">
                {[
                  ["Fast", "Zero page reloads"],
                  ["Polished", "Glass and depth"],
                  ["Responsive", "Smooth interactions"],
                ].map(([title, value]) => (
                  <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">{title}</p>
                    <p className="mt-2 text-sm font-semibold text-white/80">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side illustration panel. */}
            <motion.div
              className={`relative overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-br ${current.accent} p-4`}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_32%)]" />
              <div className="relative h-full rounded-[20px] border border-white/10 bg-[#050816]/70 p-4 backdrop-blur-xl">
                <AnimatePresence mode="wait">
                  {current.preview.type === "image" ? (
                    <motion.div
                      key={current.preview.src}
                      initial={{ opacity: 0, x: 26 }}
                      animate={{ opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeInOut" } }}
                      exit={{ opacity: 0, x: -18, transition: { duration: 0.3, ease: "easeInOut" } }}
                      className="relative h-full"
                    >
                      <div className="absolute left-4 top-4 z-10 rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/70">
                        {current.preview.label}
                      </div>
                      <img
                        src={current.preview.src}
                        alt={current.preview.label}
                        className="h-full w-full rounded-[18px] object-cover shadow-[0_18px_50px_rgba(0,0,0,0.35)]"
                      />
                      <div className="absolute inset-x-4 bottom-4 rounded-[18px] border border-white/10 bg-black/45 p-4 backdrop-blur">
                        <p className="text-sm font-semibold text-white">{current.preview.note}</p>
                        <div className="mt-3 flex items-center gap-2 text-xs text-white/55">
                          <FiMonitor />
                          <span>Desktop storyboard preview</span>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="dashboard-preview"
                      initial={{ opacity: 0, x: 26 }}
                      animate={{ opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeInOut" } }}
                      exit={{ opacity: 0, x: -18, transition: { duration: 0.3, ease: "easeInOut" } }}
                      className="flex h-full flex-col justify-between rounded-[18px] border border-white/10 bg-white/5 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">Dashboard preview</p>
                          <h3 className="mt-2 text-2xl font-bold text-white">Product-ready summary</h3>
                        </div>
                        <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold text-white/60">
                          Live
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-3">
                        {[
                          ["Appointments", "18"],
                          ["Doctor reviews", "4.9"],
                          ["Saved doctors", "24"],
                          ["Active sessions", "1.2k"],
                        ].map(([label, value]) => (
                          <div key={label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">{label}</p>
                            <p className="mt-3 text-2xl font-black text-white">{value}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-5 rounded-[18px] border border-white/10 bg-[#0a1020] p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-white">Today's flow</p>
                          <FiChevronRight className="text-white/45" />
                        </div>
                        <div className="mt-4 space-y-3">
                          {["Profile review", "Appointment booking", "Payment confirmation"].map((item, index) => (
                            <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/5 px-3 py-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white/80">
                                {index + 1}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-white">{item}</p>
                                <p className="text-xs text-white/45">Smooth, no-reload interaction</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <p className="mt-4 text-sm leading-6 text-white/60">{current.preview.note}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-6">
            <div className="flex items-center gap-2">
              {steps.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStep(index)}
                  className={`h-2.5 rounded-full transition-all duration-200 ${index === step ? "w-10 bg-white" : "w-3 bg-white/25 hover:bg-white/45"}`}
                  aria-label={`Jump to step ${index + 1}`}
                />
              ))}
            </div>
            <div className="text-sm text-white/45">
              Built for desktop onboarding demos with Framer Motion
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
};

export default Home;
