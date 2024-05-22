import { Button } from "components";
import { useTranslation } from "react-i18next";
import { Pagination } from "@mantine/core";
import classes from "./style.module.css";
import { useEffect, useState } from "react";

interface Props {
  allProductsCount: number;
  devidePage: number;
  currentPage: number;
  getPagination: (page: any) => void;
  showMore: (current: number) => void;
}

const ShowMore = ({
  allProductsCount,
  devidePage,
  currentPage,
  getPagination,
  showMore,
}: Props) => {
  const [t, i18n] = useTranslation();
  const [all, setAll] = useState(0);
  const [pageCurrent, setPageCurrent] = useState(2);
  const [pageSize, setPageSize] = useState(0);

  useEffect(() => {
    setAll(allProductsCount);
    setPageSize(Math.ceil(allProductsCount / devidePage));
    setPageCurrent(2);
  }, [devidePage, allProductsCount]);

  const handlePageChange = (val: number) => {
    getPagination(val);
    setPageCurrent(val);
  };

  const handleShowMore = () => {
    showMore(pageCurrent);
  };
  console.log("all: ", all);
  console.log("pageSize: ", pageSize);

  const handlePagination = () => {
    if (all >= devidePage) {
      return (
        <Pagination
          pt={20}
          pb={40}
          total={pageSize}
          position="center"
          onChange={(val) => handlePageChange(val)}
          styles={(theme) => ({
            item: {
              "&[data-active]": {
                backgroundImage: theme.fn.gradient({
                  from: "red",
                  to: "yellow",
                }),
                background: "transparent",
                borderRadius: "0px",
                borderWidth: "0px",
                color: "black",
              },
              background: "transparent",
              borderRadius: "0px",
              borderWidth: "0px",
              color: "grey",
              display: "flex",
            },
          })}
        />
      );
    } else return;
  };

  return (
    <div>
      <div className={classes.main__products}>
        <div className={classes.pagination}>
          {pageSize != currentPage ? (
            <Button onClick={() => handleShowMore()}>
              {t("show_more")} 24
            </Button>
          ) : null}
        </div>
        {handlePagination()}
      </div>
    </div>
  );
};

export default ShowMore;
