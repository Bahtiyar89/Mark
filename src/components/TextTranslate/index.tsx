import { useTranslation } from "react-i18next";

const TextTranslate = ({ item }: any) => {
  const [t, i18n] = useTranslation();

  return (
    <>
      {i18n.language == "en"
        ? item?.RecName_en
        : i18n.language == "ru"
        ? item?.RecName_ru
        : item?.RecName_zh_hans}
    </>
  );
};

export default TextTranslate;
