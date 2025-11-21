const pattern : string =  "0123456789";
const length = pattern.length;
export default function genHashvalue(size: number) : string {
    let hash = "";
    for (let i = 0; i < size; i++) {
        hash += pattern[Math.floor(Math.random() * length)];
    }
    return hash;
}

export function generateRandomCode(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
