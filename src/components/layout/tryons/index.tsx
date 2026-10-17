import {
  type ITryOnError,
  type ITryOnModalProps,
  TryOnModal as PackageTryOnModal,
} from '@beautinique/frontend-tryon';

import { toaster } from '@/utils/toaster';

// A photo the try-on turns down (too big, not an image) is said in the app's own toast: the toaster is
// app-wide and sits above the modal, and there is no leftover error to clear afterwards. Without this the
// modal says the reason itself, inside it.
const showUploadError = ({ title, description }: ITryOnError) => {
  toaster.error({ title, description });
};

// The try-on of `@beautinique/frontend-tryon`, with what is the app's own about it: where a toast goes.
// The models and the images come from the package's CDN (`assets` is not given); the heavy part of the
// package (MediaPipe) is loaded the first time the modal is opened, not with the page that has it.
const TryOnModal = (props: ITryOnModalProps) => (
  <PackageTryOnModal onUploadError={showUploadError} {...props} />
);

export default TryOnModal;
