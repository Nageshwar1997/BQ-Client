import VirtualStoreSidebar from './components/VirtualStoreSidebar';
import Header from '../../components/Header';
import VirtualStoreMainBody from './components/VirtualStoreMainBody';
import { FormProvider, useForm, type FieldErrors } from 'react-hook-form';
import type { ProductPlacementOption } from '../../components/ProductPlacementItem';

export interface StoreFormType {
  // global
  step: number;
  title: string;

  // step 1
  selectedTemplateId: string;

  // step 2
  currency: string;
  spreadsheet: {
    url: string;
    name: string;
  } | null;
  shopifyDomain: string;
  apiKey: string;
  storeProducts: {
    _id: string;
    productName: string;
    source: string;
    price?: {
      amount?: number;
      currency?: string;
    };
    media?: {
      model?: {
        thumbnailUrl?: string;
        spriteUrl?: string;
      };
      thumbnail?: {
        url?: string;
      };
    };
  }[];

  // step 3
  storefrontName: string;
  branding: {
    globalSettings: boolean;
    logo: File | null;
  };
  interface: {
    globalSettings: boolean;
    font: string;
    backgroundColor: string;
    textColor: string;
  };

  // step 4
  productPlacement: ProductPlacementOption[];

  // step 5
  mediaPlacement: ProductPlacementOption[];

  // step 6
  experienceSettings: {
    currencyConversion: boolean;
    maxConcurrentVisitors: string;
    loadingScreenMessage: string;
    legalInformation: {
      privacyPolicyUrl: string;
      termsAndConditionsUrl: string;
      refundPolicyUrl: string;
    };
  };
}

export const PRODUCT_PLACEMENT_SLOTS = 6;
export const MEDIA_PLACEMENT_SLOTS = 4;

export const getEmptyPlacementOption = (): ProductPlacementOption => ({
  id: '',
  image: '',
  text: '',
});

export const getDefaultProductPlacement = (): ProductPlacementOption[] =>
  Array.from({ length: PRODUCT_PLACEMENT_SLOTS }, () =>
    getEmptyPlacementOption()
  );

export const getDefaultMediaPlacement = (): ProductPlacementOption[] =>
  Array.from({ length: MEDIA_PLACEMENT_SLOTS }, () =>
    getEmptyPlacementOption()
  );

export const virtualStoreDefaultData = {
  // global
  step: 1,
  title: 'New Virtual Storefront',

  // step 1
  selectedTemplateId: 'furniture',

  // step 2
  currency: '',
  spreadsheet: null,
  shopifyDomain: '',
  apiKey: '',
  storeProducts: [
    // {
    //   _id: '1',
    //   productName: 'Solar Panel X1',
    //   source: 'shopify',
    //   price: { amount: 25000, currency: 'INR' },
    //   media: {
    //     model: {
    //       thumbnailUrl:
    //         'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789',
    //     },
    //     thumbnail: {
    //       url: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231',
    //     },
    //   },
    // },
    // {
    //   _id: '2',
    //   productName: 'Inverter Pro Max',
    //   source: 'inventory',
    //   price: { amount: 18000, currency: 'INR' },
    //   media: {
    //     model: {
    //       spriteUrl:
    //         'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7',
    //     },
    //     thumbnail: {
    //       url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789',
    //     },
    //   },
    // },
    // {
    //   _id: '3',
    //   productName: 'Battery Storage Unit',
    //   source: 'spreadsheet',
    //   price: { amount: 32000, currency: 'INR' },
    //   media: {
    //     model: {
    //       spriteUrl:
    //         'https://images.unsplash.com/photo-1509395176047-4a66953fd231',
    //     },
    //     thumbnail: {
    //       url: 'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7',
    //     },
    //   },
    // },
    // {
    //   _id: '4',
    //   productName: 'Roof Mount Kit',
    //   source: 'inventory',
    //   price: { amount: 5000, currency: 'INR' },
    //   media: {
    //     model: {
    //       thumbnailUrl:
    //         'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789',
    //     },
    //     thumbnail: {
    //       url: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231',
    //     },
    //   },
    // },
  ],

  // step 3
  storefrontName: '',
  branding: {
    globalSettings: false,
    logo: null,
  },
  interface: {
    globalSettings: false,
    font: 'metropolis',
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
  },

  // step 4
  productPlacement: getDefaultProductPlacement(),

  // step 5
  mediaPlacement: getDefaultMediaPlacement(),

  // step 6
  experienceSettings: {
    currencyConversion: false,
    maxConcurrentVisitors: '',
    loadingScreenMessage: 'Welcome to your store!',
    legalInformation: {
      privacyPolicyUrl: '',
      termsAndConditionsUrl: '',
      refundPolicyUrl: '',
    },
  },
};

