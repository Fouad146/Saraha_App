import CryptoJS from "crypto-js";

export const decrypt = async ({ plainText, cipherText } = {}) => {
  return CryptoJS.AES.decrypt(plainText, cipherText).toString(CryptoJS.enc.Utf8);
};
