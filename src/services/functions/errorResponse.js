const errorResponses = () => {
  const objectError = (error, setError, setToast) => {
    if (error.status === 422) {
      Object.entries(error?.data?.errors).forEach(([key, value]) => {
        setError(key, {
          type: "validation",
          message: value[0],
        });
      });
      setToast(error?.data?.message, { variant: "error" });
    } else if (error.status === "FETCH_ERROR") {
      setToast("Connection failed please check your internet", {
        variant: "error",
      });
    } else {
      setToast(error?.data?.message, { variant: "error" });
    }
  };

  const singleError = (error, setToast) => {
    if (error.status === 422) {
      setToast(error?.data?.message, { variant: "error" });
    } else if (error.status === "FETCH_ERROR") {
      setToast("Connection failed please check your internet", {
        variant: "error",
      });
    } else {
      setToast(error?.data?.message, { variant: "error" });
    }
  };

  return { objectError, singleError };
};

export const { objectError, singleError } = errorResponses();
