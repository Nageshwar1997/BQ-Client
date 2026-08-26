import { Icon } from '@iconify/react';
import type { ReactNode } from 'react';

import GradientText from '@/components/ui/GradientText';

interface ITryOnBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

// Mobile-only (see the outer `lg:hidden` - large screens keep the always-visible sidebar as-is,
// see TryOnSidebar.tsx) stand-in for the sidebar's mode-toggle/model-list once the screen's too
// narrow for one. Both the backdrop and the sheet itself stay mounted at all times, just
// faded/translated out when closed, so the slide-down-on-close transition actually plays instead
// of the sheet just disappearing.
const TryOnBottomSheet = ({ isOpen, onClose, title, children }: ITryOnBottomSheetProps) => (
  <div className="lg:hidden">
    <div
      aria-hidden={!isOpen}
      onClick={onClose}
      className={`bg-primary-invert/60 fixed inset-0 z-40 backdrop-blur-xs transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    />
    <div
      role="dialog"
      aria-label={title}
      aria-hidden={!isOpen}
      className={`bg-primary-invert border-primary/10 fixed inset-x-0 bottom-0 z-50 max-h-[70dvh] rounded-t-2xl border-t p-4 shadow-lg transition-transform duration-300 ease-out ${
        isOpen ? 'translate-y-0' : 'pointer-events-none translate-y-full'
      }`}
    >
      {/* Drag-handle affordance - purely visual, this sheet isn't actually draggable. */}
      <div className="bg-primary/20 mx-auto mb-3 h-1 w-10 rounded-full" />
      <div className="mb-3 flex items-center justify-between">
        <GradientText type="silver" text={title} className="text-sm font-semibold" />
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="text-tertiary hover:text-primary cursor-pointer p-1 transition-colors duration-300"
        >
          <Icon icon="lucide:x" className="size-4" />
        </button>
      </div>
      {children}
    </div>
  </div>
);

export default TryOnBottomSheet;
