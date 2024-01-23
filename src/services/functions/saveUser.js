import CryptoJS from "crypto-js";

const saltkey = process.env.REACT_APP_SALT_KEY;

export const decodeUser = () => {
  let userDataDecrypt;
  if (localStorage.getItem("AIO")) {
    const userData = localStorage.getItem("AIO");
    const decipherText = CryptoJS.AES.decrypt(userData, saltkey);
    userDataDecrypt = JSON.parse(decipherText.toString(CryptoJS.enc.Utf8));
  }
  return userDataDecrypt;
};
