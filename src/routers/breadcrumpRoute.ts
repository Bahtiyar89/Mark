export interface RoutesI {
  path: string;
  breadcrumb: string;
}

export const breadcrumpRoute: RoutesI[] = [
  { path: "/", breadcrumb: "catalog" },
  { path: "/profile", breadcrumb: "profile" },
  { path: "/delivery", breadcrumb: "delivery" },
  { path: "/:id", breadcrumb: "product" },
];
