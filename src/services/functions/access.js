import { decodeUser } from "./saveUser";

export const hasAccess = (item = []) => {
  const user = decodeUser();

  const withAccess = user?.role?.access_permission?.some((access) =>
    item?.includes(access)
  );

  return withAccess;
};
