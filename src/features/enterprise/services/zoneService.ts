import { fetchOne, fetchPage } from "../../../services/query";
import type { ListQuery } from "../../../services/query";
import type { Paginated } from "../../../shared/types/api";
import type { Zone } from "../../../shared/types/models";

export const getZones = (query: ListQuery, signal?: AbortSignal): Promise<Paginated<Zone>> =>
  fetchPage<Zone>("/zones", query, signal);

export const getZoneById = (zoneId: string, signal?: AbortSignal): Promise<Zone> =>
  fetchOne<Zone>(`/zones/${zoneId}`, signal);