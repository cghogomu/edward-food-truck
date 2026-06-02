import Image from "next/image";
import Link from "next/link";
import { BIOS } from "@/content/bios";
import { SETTINGS } from "@/content/settings";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12 sm:py-20">
      <header className="mb-14 sm:mb-20 text-center">
        <p className="text-(--amber) text-xs uppercase tracking-[0.18em] font-semibold mb-4">
          Who you're eating with
        </p>
        <h1 className="font-serif text-4xl sm:text-6xl leading-[1.05] mb-6">
          Two people.<br />
          <em className="text-(--amber) not-italic">A few potatoes.</em>
        </h1>
        <p className="text-(--text-soft) text-lg leading-relaxed max-w-2xl mx-auto">
          {SETTINGS.brand.positioning} That's the whole pitch. Everything else is
          execution — and execution is who's making it.
        </p>
      </header>

      <div className="space-y-16">
        {BIOS.map((bio, i) => (
          <article
            key={bio.name}
            className={`grid sm:grid-cols-5 gap-7 sm:gap-10 items-center ${i % 2 === 1 ? "sm:[direction:rtl]" : ""}`}
          >
            <div className="sm:col-span-2 sm:[direction:ltr]">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-(--bg-card) border border-(--color-line)">
                <Image
                  src={bio.image}
                  alt={bio.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 40vw"
                  className="object-cover"
                />
                {bio.placeholder && (
                  <div className="absolute inset-0 bg-(--bg)/70 flex items-center justify-center">
                    <span className="text-(--amber) text-xs uppercase tracking-wider font-semibold bg-(--bg) px-3 py-1.5 rounded-full border border-(--amber)/40">
                      Photo coming
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="sm:col-span-3 sm:[direction:ltr]">
              <p className="text-(--amber) text-xs uppercase tracking-[0.18em] font-semibold mb-3">
                {bio.role}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-(--text) leading-tight mb-4">
                {bio.name}
              </h2>
              <p className="text-(--text-soft) leading-relaxed">
                {bio.body}
              </p>
              {bio.placeholder && (
                <p className="mt-4 text-xs text-(--text-muted) italic">
                  Placeholder content — real bio and photo to be added.
                </p>
              )}
            </div>
          </article>
        ))}
      </div>

      <section className="mt-20 pt-14 border-t border-(--color-line) text-center">
        <h2 className="font-serif text-3xl mb-4">The kitchen philosophy</h2>
        <p className="text-(--text-soft) text-lg leading-relaxed max-w-2xl mx-auto mb-2">
          A few things done really well. Not a lot of things done average.
        </p>
        <p className="text-(--text-muted) text-sm">
          — Edward
        </p>
        <div className="mt-8">
          <Link
            href="/menu"
            className="inline-block bg-(--russet) hover:bg-(--russet-deep) text-(--text) px-6 py-3 rounded-lg text-sm font-semibold uppercase tracking-wide transition-colors"
          >
            See what we make
          </Link>
        </div>
      </section>
    </div>
  );
}
