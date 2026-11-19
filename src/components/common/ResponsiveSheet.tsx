import React, { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Drawer } from 'vaul';
import { X } from 'lucide-react';

interface ResponsiveSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidthClassName?: string;
}

/**
 * ResponsiveSheet:
 * - Mobile (< 768px): Native bottom sheet with drag handle, swipe-to-dismiss, max-height 90 dvh.
 * - Desktop (>= 768px): Accessible centered dialog with backdrop blur and escape key listener.
 */
export const ResponsiveSheet: React.FC<ResponsiveSheetProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidthClassName = 'max-w-xl',
}) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 768px)');
    const onChange = () => setIsDesktop(mql.matches);
    setIsDesktop(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  if (isDesktop) {
    return (
      <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm data-[state=open]:animate-fadeIn" />
          <Dialog.Content
            className={`fixed left-1/2 top-1/2 z-50 w-full ${maxWidthClassName} -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl focus:outline-none max-h-[85vh] overflow-y-auto text-slate-900 dark:text-slate-100 font-sans`}
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <Dialog.Title className="text-base font-semibold leading-tight text-slate-900 dark:text-white">
                  {title}
                </Dialog.Title>
                {description && (
                  <Dialog.Description className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {description}
                  </Dialog.Description>
                )}
              </div>
              <Dialog.Close asChild>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors touch-target flex items-center justify-center cursor-pointer"
                  aria-label="Close dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </Dialog.Close>
            </div>

            <div className="pt-4">{children}</div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }

  return (
    <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 flex max-h-[90dvh] flex-col rounded-t-3xl bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] outline-none font-sans text-slate-900 dark:text-slate-100 shadow-2xl">
          {/* Drag Handle */}
          <div className="mx-auto mb-3 h-1.5 w-12 shrink-0 rounded-full bg-slate-300 dark:bg-slate-700" />

          <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <Drawer.Title className="text-base font-semibold leading-tight text-slate-900 dark:text-white">
                {title}
              </Drawer.Title>
              {description && (
                <Drawer.Description className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {description}
                </Drawer.Description>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors touch-target flex items-center justify-center cursor-pointer"
              aria-label="Close sheet"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-4 overflow-y-auto flex-1 overscroll-contain">{children}</div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
