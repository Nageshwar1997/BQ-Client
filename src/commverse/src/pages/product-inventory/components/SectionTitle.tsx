const SectionWithTitle = ({
  title,
  children,
  hasItems,
}: {
  title: string;
  children: React.ReactNode;
  hasItems: boolean;
}) => {
  if (!hasItems) {
    return null;
  }
  return (
    <div className="flex flex-col gap-5">
      <div className="text-neutral-gray-900 font-metropolis text-base/[19px] font-semibold">
        {title}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default SectionWithTitle;
