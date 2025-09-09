import CryptoJS from "crypto-js";

export const encrypt = async({plainText,cipherText}={}) => {
return  CryptoJS.AES.encrypt(plainText,cipherText).toString();
};
