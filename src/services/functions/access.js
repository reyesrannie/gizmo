import { decodeUser } from "./saveUser";

export const hasAccess = (item = []) => {
  const user = decodeUser();

  const withAccess = user?.role?.access_permission?.some((access) =>
    item?.includes(access)
  );

  return withAccess;
};

export const isAp = (item) => {
  const user = decodeUser();
  const withAccess = !user?.scope_tagging?.some(
    (ap) => ap?.ap_code === item?.toString()
  );
  if (hasAccess(["tagging"])) {
    return false;
  } else {
    return withAccess;
  }
};
