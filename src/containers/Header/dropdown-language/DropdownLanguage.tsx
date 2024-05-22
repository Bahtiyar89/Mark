import React, { useContext, useState, useEffect } from "react";
import { Card, Text, UnstyledButton } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { ReactComponent as RusIcon } from "assets/images/lang/rus.svg";
import { ReactComponent as ChinaIcon } from "assets/images/lang/china.svg";
import { ReactComponent as EngIcon } from "assets/images/lang/eng.svg";
import { ReactComponent as DropIcon } from "assets/images/icons/chevron.svg";
import { setItemToStorage } from "utils/localStorage";
import LanguageContext from "../../../context/language/LanguageContext";
import "./style.css";

interface Props {
  color: string;
}

const getNavigatorLanguage = () => {
  // @ts-ignore

  if (navigator.languages && navigator.languages.length) {
    if (navigator.languages[0].slice(0, 2) == "ru") {
      return "ru";
    } else if (navigator.languages[0].slice(0, 2) == "ch") {
      return "ch";
    } else {
      return "en";
    }
  } else {
    return "en";
  }
};

const DropdownLanguage = ({ color }: Props) => {
  const languageContext = useContext(LanguageContext);
  const { global_language, postGlobalLanguage } = languageContext;

  const [t, i18n] = useTranslation();
  const [dropdown, setDropdown] = useState(false);

  const handleChangeLanguage = async (lang: string) => {
    await i18n.changeLanguage(lang);
    setItemToStorage("lang", lang);
    postGlobalLanguage(lang);
    setDropdown(false);
  };

  const handleLanguageShow = () => {
    if (global_language === "ru") {
      return (
        <>
          <RusIcon />
          <p style={{ color: color }}>Ru</p>
          <DropIcon stroke={color} />
        </>
      );
    } else if (global_language === "en") {
      return (
        <>
          <EngIcon color="red" />
          <p style={{ color: color }}>En</p>
          <DropIcon stroke={color} />
        </>
      );
    } else {
      return (
        <>
          <ChinaIcon />
          <p style={{ color: color }}>Ch</p>
          <DropIcon stroke={color} />
        </>
      );
    }
  };

  useEffect(() => {
    const language = getNavigatorLanguage();

    if (language) {
      handleChangeLanguage(language);
    } else {
      handleChangeLanguage("en");
    }
  }, []);

  const onDropDown = () => setDropdown(!dropdown)

  return (
    <div className="dropdown__lang">
      <div
        className="dropdown__lang-title"
        onClick={onDropDown}
      >
        {handleLanguageShow()}
      </div>
      {dropdown ? (
        <>
          <Card
            m={0}
            style={{
              position: "absolute",
              top: 30,
              zIndex: 1,
              width: 70,
            }}
            p={5}
            radius="md"
          >
            <UnstyledButton
              onClick={() => handleChangeLanguage("ru")}
              style={{
                width: 60,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text>Ru</Text>
              <RusIcon />
            </UnstyledButton>
            <UnstyledButton
              onClick={() => handleChangeLanguage("ch")}
              style={{
                width: 60,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                background: "white",
              }}
            >
              <Text>Ch</Text>
              <ChinaIcon />
            </UnstyledButton>
            <UnstyledButton
              onClick={() => handleChangeLanguage("en")}
              style={{
                width: 60,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text>En</Text>
              <EngIcon />
            </UnstyledButton>
          </Card>
        </>
      ) : null}
    </div>
  );
};

export default React.memo(DropdownLanguage);
