import Link from "next/link";
import DiscoveryStepIcon from "@/components/home/DiscoveryStepIcon";
import { discoveryReport, discoverySteps } from "@/data/site";

function CheckIcon() {
  return (
    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-retim-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function DiscoveryProcessSection() {
  return (
    <section className="discovery-process relative overflow-hidden border-b border-white/5 py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[#121a26]" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(232, 93, 4, 0.12) 0%, transparent 60%)",
        }}
        aria-hidden
      />
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-[0.07]" aria-hidden />

      <div className="container-main relative">
        <div className="mb-10 text-center md:mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-retim-orange">
            Keşif Süreci
          </p>
          <h2 className="mx-auto mt-3 max-w-3xl font-serif text-3xl font-bold tracking-tight text-white md:text-4xl">
            Teknoloji Destekli Ücretsiz Bina Keşfi
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-400">
            Drone, termal kamera ve yapısal test yöntemleriyle binanızı iskele kurmadan analiz
            ediyoruz.
          </p>
        </div>

        <div className="discovery-step-indicator mx-auto mb-10 flex max-w-lg items-center justify-center md:mb-14">
          {discoverySteps.map((step, index) => (
            <div key={step.step} className="flex flex-1 items-center last:flex-none">
              <div
                className="discovery-step-badge flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border-2 border-retim-orange bg-retim-orange/10 text-sm font-bold text-retim-orange shadow-[0_0_24px_-4px_rgba(232,93,4,0.45)]"
                aria-label={`Adım ${step.step}`}
              >
                {step.step}
              </div>
              {index < discoverySteps.length - 1 && (
                <div className="discovery-step-line mx-2 h-px flex-1 bg-gradient-to-r from-retim-orange/80 via-retim-orange/50 to-retim-orange/80 md:mx-4" />
              )}
            </div>
          ))}
        </div>

        <div className="grid gap-5 md:gap-6 lg:grid-cols-3">
          {discoverySteps.map((step) => (
            <article
              key={step.step}
              className="discovery-process-card group flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07] md:p-7"
            >
              <div className="mb-5 flex items-start gap-4">
                <div className="discovery-process-icon flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-retim-orange transition-all duration-300 group-hover:border-retim-orange/30 group-hover:bg-retim-orange/10">
                  <DiscoveryStepIcon type={step.icon} className="h-6 w-6" />
                </div>
                <div className="min-w-0 pt-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-retim-orange">
                    ADIM {step.step}
                  </p>
                  <h3 className="mt-1 font-serif text-xl font-bold leading-snug text-white md:text-2xl">
                    {step.title}
                  </h3>
                </div>
              </div>

              <p className="flex-1 text-sm leading-relaxed text-gray-300 md:text-[15px]">
                {step.description}
              </p>

              <ul className="mt-6 space-y-3 border-t border-white/10 pt-6">
                {step.highlights.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-snug text-gray-300">
                    <CheckIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="discovery-process-report mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm md:mt-12 md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-retim-orange">
                {discoveryReport.title}
              </p>
              <h3 className="mt-2 font-serif text-xl font-bold text-white md:text-2xl">
                {discoveryReport.subtitle}
              </h3>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-400 md:text-base">
                {discoveryReport.description}
              </p>
            </div>
            <Link
              href={discoveryReport.ctaHref}
              className="btn-primary btn-kesif inline-flex shrink-0 justify-center whitespace-nowrap"
            >
              {discoveryReport.ctaLabel}
              <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
