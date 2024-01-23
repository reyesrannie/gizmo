import CryptoJS from "crypto-js";

const loginService = () => {
  const saltkey = process.env.REACT_APP_SALT_KEY;

  const loginUser = (data) => {
    const userData = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      saltkey
    ).toString();
    localStorage.setItem("AIO", userData);
    localStorage.setItem("AIO_token", data?.token);
  };
  return { loginUser };
};

export const { loginUser } = loginService();
