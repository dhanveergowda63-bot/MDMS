import API from "../../../services/http";
import type { User } from "../types/enterprise";
import { fetchList } from "./query";
import type { ListParams } from "./query";

// Admins tab:    filters: { role: "zone_admin" }
// Consumers tab: filters: { role: "customer" }
export const getUsers = (params?: ListParams) =>
  fetchList<User>("/users", params);

export const getUserById = async (userId: string) => {
  const res = await API.get<User>(`/users/${userId}`);
  return res.data;
};
