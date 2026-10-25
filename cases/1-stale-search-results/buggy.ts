// The bug: a slower response for an older query overwrites the results of a
// newer query. Classic stale-response race in client-side search.
type SearchResult = { id: number; title: string };

let latestRender: SearchResult[] = [];
export const getRendered = () => latestRender;
const render = (rows: SearchResult[]) => { latestRender = rows; };

export async function search(
  query: string,
  fetchImpl: (url: string) => Promise<{ json: () => Promise<SearchResult[]> }>,
) {
  const res = await fetchImpl(`/api/search?q=${encodeURIComponent(query)}`);
  const rows = await res.json();
  render(rows); // no freshness check: late arrivals always win
}
