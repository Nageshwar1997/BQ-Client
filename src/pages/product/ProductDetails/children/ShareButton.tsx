import { Button } from '@beautinique/frontend-components';

import { toaster } from '@/utils/toaster';

/**
 * Shares the address of the page: with the share sheet of the phone or the system where there is one, and by copying the
 * address (and saying so) where there is not. A person who closes the share sheet without sharing has done nothing wrong -
 * nothing is said. An address that cannot be copied (a page that is not secure) is said, so it is not a silent failure.
 */
const ShareButton = ({ title }: { title: string }) => {
  const share = async () => {
    const url = window.location.href;

    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({ title, url });

        return;
      }

      await navigator.clipboard.writeText(url);
      toaster.success({
        title: 'Link copied',
        description: 'The link of this product is on your clipboard.',
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;

      toaster.error({
        title: 'Could not share',
        description: 'Please copy the address from your browser instead.',
      });
    }
  };

  return (
    <Button
      pattern="outline"
      content="Share"
      leftIcon={{ icon: 'solar:share-linear', className: 'size-5' }}
      buttonProps={{
        onClick: () => {
          void share();
        },
      }}
    />
  );
};

export default ShareButton;
