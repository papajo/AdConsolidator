import { formatDate, formatNumber } from "../lib/utils";

function getCategoryName(ad) {
  return ad.category_name || ad.category || ad.categories?.name || "Other";
}

export default function AdCard({ ad, onClick, index }) {
  const delay = (index % 10) * 0.06;
  const category = getCategoryName(ad);

  const handleActivate = () => onClick(ad);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleActivate();
    }
  };

  const tagColors = {
    Products: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Services: "bg-blue-100 text-blue-800 border-blue-200",
    Events: "bg-purple-100 text-purple-800 border-purple-200",
    Other: "bg-surface-100 text-surface-700 border-surface-200",
  };

  return (
    <article
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className="group flex h-full min-h-[248px] flex-col rounded-xl border border-surface-200/70 bg-white shadow-sm transition-all duration-200 cursor-pointer opacity-0 animate-slide-up hover:-translate-y-0.5 hover:shadow-md sm:min-h-[232px] focus:outline-none focus:ring-2 focus:ring-brand-400/30 focus:ring-offset-2 focus:ring-offset-surface-50"
      style={{ animationDelay: `${delay}s`, animationFillMode: "forwards" }}
    >
      {/* Color strip */}
      <div
        className={`h-1.5 rounded-t-xl ${
          category === "Products"
            ? "bg-emerald-400"
            : category === "Services"
              ? "bg-blue-400"
              : category === "Events"
                ? "bg-purple-400"
                : "bg-surface-300"
        }`}
      />

      <div className="flex h-full flex-col gap-2.5 p-4 sm:gap-2 sm:p-3.5">
        {/* Top badge row: category + sponsored */}
        <div className="flex min-h-[24px] flex-wrap items-start justify-between gap-2">
          <span
            className={`text-[11px] font-medium px-2.5 py-1 rounded-full border leading-none ${tagColors[category] || tagColors.Other}`}
          >
            {category}
          </span>
          {ad.is_sponsored && (
            <span className="flex shrink-0 items-center gap-1 text-[10px] font-normal text-amber-500">
              <svg
                className="w-2.5 h-2.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Sponsored
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="line-clamp-2 min-h-[2.4rem] text-sm font-semibold leading-snug text-surface-900 transition-colors group-hover:text-brand-700 sm:min-h-[2.2rem]">
          {ad.title}
        </h3>

        {/* Description (fixed 2-line height container) */}
        <p className="line-clamp-2 min-h-[2.9rem] text-xs leading-relaxed text-surface-500 sm:min-h-[2.6rem]">
          {ad.description}
        </p>

        {/* Spacer to push footer down */}
        <div className="flex-1 min-h-0" />

        {/* Footer metadata */}
        <div className="mt-auto flex min-h-[40px] flex-col gap-2 border-t border-surface-100 pt-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          {/* Left: date */}
          <div className="flex min-w-0 items-center gap-1.5 text-[11px] text-surface-400 sm:text-xs">
            <svg
              className="w-3.5 h-3.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{formatDate(ad.created_at)}</span>
          </div>

          {/* Right group: views · rating · location */}
          <div className="flex w-full min-w-0 items-center justify-between gap-2 text-[11px] sm:w-auto sm:justify-start sm:gap-2.5 sm:text-xs">
            <div className="flex items-center gap-1 text-inherit text-surface-400">
              <svg
                className="w-3.5 h-3.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span>{formatNumber(ad.views)}</span>
            </div>

            <span className="text-surface-200">·</span>

            <div className="flex items-center gap-1 text-inherit">
              <svg
                className="w-3 h-3 text-amber-400 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-semibold text-surface-700">
                {ad.rating}
              </span>
            </div>

            {ad.location && (
              <>
                <span className="text-surface-200">·</span>
                <span
                  className="max-w-[96px] truncate text-inherit text-surface-400 sm:max-w-[72px]"
                  title={ad.location}
                >
                  {ad.location}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
