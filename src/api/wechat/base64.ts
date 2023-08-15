const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

// 将 ASCII 字符串转换为 UTF-8 字节数组
export function utf8ToByteArray(str: string) {
  let bytes = [];
  for (let i = 0; i < str.length; i++) {
    let charCode = str.charCodeAt(i);
    if (charCode < 128) {
      bytes.push(charCode);
    } else if (charCode < 2048) {
      bytes.push(192 | (charCode >> 6));
      bytes.push(128 | (charCode & 63));
    } else if (charCode < 65536) {
      bytes.push(224 | (charCode >> 12));
      bytes.push(128 | ((charCode >> 6) & 63));
      bytes.push(128 | (charCode & 63));
    } else {
      bytes.push(240 | (charCode >> 18));
      bytes.push(128 | ((charCode >> 12) & 63));
      bytes.push(128 | ((charCode >> 6) & 63));
      bytes.push(128 | (charCode & 63));
    }
  }
  return bytes;
}

// 将 UTF-8 字节数组转换为 base64 编码字符串
export function byteArrayToBase64(bytes: number[]) {
  let base64 = "";
  let paddingCount = 0;
  let last = [];
  for (let i = 0; i < bytes.length; i += 3) {
    let byte1 = bytes[i];
    let byte2 = bytes[i + 1] || 0;
    let byte3 = bytes[i + 2] || 0;
    last[0] = byte1;
    last[1] = byte2;
    last[2] = byte3;

    let group1 = byte1 >> 2;
    let group2 = ((byte1 & 3) << 4) | (byte2 >> 4);
    let group3 = ((byte2 & 15) << 2) | (byte3 >> 6);
    let group4 = byte3 & 63;
    if (isNaN(byte2)) {
      group3 = group4 = 64;
      paddingCount = 1;
    } else if (isNaN(byte3)) {
      group4 = 64;
      paddingCount = 2;
    }
    base64 += base64Chars.charAt(group1) + base64Chars.charAt(group2) + base64Chars.charAt(group3) + base64Chars.charAt(group4);
  }
  if (paddingCount > 0) {
    base64 = base64.slice(0, base64.length - paddingCount) + "===".slice(0, paddingCount);
  }

  // @ts-ignore
  if (!last[1]) return base64.replace(new RegExp("AA$"), "==");
  // @ts-ignore
  if (!last[2]) return base64.replace(new RegExp("A$"), "=");
  return base64;
}

export function btoa(str: string) {
  return byteArrayToBase64(utf8ToByteArray(str));
}