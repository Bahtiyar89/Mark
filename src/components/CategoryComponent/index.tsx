import { useTranslation } from "react-i18next";

import { Checkbox } from "components";
import st from "./st.module.css";
import { CategoryAction } from "./CategoryModels";
import Utils from "utils/Utils";

interface Props {
  categories: CategoryAction[];
  shewronCategory: boolean;
  changeHandler: (event: any, slug: any) => void;
}

const CategoryComponent = ({
  categories,
  shewronCategory,
  changeHandler,
}: Props) => {
  const [t, i18n] = useTranslation();

  const getCategory = (item: any) => {
    if (i18n.language == "en") {
      return item?.RecName_en;
    } else if (i18n.language == "ru") {
      return item?.RecName;
    } else {
      return item?.RecName_zh_hans;
    }
  };

  const getSubCategory = (item: any) => {
    if (i18n.language == "en") {
      return item?.RecName_en;
    } else if (i18n.language == "ru") {
      return item?.RecName;
    } else {
      return item?.RecName_zh_hans;
    }
  };

  return (
    <>
      {categories.map((category: any, idx: any) => {
        return (
          <div key={idx}>
            {shewronCategory && (
              <div style={{ marginTop: "3px" }}>
                <Checkbox
                  inp={true}
                  key={Utils.makeuid(10)}
                  checked={category.checked}
                  onChange={(event) => changeHandler(event, category?.slug)}
                  label={getCategory(category)}
                />
              </div>
            )}

            {shewronCategory &&
              category.subcategories.map((sub: any, id: any) => {
                return (
                  <div key={id} className={st.items_checkbox}>
                    <Checkbox
                      inp={true}
                      key={Utils.makeuid(10)}
                      checked={sub.checked}
                      onChange={(event) => changeHandler(event, sub?.slug)}
                      label={getSubCategory(sub)}
                    />
                  </div>
                );
              })}
          </div>
        );
      })}
    </>
  );
};

export default CategoryComponent;
