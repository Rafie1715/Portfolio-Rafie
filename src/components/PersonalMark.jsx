// A small RRB monogram, drawn as one visual signature for the portfolio.
export default function PersonalMark({ className = '' }) {
  return (
    <svg viewBox="0 0 88 44" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" className={className}>
      <path d="M7 35V9h9c13 0 13 15 0 15H7m10 0 11 11" />
      <path d="M33 35V9h9c13 0 13 15 0 15h-9m10 0 11 11" />
      <path d="M60 35V9h10c11 0 11 12 0 12H60m10 0c13 0 13 14 0 14H60" />
    </svg>
  );
}