const VirtualStore = () => {
  const storeForm = useForm<StoreFormType>({
    defaultValues: virtualStoreDefaultData,
  });

  const onSubmitValid = (data: StoreFormType) => {
    console.log(data);
  };

  const onSubmitInvalid = (errors: FieldErrors<StoreFormType>) => {
    console.log(errors);
  };

  const onSubmit = storeForm.handleSubmit(onSubmitValid, onSubmitInvalid);

  return (
    <form
      id="storefront-form"
      className="flex h-full w-full overflow-hidden overscroll-y-contain"
      onSubmit={(e) => e.preventDefault()}
    >
      <FormProvider {...storeForm}>
        <VirtualStoreSidebar onSubmit={onSubmit} />
        <div className="flex h-full flex-1 flex-col">
          <Header
            section="storefront"
            buttons={{
              save: {
                type: 'submit',
                form: 'storefront-form',
                name: 'action',
                value: 'save',
                // disabled:
                //   (!queryParams.product && !activeExperienceId) ||
                //   !hasDraftDataChanges,
              },
              publish: {
                // disabled: !hasRequiredSiteInfoForPublish,
                onMouseDown: (e) => e.stopPropagation(),
                onClick: (e) => {
                  // if (!hasRequiredSiteInfoForPublish) return;
                  // if (publishExperienceQuery.isPending) return;
                  e.stopPropagation();
                  // setShowPublishOptionsModal((prev) => !prev);
                },
                // ...(publishExperienceQuery.isPending &&
                //   !showPublishOptionsModal && {
                //     content: 'Publishing',
                //   }),
                // isLoading:
                //   publishExperienceQuery.isPending && !showPublishOptionsModal,
                // className: `${showPublishOptionsModal ? 'bg-brand-pressed' : ''}`,
                // modalContent: showPublishOptionsModal && (
                //   <PublishOptionsModal
                //     experienceData={parsedExperience}
                //     publishedLink={publishedExperienceLink}
                //     publishedAt={parsedExperience?.publishedAt}
                //     changes={changesCount}
                //     onClose={() => setShowPublishOptionsModal(false)}
                //     experienceTitle={currentFormData?.title ?? ''}
                //     onTitleChange={(value) =>
                //       methods.setValue('title', value, { shouldDirty: true })
                //     }
                //     publishStatus={
                //       parsedExperience?.status === 'published'
                //         ? 'Published'
                //         : updateExperienceQuery.isPending
                //           ? 'Publishing'
                //           : publishExperienceQuery.isPending
                //             ? 'Publishing'
                //             : 'Not Published'
                //     }
                //     issues={0}
                //     isPublishing={publishExperienceQuery.isPending}
                //     buttonProps={{
                //       type: 'submit',
                //       form: 'tryon-form',
                //       name: 'action',
                //       value: 'publish',
                //       disabled: !canPublish || !hasRequiredSiteInfoForPublish,
                //     }}
                //   />
                // ),
              },
              settings: {
                // disabled: !activeExperienceId,
                // onClick: () =>
                //   navigate(`/fashion_tryon/${activeExperienceId}/settings`),
              },
            }}
          />
          <VirtualStoreMainBody />
        </div>
      </FormProvider>
    </form>
  );
};

export default VirtualStore;
