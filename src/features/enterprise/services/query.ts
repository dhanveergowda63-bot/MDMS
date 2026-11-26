import API from "../../../services/http";

// true  -> json-server 1.x   (npm ls json-server shows 1.x)
// false -> json-server 0.17.x
export const JSON_SERVER_V1 = true;

export interface ListParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  search?: string;
  searchField?: string;
  filters?: Record<string, string | undefined>;
}

export interface PagedResult<T> {
  data: T[];
  total: number;
}

// Key for range filters, e.g. rangeKey("timestamp", "gte")
export const rangeKey = (field: string, op: "gte" | "lte") =>
  JSON_SERVER_V1 ? `${field}:${op}` : `${field}_${op}`;

interface V1Page<T> {
  data: T[];
  items: number;
}

export async function fetchList<T>(
  path: string,
  p: ListParams = {},
): Promise<PagedResult<T>> {
  const params: Record<string, string | number> = {};

  for (const [key, value] of Object.entries(p.filters ?? {})) {
    if (value && value !== "all") params[key] = value;
  }

  if (p.search && p.searchField) {
    params[
      JSON_SERVER_V1 ? `${p.searchField}:contains` : `${p.searchField}_like`
    ] = p.search;
  }

  if (p.sortBy) {
    const desc = p.sortDir === "desc";
    if (JSON_SERVER_V1) {
      params._sort = desc ? `-${p.sortBy}` : p.sortBy;
    } else {
      params._sort = p.sortBy;
      params._order = desc ? "desc" : "asc";
    }
  }

  if (p.page && p.pageSize) {
    params._page = p.page;
    params[JSON_SERVER_V1 ? "_per_page" : "_limit"] = p.pageSize;
  }

  const res = await API.get<T[] | V1Page<T>>(path, { params });

  if (Array.isArray(res.data)) {
    const header = res.headers["x-total-count"];
    return { data: res.data, total: header ? Number(header) : res.data.length };
  }
  return { data: res.data.data, total: res.data.items };
}
