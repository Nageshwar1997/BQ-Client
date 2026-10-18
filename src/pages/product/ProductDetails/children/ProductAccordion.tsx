import { Dropdown } from '@beautinique/frontend-components';
import { QuillContent } from '@beautinique/frontend-quill';

import type { IStorefrontProductDetails } from '@/types/api.type';

type TTexts = Pick<
  IStorefrontProductDetails,
  'description' | 'instructions' | 'ingredients' | 'additional'
>;

const SECTIONS = [
  { key: 'description', title: 'Description' },
  { key: 'instructions', title: 'How to use' },
  { key: 'ingredients', title: 'Ingredients' },
  { key: 'additional', title: 'More information' },
] as const satisfies readonly { key: keyof TTexts; title: string }[];

/** The texts of a product, a section each that opens and closes - the first one is open. A text the product has not got is not there. */
const ProductAccordion = ({ product }: { product: TTexts }) => {
  const sections = SECTIONS.flatMap(({ key, title }) => {
    const content = product[key];

    return content ? [{ key, title, content }] : [];
  });

  if (sections.length === 0) return null;

  return (
    <div className="space-y-4">
      {sections.map(({ key, title, content }, index) => (
        <Dropdown
          key={key}
          title={title}
          defaultOpen={index === 0}
          className="[&>button]:border-y-primary/30 [&>button]:border-y"
        >
          <QuillContent content={content} />
        </Dropdown>
      ))}
    </div>
  );
};

export default ProductAccordion;
