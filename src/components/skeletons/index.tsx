const Skeleton = ({ className }: { className?: string }) => {
  return (
    <div
      className={`w-full h-4 bg-primary-50 animate-pulse rounded-sm ${className}`}
    />
  );
};

export default Skeleton;
