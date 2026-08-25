import { useEffect, useRef } from 'react';
import Button from '../Button';
import { Link } from 'react-router';
import { Icon } from '@iconify/react';
import { CreateFillIcon } from '../../icons';

const NotFoundPage = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);

  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const maxRotateX = 50;
      const maxRotateY = 50;
      const sensitivity = 1.35;
      const rect = containerRef.current.getBoundingClientRect();

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const rawPercentX =
        ((e.clientX - centerX) / (window.innerWidth / 2)) * sensitivity;
      const rawPercentY =
        ((e.clientY - centerY) / (window.innerHeight / 2)) * sensitivity;
      const percentX = Math.max(-1, Math.min(1, rawPercentX));
      const percentY = Math.max(-1, Math.min(1, rawPercentY));

      targetRotation.current = {
        x: -percentY * maxRotateX,
        y: percentX * maxRotateY,
      };
    };

    const renderLoop = () => {
      const ease = 0.12;

      currentRotation.current.x +=
        (targetRotation.current.x - currentRotation.current.x) * ease;
      currentRotation.current.y +=
        (targetRotation.current.y - currentRotation.current.y) * ease;

      if (logoRef.current) {
        logoRef.current.style.transform = `rotateX(${currentRotation.current.x}deg) rotateY(${currentRotation.current.y}deg)`;
      }

      animationFrameId.current = requestAnimationFrame(renderLoop);
    };

    document.addEventListener('mousemove', handleMouseMove);
    animationFrameId.current = requestAnimationFrame(renderLoop); // Start loop

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  return (
    <main className="text-neutral-gray-900 bg-auth-img fixed inset-0 flex min-h-screen w-full items-center justify-center overflow-hidden bg-white">
      <Link to="/dashboard">
        <img
          src="/assets/icons/Commverse Logo - Final.svg"
          alt="logo"
          className="absolute top-10 left-1/2 z-10 h-auto w-full max-w-51 -translate-x-1/2"
        />
      </Link>
      <div className="pointer-events-none absolute top-1/2 left-1/2 z-0 h-[60vw] w-[60vw] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(0,45,255,0.04)_0%,rgba(255,255,255,0)_70%)]" />

      <div className="font-metropolis relative z-1 flex max-w-200 animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] flex-col items-center gap-2 p-8 text-center">
        <h1 className="flex items-center justify-center gap-6 text-[clamp(8rem,15vw,15rem)] leading-none font-extrabold tracking-[-0.04em] select-none">
          <span className="bg-[linear-gradient(180deg,#0F172A_0%,rgba(15,23,42,0.7)_100%)] bg-clip-text text-transparent filter-[drop-shadow(0_8px_16px_rgba(0,0,0,0.1))]">
            4
          </span>
          <div
            className="flex h-[clamp(8rem,16vw,14rem)] w-[clamp(8rem,16vw,14rem)] items-center justify-center perspective-distant"
            ref={containerRef}
          >
            <img
              src="/assets/icons/logo-icon.svg"
              className="h-full w-full filter-[drop-shadow(0_10px_20px_rgba(0,45,255,0.15))] transition-[transform,filter] duration-100 ease-out will-change-transform transform-3d hover:cursor-default hover:filter-[drop-shadow(0_0_35px_rgba(0,45,255,0.3))]"
              alt="Commverse Logo"
              ref={logoRef}
            />
          </div>
          <span className="font-metropolis bg-[linear-gradient(180deg,#0F172A_0%,rgba(15,23,42,0.7)_100%)] bg-clip-text text-transparent filter-[drop-shadow(0_8px_16px_rgba(0,0,0,0.1))]">
            4
          </span>
        </h1>

        <div className="mt-8 flex flex-col">
          <h2 className="font-metropolis text-neutral-gray-900 text-[32px] font-bold">
            Even AI Couldn&apos;t Find This Page
          </h2>
          <p className="text-neutral-gray-700 text-xl">
            Since you&apos;re here... generate something?
          </p>
        </div>

        <div className="mt-5 flex items-center justify-center gap-6">
          <Link to="/dashboard">
            <Button
              content="Back to home"
              variant="ghost"
              leftIcon={
                <Icon icon="solar:arrow-left-linear" className="size-6" />
              }
            />
          </Link>
          <Link to="/dashboard">
            <Button
              content="Create Experience"
              leftIcon={<CreateFillIcon className="fill-white" />}
            />
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFoundPage;
