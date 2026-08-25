import { useEffect, useMemo } from 'react';
import { Fragment } from 'react/jsx-runtime';
import ProductPlacementItem from '../../../components/ProductPlacementItem';
import { productListDummyData } from '../../../data';
import { useFieldArray, useFormContext } from 'react-hook-form';
import {
  getDefaultProductPlacement,
  getEmptyPlacementOption,
  PRODUCT_PLACEMENT_SLOTS,
  type StoreFormType,
} from '..';

const StepFour = () => {
  const { control } = useFormContext<StoreFormType>();

  const productPlacement = useFieldArray({
    control,
    name: 'productPlacement',
    keyName: 'fieldId',
  });

  const placementOptions = useMemo(
    () =>
      productListDummyData.slice(0, PRODUCT_PLACEMENT_SLOTS).map((item) => ({
        id: item.id,
        image: item.image,
        text: item.name,
      })),
    []
  );

  const selectedValues = useMemo(
    () =>
      Array.from({ length: PRODUCT_PLACEMENT_SLOTS }, (_, index) => {
        const field = productPlacement.fields[index];
        if (!field?.id) return null;
        return {
          id: field.id,
          image: field.image,
          text: field.text,
        };
      }),
    [productPlacement.fields]
  );

  useEffect(() => {
    if (productPlacement.fields.length === PRODUCT_PLACEMENT_SLOTS) return;
    productPlacement.replace(getDefaultProductPlacement());
  }, [productPlacement.fields.length, productPlacement.replace]);

  return (
    <Fragment>
      <p className="text-xs/normal">Controls to tweak your experience</p>
      <ProductPlacementItem
        onReset={() => productPlacement.replace(getDefaultProductPlacement())}
        onClick={(data) => {
          const slotIndex = data.slotNumber - 1;

          if (
            slotIndex < 0 ||
            slotIndex >= PRODUCT_PLACEMENT_SLOTS ||
            slotIndex >= productPlacement.fields.length
          ) {
            return;
          }

          productPlacement.update(
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

export default StepFour;
