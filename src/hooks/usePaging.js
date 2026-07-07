import { useEffect, useState } from "react";

// 전광판은 스크롤이 불가능하므로 목록을 일정 개수씩 잘라 자동으로 페이지를 넘긴다.
// items: 전체 목록, perPage: 페이지당 개수, intervalMs: 전환 주기.
export function usePaging(items, perPage, intervalMs = 6000) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const [page, setPage] = useState(0);

  // 목록 길이가 줄어 현재 페이지가 범위를 벗어나면 첫 페이지로 되돌린다.
  useEffect(() => {
    if (page >= totalPages) setPage(0);
  }, [page, totalPages]);

  useEffect(() => {
    if (totalPages <= 1) return;
    const id = setInterval(() => setPage((p) => (p + 1) % totalPages), intervalMs);
    return () => clearInterval(id);
  }, [totalPages, intervalMs]);

  const safePage = page % totalPages;
  const pageItems = items.slice(safePage * perPage, safePage * perPage + perPage);

  return { pageItems, page: safePage, totalPages };
}
