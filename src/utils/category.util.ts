import type {
  TCategoryHierarchy,
  TCategoryHierarchyNode,
  TLevel1,
  TLevel2,
  TLevel3,
} from '@/types/api.type';

/** A category of the tree, of any of its three levels. */
export type TCategoryNode =
  | TCategoryHierarchyNode<TLevel1>
  | TCategoryHierarchyNode<TLevel2>
  | TCategoryHierarchyNode<TLevel3>;

export interface IResolvedCategory {
  /** The deepest category the slugs lead to. */
  category: TCategoryNode;
  /** The categories from the main one down to `category`. */
  trail: TCategoryNode[];
}

/**
 * Follows the slugs of a category page (`/products/face/face-makeup/foundation`) down the tree of
 * categories. Slugs are only unique among the categories of one parent, so the chain is what finds
 * the category, not the last slug on its own. `undefined` when there is no such category (a slug
 * that does not exist, or one in the wrong place), and for no slugs at all.
 */
export const findCategoryBySlugs = (
  categories: TCategoryHierarchy[],
  slugs: (string | undefined)[],
): IResolvedCategory | undefined => {
  const trail: TCategoryNode[] = [];
  let level: TCategoryNode[] = categories;

  for (const slug of slugs) {
    if (!slug) break;

    const match = level.find((category) => category.slug === slug);

    if (!match) return undefined;

    trail.push(match);
    level = match.subcategories ?? [];
  }

  const category = trail.at(-1);

  return category ? { category, trail } : undefined;
};

/**
 * The categories from the main one down to the category with this id - the trail of a product's category, for its
 * breadcrumb and for "more like this". `undefined` when the tree has no such category.
 */
export const findCategoryTrailById = (
  categories: TCategoryHierarchy[],
  id: string,
): TCategoryNode[] | undefined => {
  const walk = (nodes: TCategoryNode[], trail: TCategoryNode[]): TCategoryNode[] | undefined => {
    for (const node of nodes) {
      const next = [...trail, node];

      if (node._id === id) return next;

      const found = walk(node.subcategories ?? [], next);

      if (found) return found;
    }

    return undefined;
  };

  return walk(categories, []);
};
