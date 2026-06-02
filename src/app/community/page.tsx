import Link from "next/link";
import { COMMUNITY_PARTNERS, COMMUNITY_VALUE, HOST_BUSINESS } from "@/content/spotlight";

export default function CommunityPage() {
  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12 sm:py-20">
      <header className="mb-14 sm:mb-20 text-center">
        <p className="text-(--amber) text-xs uppercase tracking-[0.18em] font-semibold mb-4">
          We are all we got
        </p>
        <h1 className="font-serif text-4xl sm:text-6xl leading-[1.05] mb-6">
          The street eats<br />
          <em className="text-(--amber) not-italic">together.</em>
        </h1>
        <p className="text-(--text-soft) text-lg leading-relaxed max-w-2xl mx-auto">
          {COMMUNITY_VALUE}
        </p>
      </header>

      {/* Host business */}
      <section className="mb-16 sm:mb-20">
        <div className="bg-(--bg-card) border border-(--color-line) rounded-2xl p-8 sm:p-10">
          <p className="text-xs uppercase tracking-[0.18em] font-semibold text-(--amber) mb-4">
            Where we park
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-(--text) mb-4">
            Thanks to {HOST_BUSINESS.name}
          </h2>
          <p className="text-(--text-soft) leading-relaxed max-w-2xl">
            {HOST_BUSINESS.blurb}
          </p>
          {HOST_BUSINESS.placeholder && (
            <p className="mt-4 text-xs text-(--text-muted) italic">
              Placeholder — real name and link to be added.
            </p>
          )}
        </div>
      </section>

      {/* Community partners */}
      <section>
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.18em] font-semibold text-(--amber) mb-3">
            People we work with
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-(--text)">
            Local. Independent.<br />
            <em className="text-(--text-soft) not-italic">Worth your money.</em>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {COMMUNITY_PARTNERS.map((partner) => (
            <div
              key={partner.name}
              className="bg-(--bg-card) border border-(--color-line) rounded-xl p-6 hover:border-(--amber)/30 transition-colors"
            >
              <div className="text-xs uppercase tracking-[0.15em] font-semibold text-(--amber) mb-2">
                {partner.category}
              </div>
              <h3 className="font-serif text-xl text-(--text) mb-3">
                {partner.name}
              </h3>
              <p className="text-(--text-soft) text-sm leading-relaxed">
                {partner.blurb}
              </p>
              {partner.placeholder && (
                <p className="mt-3 text-xs text-(--text-muted) italic">
                  Placeholder partner.
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20 pt-14 border-t border-(--color-line) text-center">
        <p className="text-(--text-soft) max-w-xl mx-auto leading-relaxed mb-6">
          Run a business you want featured here? Reach out — Edward will eat
          your food and decide for himself.
        </p>
        <Link
          href="/catering"
          className="text-(--amber) hover:text-(--text) text-sm font-medium"
        >
          Get in touch →
        </Link>
      </section>
    </div>
  );
}
