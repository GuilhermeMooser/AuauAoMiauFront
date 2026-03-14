// services/notification.service.ts
import { AdopterNotification } from "@/types/notification";
import {api} from "./api";

export const getPendingNotifications = async (): Promise<
  AdopterNotification[]
> => {
  const response = await api.get<AdopterNotification[]>(
    "/notifications/v1/pending",
  );
  return response.data;
};

export const clearAllNotifications = async (): Promise<void> => {
  await api.delete("/notifications/v1/pending");
};

export const dismissNotification = async (adopterId: string): Promise<void> => {
  await api.delete(`/notifications/v1/pending/${adopterId}`);
};
