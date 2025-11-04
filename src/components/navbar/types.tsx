import { FC } from "react";
import { IconProps } from "../../types";

export interface SocialCommunityItem {
  id: number;
  icon: FC<IconProps>;
  label: string;
  link: string;
}

export interface LevelOneCategoryType {
  id: number;
  path?: string;
  level: number;
  label: string;
  category: string;
  component: FC;
  subCategories: LevelTwoCategoryType[];
}

export interface LevelTwoCategoryType {
  id: number;
  path?: string;
  level: number;
  label: string;
  category: string;
  subCategories: LevelThreeCategoryType[];
  heading?: string;
  videoUrl?: string;
  thumbnail?: string;
  description?: string;
}

export interface LevelThreeCategoryType {
  id: number;
  path?: string;
  level: number;
  label: string;
  category: string;
  icon: FC<IconProps>;
  description: string;
}

export interface Testimonial {
  id: number;
  content: string;
  name: string;
  role: string;
  image: string;
}
