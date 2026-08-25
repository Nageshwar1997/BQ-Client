import StoreBrandLogoCard from '../components/StoreBrandLogoCard';
import StoreItemCard from '../components/StoreItemCard';

const DEMO_PRODUCT = {
  imageSrc: '/assets/images/versa-ai/preset/multi_blue_sofa_1.webp',
  title: 'Virtual Storefront Setup',
  description:
    'Lorem ipsum dolor sit amet consectetur. Sit pretium ullamcorper.',
  price: '₹699',
  mrp: '₹999',
  discountPercent: 30,
};

const StepThreeMain = () => {
  return (
    <div className="flex w-full flex-col items-start gap-10">
      StepThreeMain
      <div className="bg-neutral-gray-900 flex w-full items-center justify-around p-10">
        <StoreBrandLogoCard />
        <StoreItemCard {...DEMO_PRODUCT} />
      </div>
    </div>
  );
};

export default StepThreeMain;
