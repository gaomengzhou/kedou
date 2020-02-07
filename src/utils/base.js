/**
 * 加密|解密组件
 */

import CryptoJS  from "crypto-js";


// 去空格
export function replaceSpace(str){
   if(typeof(str)!=='string') return null;
    return str.replace(/\s/g,"");
}

export function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}

function b64DecodeUnicode(str) {
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}


// 参数加密
export function encrypt(data){ 
    let postData = JSON.stringify(data);
    let srcs = CryptoJS.enc.Utf8.parse(postData);
    let encrypted = CryptoJS.AES.encrypt(srcs, CryptoJS.enc.Utf8.parse("MUGNHU3FG5RE8F4F"), { iv: CryptoJS.enc.Utf8.parse("0ELFZI7HPQT1OW4L"),mode:CryptoJS.mode.CBC,padding: CryptoJS.pad.Pkcs7});
    let postDataHexStr = CryptoJS.enc.Hex.parse(encrypted.ciphertext.toString().toUpperCase());
    let postDataEnd = CryptoJS.enc.Base64.stringify(postDataHexStr);
    let str = b64EncodeUnicode(postDataEnd);
    return str;
}

// 参数解密
export function  crypt(data){
    let base64data = b64DecodeUnicode(data);
    let decrypt = CryptoJS.AES.decrypt(base64data, CryptoJS.enc.Utf8.parse("MUGNHU3FG5RE8F4F"), { iv: CryptoJS.enc.Utf8.parse("0ELFZI7HPQT1OW4L"),mode:CryptoJS.mode.CBC,padding: CryptoJS.pad.Pkcs7});
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}

