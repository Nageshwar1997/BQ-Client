import { Link } from 'react-router';
import {
  privacyClosingNotes,
  privacyContactInfo,
  privacyIntro,
  privacyLegalInfo,
  privacySections,
  type PrivacyBlock,
  type PrivacyInfoItem,
  type PrivacySection,
} from './privacyContent';

const renderInfoValue = ({ value, href }: PrivacyInfoItem) => {
  if (!href) {
    return value;
  }

  const isExternal = href.startsWith('http');

  return (
    <a
      href={href}
      className="text-brand hover:text-brand-hover transition-colors duration-150"
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noreferrer' : undefined}
    >
      {value}
    </a>
  );
};

const renderBlock = (block: PrivacyBlock, key: string) => {
  if (block.type === 'list') {
    return (
      <ul
        key={key}
        className="text-neutral-gray-700 font-metropolis list-disc space-y-2 pl-5 text-sm leading-7 md:text-[15px]"
      >
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  return (
    <p
      key={key}
      className={`font-metropolis text-sm leading-7 md:text-[15px] ${
        block.uppercase
          ? 'text-neutral-gray-800 font-semibold tracking-[0.02em]'
          : 'text-neutral-gray-700'
      }`}
    >
      {block.text}
    </p>
  );
};

const PrivacySectionView = ({
  section,
  level = 0,
}: {
  section: PrivacySection;
  level?: number;
}) => (
  <section className={level === 0 ? 'space-y-5' : 'space-y-4'}>
    <div className="space-y-2">
      <p className="text-brand font-metropolis text-xs font-semibold tracking-[0.2em] uppercase">
        Section {section.id}
      </p>
      <h2
        className={`text-neutral-gray-900 ${
          level === 0
            ? 'text-2xl font-semibold md:text-[28px]'
            : 'text-xl font-semibold md:text-2xl'
        }`}
      >
        {section.title}
      </h2>
    </div>

    {section.blocks?.map((block, index) =>
      renderBlock(block, `${section.id}-${index}`)
    )}

    {section.subsections?.length ? (
      <div className="border-brand/8 space-y-8 border-l pl-4 md:pl-6">
        {section.subsections.map((subsection) => (
          <PrivacySectionView
            key={subsection.id}
            section={subsection}
            level={level + 1}
          />
        ))}
      </div>
    ) : null}
  </section>
);

const PrivacyPolicy = () => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[linear-gradient(180deg,rgba(0,45,255,0.08)_0%,rgba(0,45,255,0.02)_45%,rgba(255,255,255,0)_100%)]" />
      <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(0,45,255,0.1)_0%,rgba(255,255,255,0)_70%)]" />
      <div className="pointer-events-none absolute top-120 left-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(0,45,255,0.07)_0%,rgba(255,255,255,0)_70%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-8 sm:px-8 md:px-12 md:py-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/auth"
            className="font-metropolis text-neutral-gray-700 hover:text-brand inline-flex items-center gap-2 text-base transition-colors duration-150"
          >
            <span aria-hidden="true">←</span>
            Back
          </Link>
        </div>

        <div className="mt-10 space-y-10 md:mt-14">
          <header className="space-y-6">
            <div className="space-y-3">
              <img
                src="/assets/icons/Commverse Logo - Final.svg"
                alt="Commverse Studio"
                className="h-auto w-36 md:w-40"
              />
              <h1 className="text-neutral-gray-900 max-w-3xl text-4xl font-semibold tracking-[-0.03em] md:text-5xl">
                Privacy Policy
              </h1>
              <p className="text-neutral-gray-600 font-metropolis text-base leading-7">
                by Ctruh Technologies Pvt. Ltd.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              {[
                ['Effective Date', 'March 11, 2026'],
                ['Version', '2.0'],
                ['Platform', 'commverse.studio'],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="border-brand/8 bg-neutral-gray-100 min-w-40 rounded-full border px-4 py-2"
                >
                  <span className="text-neutral-gray-600 font-metropolis text-xs tracking-[0.18em] uppercase">
                    {label}
                  </span>
                  <p className="text-neutral-gray-900 mt-1 text-sm font-medium">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </header>

          <section className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.85fr)]">
            <div className="space-y-4">
              {privacyIntro.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-neutral-gray-700 font-metropolis text-sm leading-7 md:text-[15px]"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <aside className="border-brand/10 bg-neutral-gray-100/80 rounded-3xl border p-6 shadow-[0_20px_50px_rgba(15,23,42,0.04)]">
              <div className="space-y-1">
                <p className="text-brand font-metropolis text-xs font-semibold tracking-[0.22em] uppercase">
                  Privacy Details
                </p>
                <h2 className="text-neutral-gray-900 text-xl font-semibold">
                  Data Controller Information
                </h2>
              </div>

              <dl className="mt-6 space-y-5">
                {privacyLegalInfo.map((item) => (
                  <div key={item.label} className="space-y-1">
                    <dt className="text-neutral-gray-600 font-metropolis text-xs tracking-[0.18em] uppercase">
                      {item.label}
                    </dt>
                    <dd className="text-neutral-gray-900 font-metropolis text-sm leading-6 break-words">
                      {renderInfoValue(item)}
                    </dd>
                  </div>
                ))}
              </dl>
            </aside>
          </section>

          <div className="space-y-10">
            {privacySections.map((section) => (
              <PrivacySectionView key={section.id} section={section} />
            ))}
          </div>

          <section className="border-brand/10 bg-neutral-gray-100/70 rounded-[28px] border p-6 md:p-8">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {privacyContactInfo.map((item) => (
                <div key={item.label} className="space-y-2">
                  <p className="text-neutral-gray-600 font-metropolis text-xs tracking-[0.18em] uppercase">
                    {item.label}
                  </p>
                  <p className="text-neutral-gray-900 font-metropolis text-sm leading-6 break-words">
                    {renderInfoValue(item)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <footer className="border-brand/10 space-y-3 border-t pt-6">
            {privacyClosingNotes.map((note, index) => (
              <p
                key={note}
                className={`font-metropolis text-sm leading-7 ${
                  index === 0
                    ? 'text-neutral-gray-700'
                    : 'text-neutral-gray-600'
                }`}
              >
                {note}
              </p>
            ))}
          </footer>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
