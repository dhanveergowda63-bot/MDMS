import API from "../../../services/http";
import type { Meter } from "../types/enterprise";
import { fetchList } from "./query";
import type { ListParams } from "./query";

// Pass filters: { zoneId: "ZN-001", status: "Active" } to narrow the list
export const getMeters = (params?: ListParams) =>
  fetchList<Meter>("/meters", params);

export const getMeterById = async (meterId: string) => {
  const res = await API.get<Meter>(`/meters/${meterId}`);
  return res.data;
};
