import { describe, expect, it } from 'vitest';

import type { TCategoryHierarchy } from '@/types/api.type';

import { findCategoryBySlugs, findCategoryTrailById } from './category.util';

const tree = [
  {
    _id: 'face',
    name: 'Face',
    slug: 'face',
    level: 1,
    subcategories: [
      {
        _id: 'face-makeup',
        name: 'Face Makeup',
        slug: 'face-makeup',
        level: 2,
        parent: 'face',
        subcategories: [
          {
            _id: 'foundation',
            name: 'Foundation',
            slug: 'foundation',
            level: 3,
            parent: 'face-makeup',
            description: 'Base for the face.',
          },
        ],
      },
    ],
  },
  {
    _id: 'collections',
    name: 'Collections',
    slug: 'collections',
    level: 1,
    subcategories: [
      {
        _id: 'sugar-pop',
        name: 'Sugar Pop',
        slug: 'sugar-pop',
        level: 2,
        parent: 'collections',
        subcategories: [
          {
            // the same slug as a category under another main category: only the chain tells them apart
            _id: 'collections-face',
            name: 'Face',
            slug: 'face',
            level: 3,
            parent: 'sugar-pop',
            description: 'Face products of Sugar Pop.',
          },
        ],
      },
    ],
  },
] as unknown as TCategoryHierarchy[];

describe('findCategoryBySlugs', () => {
  it('finds a main category, a sub category and a final category by their slugs', () => {
    expect(findCategoryBySlugs(tree, ['face'])?.category._id).toBe('face');
    expect(findCategoryBySlugs(tree, ['face', 'face-makeup'])?.category._id).toBe('face-makeup');
    expect(findCategoryBySlugs(tree, ['face', 'face-makeup', 'foundation'])?.category._id).toBe(
      'foundation',
    );
  });

  it('gives the categories from the main one down to the one found', () => {
    const resolved = findCategoryBySlugs(tree, ['face', 'face-makeup', 'foundation']);

    expect(resolved?.trail.map((category) => category._id)).toEqual([
      'face',
      'face-makeup',
      'foundation',
    ]);
  });

  it('follows the chain, so one slug under two parents is the right category each time', () => {
    expect(findCategoryBySlugs(tree, ['face'])?.category._id).toBe('face');
    expect(findCategoryBySlugs(tree, ['collections', 'sugar-pop', 'face'])?.category._id).toBe(
      'collections-face',
    );
  });

  it('is undefined for a slug that does not exist, or that is in the wrong place', () => {
    expect(findCategoryBySlugs(tree, ['nope'])).toBeUndefined();
    expect(findCategoryBySlugs(tree, ['face', 'nope'])).toBeUndefined();
    // `foundation` is under `face-makeup`, not directly under `face`
    expect(findCategoryBySlugs(tree, ['face', 'foundation'])).toBeUndefined();
    // a final category has nothing under it
    expect(
      findCategoryBySlugs(tree, ['face', 'face-makeup', 'foundation', 'more']),
    ).toBeUndefined();
  });

  it('is undefined when there are no slugs', () => {
    expect(findCategoryBySlugs(tree, [])).toBeUndefined();
    expect(findCategoryBySlugs(tree, [undefined, undefined])).toBeUndefined();
  });

  it('stops at the first slug that is missing (the shorter address is the category)', () => {
    expect(findCategoryBySlugs(tree, ['face', undefined, 'foundation'])?.category._id).toBe('face');
  });
});

describe('findCategoryTrailById', () => {
  const ids = (id: string) => findCategoryTrailById(tree, id)?.map((category) => category._id);

  it('is the main category alone for the id of a main category', () => {
    expect(ids('face')).toEqual(['face']);
    expect(ids('collections')).toEqual(['collections']);
  });

  it('is the categories from the main one down to a final category (the category of a product)', () => {
    expect(ids('foundation')).toEqual(['face', 'face-makeup', 'foundation']);
    expect(ids('collections-face')).toEqual(['collections', 'sugar-pop', 'collections-face']);
  });

  it('is the categories down to a sub category', () => {
    expect(ids('face-makeup')).toEqual(['face', 'face-makeup']);
  });

  it('is undefined for an id the tree does not have, and for no tree', () => {
    expect(ids('nope')).toBeUndefined();
    expect(findCategoryTrailById([], 'face')).toBeUndefined();
  });

  it('finds the right one among categories that have the same slug (it follows ids, not slugs)', () => {
    // `face` is the slug of a main category and of a final one under Collections
    expect(findCategoryTrailById(tree, 'collections-face')?.at(-1)?.slug).toBe('face');
    expect(ids('face')).toEqual(['face']);
  });
});
