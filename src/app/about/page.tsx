import Image from "next/image";
import Link from "next/link";
import { TEAM_BIO } from "@/content/bios";
import { SETTINGS } from "@/content/settings";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12 sm:py-20">
      <header className="mb-14 sm:mb-20 text-center">
        <p className="text-gold-chrome text-xs uppercase tracking-[0.18em] font-semibold mb-4">
          Who you&apos;re eating with
        </p>
        <h1 className="font-serif text-4xl sm:text-6xl leading-[1.05] mb-6">
          Two people.<br />
          <em className="text-(--amber) not-italic">A few potatoes.</em>
        </h1>
        {/* The positioning line used to open the paragraph below, where it read
            as ordinary body copy. It's the brand's whole argument, so it gets to
            stand on its own. Source stays SETTINGS.brand.positioning — the
            footer and the page description use the same string. */}
        <blockquote className="mt-8 mb-7 max-w-2xl mx-auto">
          <p className="font-serif text-2xl sm:text-4xl leading-[1.15] text-gold-chrome">
            &ldquo;{SETTINGS.brand.positioning}&rdquo;
          </p>
        </blockquote>
        <p className="text-(--text-soft) text-lg leading-relaxed max-w-2xl mx-auto">
          That&apos;s the whole pitch. Everything else is execution — and
          execution is who&apos;s making it.
        </p>
      </header>

      <div className="max-w-2xl mx-auto">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-(--bg-card) border border-(--color-line)">
          <Image
            src={TEAM_BIO.image}
            alt="Edward, founder and pitmaster of Iron Oaks BBQ"
            fill
            sizes="(max-width: 640px) 100vw, 640px"
            className="object-cover"
          />
          {TEAM_BIO.placeholder && (
            <div className="absolute inset-0 bg-(--bg)/70 flex items-center justify-center">
              <span className="text-(--amber) text-xs uppercase tracking-wider font-semibold bg-(--bg) px-3 py-1.5 rounded-full border border-(--amber)/40">
                Photo coming
              </span>
            </div>
          )}
        </div>
        <div className="mt-8 space-y-4 text-(--text-soft) text-lg leading-relaxed text-center">
          {TEAM_BIO.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
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
