import { Icon } from '@iconify/react';
import { useChat } from '../context/ChatContext';
import Button from '../../../components/Button';

type LeftSectionProps = {
  activeView: 'chat' | 'library';
  onViewChange: (view: 'chat' | 'library') => void;
  onLogoClick?: () => void;
};

export default function LeftSection({
  activeView,
  onViewChange,
  onLogoClick,
}: LeftSectionProps) {
  const { createNewChat } = useChat();

  const handleNewChat = () => {
    createNewChat();
    onViewChange('chat');
  };

  return (
    <div className="flex h-screen w-[300px] shrink-0 overflow-hidden border-r border-[#D0D1D9]">
      {/* 236px Wide Navigation Sidebar */}
      <div className="relative flex size-full w-[300px] shrink-0 flex-col items-start gap-[32px] bg-[#f0f1f7] px-4 pt-9 pb-32">
        {/* Commverse Logo */}
        <button
          type="button"
          onClick={onLogoClick}
          className="cursor-pointer"
          aria-label="Go to homepage"
        >
          <img
            src="/assets/icons/Commverse Logo - Final.svg"
            alt="logo"
            className="h-auto w-full max-w-47.5 object-cover"
          />
        </button>
        <div className="relative flex w-full shrink-0 flex-col items-start">
          <div className="relative w-full shrink-0">
            <div className="relative flex w-full flex-col items-start gap-[24px]">
              <div className="relative flex w-full shrink-0 flex-col items-start gap-[8px]">
                {/* New Chat */}
                <Button
                  variant="ghost"
                  content="New Chat"
                  onClick={handleNewChat}
                  leftIcon={
                    <Icon
                      icon="solar:chat-square-line-duotone"
                      className={`size-4 ${
                        activeView === 'chat'
                          ? 'text-[#18181a]'
                          : 'text-[#48494d]'
                      }`}
                    />
                  }
                  className={`w-full! rounded-[8px]! px-2! py-1.5! text-[14px]! font-semibold! transition-all [&>div]:justify-start! ${
                    activeView === 'chat'
                      ? 'bg-[#FFF]! text-[#18181a]!'
                      : 'bg-transparent! text-[#48494d]! hover:bg-white/50!'
                  }`}
                />

                {/* Library */}
                <Button
                  variant="ghost"
                  content="Library"
                  onClick={() => onViewChange('library')}
                  leftIcon={
                    <Icon
                      icon="solar:wallpaper-broken"
                      className={`size-4 ${
                        activeView === 'library'
                          ? 'text-[#18181a]'
                          : 'text-[#48494d]'
                      }`}
                    />
                  }
                  className={`w-full! rounded-[8px]! px-2! py-1.5! text-[14px]! font-semibold! transition-all [&>div]:justify-start! ${
                    activeView === 'library'
                      ? 'bg-[#FFF]! text-[#18181a]!'
                      : 'bg-transparent! text-[#48494d]! hover:bg-white/50!'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
