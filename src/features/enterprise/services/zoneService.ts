import API from "../../../services/http";
import type { Zone } from "../types/enterprise";
import { fetchList } from "./query";
import type { ListParams } from "./query";

export const getZones = (params?: ListParams) =>
  fetchList<Zone>("/zones", params);

export const getZoneById = async (zoneId: string) => {
  const res = await API.get<Zone>(`/zones/${zoneId}`);
  return res.data;
};
