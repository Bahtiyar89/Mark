import React from "react";
import PublicRouter from "./PublicRouter";
import PrivateRouter from "./PrivateRouter";
import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "containers";
import Page404 from "pages/page404/Page404";

const Adminchat = React.lazy(() => import("pages/Adminchat"));
const Basket = React.lazy(() => import('pages/Basket'));
const Home = React.lazy(() => import('pages/Home'));

const DetailedProduct = React.lazy(() => import('pages/DetailedProduct'));
const Profile = React.lazy(() => import('pages/Profile'));
const Delivery = React.lazy(() => import('pages/Delivery'));
// import { Basket, Home, Login, DetailedProduct, Profile, Delivery } from "pages";



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
