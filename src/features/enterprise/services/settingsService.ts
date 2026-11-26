import API from "../../../services/http";
import type { EnterpriseSettings } from "../types/enterprise";

export const getEnterpriseSettings = async () => {
  const res = await API.get<EnterpriseSettings>("/enterpriseSettings");
  return res.data;
};
