import { useEffect, useMemo } from 'react';
import { Fragment } from 'react/jsx-runtime';
import ProductPlacementItem from '../../../components/ProductPlacementItem';
import { productListDummyData } from '../../../data';
import { useFieldArray, useFormContext } from 'react-hook-form';
import {
  getDefaultMediaPlacement,
  getEmptyPlacementOption,
  MEDIA_PLACEMENT_SLOTS,
  type StoreFormType,
} from '..';

const StepFive = () => {
  const { control } = useFormContext<StoreFormType>();

  const mediaPlacement = useFieldArray({
    control,
    name: 'mediaPlacement',
    keyName: 'fieldId',
  });

  const placementOptions = useMemo(
    () =>
      productListDummyData.slice(0, MEDIA_PLACEMENT_SLOTS).map((item) => ({
        id: item.id,
        image: item.image,
        text: item.name,
      })),
    []
  );

  const selectedValues = useMemo(
    () =>
      Array.from({ length: MEDIA_PLACEMENT_SLOTS }, (_, index) => {
        const field = mediaPlacement.fields[index];
        if (!field?.id) return null;
        return {
          id: field.id,
          image: field.image,
          text: field.text,
        };
      }),
    [mediaPlacement.fields]
  );

  useEffect(() => {
    if (mediaPlacement.fields.length === MEDIA_PLACEMENT_SLOTS) return;
    mediaPlacement.replace(getDefaultMediaPlacement());
  }, [mediaPlacement.fields.length, mediaPlacement.replace]);

  return (
    <Fragment>
      <p className="text-xs/normal">Controls to tweak your experience</p>
      <ProductPlacementItem
        title="Media Placement"
        placeholderPrefix="Add Media"
        onReset={() => mediaPlacement.replace(getDefaultMediaPlacement())}
        onClick={(data) => {
          const slotIndex = data.slotNumber - 1;

          if (
            slotIndex < 0 ||
            slotIndex >= MEDIA_PLACEMENT_SLOTS ||
            slotIndex >= mediaPlacement.fields.length
          ) {
            return;
          }

          mediaPlacement.update(
            slotIndex,
            data.item ?? getEmptyPlacementOption()
          );
        }}
        value={selectedValues}
        data={placementOptions}
        className="grow"
      />
    </Fragment>
  );
};

export default StepFive;
