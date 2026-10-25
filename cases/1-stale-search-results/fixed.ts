// The fix: tag every request with the query it belongs to and drop responses
// that are no longer the latest. (In a real app: AbortController or React
// Query's per-key cancellation; the guard below is the minimal, framework-
// free version.)
type SearchResult = { id: number; title: string };

let latestRender: SearchResult[] = [];
export const getRendered = () => latestRender;
const render = (rows: SearchResult[]) => { latestRender = rows; };

let latestRequestId = 0;

export async function search(
  query: string,
  fetchImpl: (url: string, signal?: AbortSignal) => Promise<{ json: () => Promise<SearchResult[]> }>,
) {
  const requestId = ++latestRequestId;
  const res = await fetchImpl(`/api/search?q=${encodeURIComponent(query)}`);
  const rows = await res.json();
  if (requestId === latestRequestId) {
    render(rows); // only the most recent request may paint
  }
}
