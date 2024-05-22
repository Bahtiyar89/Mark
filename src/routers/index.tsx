import PublicRouter from "./PublicRouter";
import PrivateRouter from "./PrivateRouter";
import { Routes, Route, Navigate } from "react-router-dom";
import { Basket, Home, Login, DetailedProduct, Profile, Delivery } from "pages";
import { Layout } from "containers";
import Adminchat from "pages/Adminchat";
import Page404 from "pages/page404/Page404";

function MainRoutes() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />

          <Route path="basket" element={<Basket />} />
          <Route path="delivery" element={<Delivery />} />
          <Route path="/detailed/:id" element={<DetailedProduct />} />
          <Route element={<PrivateRouter />}>
            {/* <Route path="profile" element={<Profile />} /> */}
          </Route>
          <Route element={<PublicRouter />}>
            {/*  <Route path="login" element={<Login />} />*/}
          </Route>
          <Route path="/404" element={<Page404 />} />
        </Route>
        <Route path="adminchat" element={<Adminchat />} />

        <Route path="*" element={<Navigate replace to="/404" />} />
      </Routes>
    </div>
  );
}

export default MainRoutes;
