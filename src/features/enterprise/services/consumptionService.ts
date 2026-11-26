import API from "../../../services/http";
import type { ConsumptionPeriod, ZoneConsumption } from "../types/enterprise";

export const getZoneConsumption = async (period: ConsumptionPeriod, zoneId?: string) => {
  const res = await API.get<ZoneConsumption[]>("/zoneConsumption", {
    params: { period, ...(zoneId ? { zoneId } : {}) },
  });
  return res.data;
};