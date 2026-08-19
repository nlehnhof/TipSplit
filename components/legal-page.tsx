import type { ReactNode } from "react";

/**
 * Tiny renderer for the legal-page copy (privacy.md / terms.md).
 * Copy is kept in plain string constants (so apostrophes/quotes never end up
 * in JSX text nodes) and `**bold**` markers are rendered as <strong>.
 */
function rich(text: string): ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={`${part}-${i}`}>{part}</strong>
    ) : (
      <span key={`${part}-${i}`}>{part}</span>
    )
  );
}

type Section =
  | { type: "paragraphs"; paragraphs: string[] }
  | { type: "list"; items: string[] };

export function LegalPage({
  title,
  effectiveDate,
  intro,
  sections,
  contact,
}: {
  title: string;
  effectiveDate: string;
  intro: string[];
  sections: { heading: string; body: Section }[];
  contact: string;
}) {
  return (
    <main className="px-4 py-12 sm:py-16">
      <article className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
          {title}
        </h1>
        <p className="mt-2 text-sm font-semibold text-zinc-500">
          Effective date: {effectiveDate}
        </p>

        <div className="mt-6 space-y-4">
          {intro.map((p) => (
            <p key={p.slice(0, 40)} className="text-base leading-relaxed text-zinc-700">
              {rich(p)}
            </p>
          ))}
        </div>

        <div className="mt-10 space-y-10">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                {section.heading}
              </h2>
              {section.body.type === "paragraphs" ? (
                <div className="mt-4 space-y-4">
                  {section.body.paragraphs.map((p) => (
                    <p key={p.slice(0, 40)} className="text-base leading-relaxed text-zinc-700">
                      {rich(p)}
                    </p>
                  ))}
                </div>
              ) : (
                <ul className="mt-4 space-y-3">
                  {section.body.items.map((item) => (
                    <li key={item.slice(0, 40)} className="flex gap-2 text-base leading-relaxed text-zinc-700">
                      <span aria-hidden="true" className="shrink-0 text-zinc-400">
                        •
                      </span>
                      <span>{rich(item)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <p className="mt-12 border-t border-zinc-200 pt-6 text-base leading-relaxed text-zinc-700">
          {rich(contact)}
        </p>
      </article>
    </main>
  );
}
