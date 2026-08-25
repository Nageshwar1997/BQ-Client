const CircularProgress = ({ value, max }: { value: number; max: number }) => {
  const radius = 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / max) * circumference;

  return (
    <svg className="h-5 w-5 -rotate-90">
      <circle
        cx="10"
        cy="10"
        r={radius}
        strokeWidth="3"
        className="fill-none stroke-gray-300"
      />
      <circle
        cx="10"
        cy="10"
        r={radius}
        strokeWidth="3"
        className="fill-none stroke-black transition-all"
        strokeDasharray={circumference}
        strokeDashoffset={-offset}
      />
    </svg>
  );
};

export default CircularProgress;
