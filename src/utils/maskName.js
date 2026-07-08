// 개인정보 보호를 위해 이름 가운데 글자를 마스킹한다.
// 2글자면 마지막 글자, 3글자 이상이면 가운데 글자(들)를 가린다.
export function maskName(name) {
  if (!name) return name;
  const chars = [...name];
  if (chars.length <= 1) return chars.join("");
  if (chars.length === 2) return `${chars[0]}*`;
  return chars.map((c, i) => (i > 0 && i < chars.length - 1 ? "*" : c)).join("");
}
