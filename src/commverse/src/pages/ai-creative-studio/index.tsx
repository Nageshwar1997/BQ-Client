import { useEffect, useState } from 'react';
import { useBeforeUnload, useBlocker, useNavigate } from 'react-router';
import ChatInterface from './components/ChatInterface';
import { MOCK_USER, UserProvider } from './context/UserContext';
import { ChatProvider } from './context/ChatContext';
import LeftSection from './components/LeftSection';
import { LibraryView } from './components/LibraryView';
import { getUser } from '../../lib/utils';
import { useGetUserDetail } from '../../services/auth-service';
import SaveWarnModal from '../../components/Overlay/SaveWarnModal';

const resolveUserPlan = (subscription: unknown): 'free' | 'pro' | 'business' => {
  if (!subscription || typeof subscription !== 'object') return 'free';

  const source = subscription as Record<string, unknown>;
  const candidates = [
    source.planId,
    source.planName,
    source.planType,
    source.tier,
    (source.plan as Record<string, unknown> | undefined)?.id,
    (source.plan as Record<string, unknown> | undefined)?.name,
    (source.plan as Record<string, unknown> | undefined)?.type,
  ];

  const allJoined = candidates
    .map((value) => String(value ?? '').trim().toLowerCase())
    .join(' ');
  if (allJoined.includes('business')) return 'business';
  if (allJoined.includes('pro')) return 'pro';
  return 'free';
};

export default function AICreativeStudio() {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<'chat' | 'library'>('chat');
  const [hasPendingProcess, setHasPendingProcess] = useState(false);
  const [showLeaveWarnModal, setShowLeaveWarnModal] = useState(false);
  const authUser = getUser();
  const userDetailQuery = useGetUserDetail();

  const fullName =
    authUser?.user?.name?.trim() || userDetailQuery.data?.name?.trim();
  const parts = fullName ? fullName.split(/\s+/).filter(Boolean) : [];
  const userPlan = resolveUserPlan(userDetailQuery.data?.subscription);

  const currentUser = {
    firstName: parts[0] ?? MOCK_USER.firstName,
    lastName: parts.slice(1).join(' '),
    avatarUrl:
      authUser?.user?.profilePhoto || userDetailQuery.data?.profilePhoto,
    plan: userPlan,
  };

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      hasPendingProcess &&
      `${currentLocation.pathname}${currentLocation.search}` !==
        `${nextLocation.pathname}${nextLocation.search}`
  );

  useEffect(() => {
    if (blocker.state !== 'blocked') return;
    setShowLeaveWarnModal(true);
  }, [blocker.state]);

  useBeforeUnload(
    (event) => {
      if (!hasPendingProcess) return;
      event.preventDefault();
      event.returnValue = '';
    },
    { capture: true }
  );

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  return (
    <UserProvider user={currentUser}>
      <ChatProvider>
        <div className="flex size-full min-h-screen flex-row bg-white">
          <LeftSection
            activeView={currentView}
            onViewChange={setCurrentView}
            onLogoClick={handleLogoClick}
          />
          <div className="flex h-screen flex-1 flex-col overflow-hidden bg-white">
            {currentView === 'chat' ? (
              <ChatInterface onPendingProcessChange={setHasPendingProcess} />
            ) : (
              <LibraryView />
            )}
          </div>
        </div>
        {showLeaveWarnModal && (
          <SaveWarnModal
            open={showLeaveWarnModal}
            showLeftSection={false}
            onClose={() => {
              setShowLeaveWarnModal(false);
              if (blocker.state === 'blocked') blocker.reset();
            }}
            onSaveExit={() => {
              setShowLeaveWarnModal(false);
              if (blocker.state === 'blocked') blocker.reset();
            }}
            onDiscardChanges={() => {
              setShowLeaveWarnModal(false);
              if (blocker.state === 'blocked') {
                blocker.proceed();
              }
            }}
            title="Leave AI Creative Studio?"
            subtitle="Your AI generation is still in progress. Continue here to keep working, or discard this screen and leave this page."
            showContinueButton={false}
            saveExitLabel="Continue Here"
            discardLabel="Discard & Leave"
            footerText="Leaving now may interrupt this generation flow."
            className="[&>div]:w-96!"
          />
        )}
      </ChatProvider>
    </UserProvider>
  );
}
