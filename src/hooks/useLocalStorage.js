import { useState } from "react";

// 전광판 설정(표시 의사, 레이아웃, 컬러 등)을 기기별로 유지하기 위한 훅.
// TV가 재부팅되어도 마지막 설정 그대로 복원된다.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const set = (next) => {
    setValue((prev) => {
      const resolved = typeof next === "function" ? next(prev) : next;
      localStorage.setItem(key, JSON.stringify(resolved));
      return resolved;
    });
  };

  return [value, set];
}
