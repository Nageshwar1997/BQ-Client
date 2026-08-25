import { defaultSettings } from '../../constants';
import Canvas3D from '../../3d/Components/Canvas3D';
import { Icon } from '@iconify/react';
import { useGet3DAssetById } from '../../services/assets-service';
import Chip from '../../components/Chip';
import { VersaAISolidLogoIcon } from '../../icons';
import { Link, useNavigate } from 'react-router';
import TopHeader from '../../components/TopHeader';
import Button from '../../components/Button';
import Userprofile from '../../components/Userprofile';
import { useState, type MouseEventHandler } from 'react';
import PillLoader from '../../components/PillLoader';
import { downloadFile } from '../../lib/utils';
import Upload3DAssetForm from './components/Upload3DAssetForm';

const AssetLibraryDetails = () => {
  // const [isCopied, setIsCopied] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const navigate = useNavigate();

  const get3DAssetByIdQuery = useGet3DAssetById();
  const details = get3DAssetByIdQuery?.data?.data;

  // const handleCopyLink = async () => {
  //   const linkToCopy = 'furniture.commverse.studio/awc7cey9n8qYOU9';

  //   try {
  //     await navigator.clipboard.writeText(linkToCopy);
  //     setIsCopied(true);

  //     setTimeout(() => setIsCopied(false), 2000);
  //   } catch (err) {
  //     console.error('Failed to copy text: ', err);
  //   }
  // };

  const handleDownload: MouseEventHandler<HTMLButtonElement> = (event) => {
    event?.stopPropagation();

    if (!details?.modelUrl) return;

    downloadFile({
      url: details?.modelUrl,
      filename: details?.title || '3d-model',
      extension: details?.fileType?.toLowerCase(),
    });
  };

  return (
    <>
      <TopHeader />
      {get3DAssetByIdQuery?.isLoading ? (
        <div className="flex h-[calc(100vh-80px)] w-full items-center justify-center">
          <PillLoader description="" />
        </div>
      ) : (
        <div className="font-metropolis flex h-[calc(100vh-80px)] w-full flex-col gap-12 pt-3 pr-12 pb-10 pl-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon
                icon="solar:arrow-left-linear"
                className="size-8 cursor-pointer"
                onClick={() => navigate('/3d-asset-library')}
              />
              <span className="text-[24px] font-bold">3D Model Preview</span>
            </div>
            <div className="flex items-center gap-3">
              <Link to={'/versa-ai'}>
                <Button
                  variant="gradient"
                  leftIcon={<VersaAISolidLogoIcon className="fill-white" />}
                  content="Generate"
                  className="w-fit! py-4!"
                />
              </Link>
              <Button
                variant="tertiary"
                leftIcon={<Icon icon="solar:upload-minimalistic-linear" />}
                content="Upload"
                className="w-fit! py-4!"
                onClick={() => setIsUploadModalOpen(true)}
              />
            </div>
          </div>
          <div className="flex h-full gap-8">
            {/* Left */}
            <div className="flex h-full w-1/3 flex-col gap-2">
              {/* Header Section */}
              <h2 className="inline-flex w-full justify-between gap-3 text-2xl font-bold">
                <span className="line-clamp-4">
                  {details?.title?.includes('Generating 3D Model') === true
                    ? 'Versa AI Model'
                    : details?.title}
                </span>
                {/* <Icon icon="solar:share-linear" className="shrink-0" /> */}
              </h2>

              <div className="font-metropolis text-neutral-gray-600 flex items-center gap-1 text-sm leading-3.5">
                <span className="font-semibold">{details?.category?.name}</span>{' '}
                • <span className="uppercase">{details?.fileSize}</span> •{' '}
                <span className="bg-neutral-gray-300 text-neutral-gray-900 rounded-sm px-1 text-sm font-semibold uppercase">
                  {details?.fileType}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <Userprofile variant="avatar" className="size-6! shrink-0" />

                <span className="text-xs leading-none text-neutral-600">
                  {details?.user?.name || 'User'}
                </span>
              </div>

              <div className="flex grow flex-col justify-end gap-3 pb-4">
                {/* <div
                  className="border-neutral-gray-500 hover:bg-neutral-gray-50 flex cursor-pointer items-center gap-2 rounded-md border transition-colors"
                  onClick={handleCopyLink}
                  title={isCopied ? 'Copied!' : 'Copy link'}
                >
                  <p className="text-neutral-gray-900 font-metropolis w-[calc(100%-40px)] truncate px-3 py-2 select-none">
                    furniture.commverse.studio/awc7cey9n8qYOU9
                  </p>
                  <Icon
                    icon={
                      isCopied ? 'solar:check-circle-bold' : 'solar:copy-linear'
                    }
                    className={`text-neutral-gray-500 shrink-0 ${isCopied ? 'text-neutral-gray-900' : ''}`}
                  />
                </div> */}

                <Button
                  leftIcon={<Icon icon="solar:download-minimalistic-linear" />}
                  content="Download"
                  onClick={handleDownload}
                />
              </div>
            </div>

            {/* Right */}
            <div className="relative h-full w-full">
              {details?.modelUrl && (
                <Canvas3D
                  settings={defaultSettings}
                  modelUrl={details?.modelUrl}
                  description=""
                  viewer={true}
                />
              )}
              {details?.isAIGenerated && (
                <Chip
                  leftIcon={
                    <VersaAISolidLogoIcon className="fill-neutral-gray-100 size-3" />
                  }
                  text={'Generated'}
                  variant="gradient"
                  className="absolute top-6 left-6 h-fit! w-fit!"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {isUploadModalOpen && (
        <Upload3DAssetForm
          open={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
        />
      )}
    </>
  );
};

export default AssetLibraryDetails;
