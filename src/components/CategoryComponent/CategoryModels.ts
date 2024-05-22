export interface CategoryAction {
  RecID: number;
  RecName: string;
  RecName_en: string;
  RecName_ru: string;
  RecName_zh_hans: string;
  RecPict: null;
  description: null;
  description_en: null;
  description_ru: null;
  description_zh_hans: null;
  priority: number;
  slug: string;
  checked: boolean | false;
  subcategories: SubCategoryAction[];
}

export interface SubCategoryAction {
  RecID: number;
  RecName: string;
  RecName_en: string;
  RecName_ru: string;
  RecName_zh_hans: string;
  RecPict: string | null | undefined;
  description: null;
  description_en: null;
  description_ru: null;
  description_zh_hans: null;
  priority: number;
  slug: string;
  checked: boolean | false;
  subcategories: any[];
}
