import { useTranslation } from "react-i18next";
import { breadcrumpRoute } from "routers/breadcrumpRoute";
import useReactRouterBreadcrumbs from "use-react-router-breadcrumbs";
import { Link } from "react-router-dom";
import { ReactComponent as ArrowLeft } from "assets/images/icons/ArrowLeft.svg";

const BreadCrumb = () => {
  const breadcrumbs = useReactRouterBreadcrumbs(breadcrumpRoute);
  const [t, i18n] = useTranslation();

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          position: "absolute",
          left: 0,
          top: 4,
        }}
      >
        <ArrowLeft style={{ marginTop: 4 }} />
        {breadcrumbs.map(({ match, breadcrumb }, idx) => {
          return (
            <div className="item" key={match.pathname}>
              <Link
                style={
                  idx + 1 == breadcrumbs.length
                    ? {
                        fontSize: 16,
                        color: "black",
                        textDecoration: "none",
                      }
                    : {
                        fontSize: 16,
                        color: "grey",
                        textDecoration: "none",
                      }
                }
                to={match.pathname}
              >
                {t(breadcrumb["props"].children)}
              </Link>
              <span style={{ paddingRight: 10, paddingLeft: 10 }}>
                {idx + 1 == breadcrumbs.length ? "" : "/"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BreadCrumb;
