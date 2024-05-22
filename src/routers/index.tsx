import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from 'pages/Home'
import { Layout } from "containers";

const PrivateRouter = React.lazy(() => import("./PrivateRouter"));
const PublicRouter = React.lazy(() => import("./PublicRouter"));
const Page404 = React.lazy(() => import("pages/page404/Page404"));
const Adminchat = React.lazy(() => import("pages/Adminchat"));
const Basket = React.lazy(() => import('pages/Basket'));

const DetailedProduct = React.lazy(() => import('pages/DetailedProduct'));
const Profile = React.lazy(() => import('pages/Profile'));
const Delivery = React.lazy(() => import('pages/Delivery'));



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
