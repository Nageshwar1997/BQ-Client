const BgGradient = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1280 774"
      fill="none"
      className={className}
    >
      <g clip-path="url(#clip0_10813_18511)">
        <rect
          width="1487.25"
          height="836.25"
          transform="matrix(-1 0 0 1 1383 0)"
          fill="url(#paint0_linear_10813_18511)"
        />
        <g
          style={{
            mixBlendMode: "plus-lighter",
          }}
          filter="url(#filter0_f_10813_18511)"
        >
          <path
            d="M1131.63 834.75C1147.23 839.55 1125.14 787.75 1112.14 761.25L1092.64 738.75L1020.64 783.75L1034.14 846.75C1060.14 840.75 1116.04 829.95 1131.63 834.75Z"
            fill="#fe026bcc"
          />
        </g>
        <g filter="url(#filter1_f_10813_18511)">
          <path
            d="M1104.62 596.928L1056.75 357.038L1245.84 282.75L1832.25 321.442C1778.79 456.606 1671.88 728.79 1671.88 736.219C1671.88 745.505 1317.64 726.933 1291.31 717.647C1270.25 710.218 1158.08 634.073 1104.62 596.928Z"
            fill="url(#paint1_linear_10813_18511)"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_f_10813_18511"
          x="886.461"
          y="604.575"
          width="384.714"
          height="376.35"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="67.0875"
            result="effect1_foregroundBlur_10813_18511"
          />
        </filter>
        <filter
          id="filter1_f_10813_18511"
          x="965.925"
          y="191.925"
          width="957.15"
          height="637.65"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="45.4125"
            result="effect1_foregroundBlur_10813_18511"
          />
        </filter>
        <linearGradient
          id="paint0_linear_10813_18511"
          x1="531.75"
          y1="435.75"
          x2="663.75"
          y2="836.25"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-opacity="0" />
          <stop offset="1" stop-color="#fe026b" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_10813_18511"
          x1="1343.25"
          y1="350.25"
          x2="1082.25"
          y2="869.25"
          gradientUnits="userSpaceOnUse"
        >
          {/* <stop stop-color="var(--primary-inverted)" /> */}
          <stop stop-color="#fe026b80" />
          <stop offset="1" stop-opacity="0" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_10813_18511"
          x1="1187.46"
          y1="532.238"
          x2="1272.53"
          y2="72.8487"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#fe026b" stop-opacity="0" />
          <stop offset="1" stop-color="#fe026b" />
        </linearGradient>
        <clipPath id="clip0_10813_18511">
          <rect
            width="1487.25"
            height="836.25"
            fill="#fe026b3d"
            transform="matrix(-1 0 0 1 1383 0)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default BgGradient;
