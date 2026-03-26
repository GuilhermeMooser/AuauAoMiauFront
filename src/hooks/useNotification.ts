// hooks/useNotificationBell.ts
import { getViteApiUrl } from "@/config/runtimeEnv";
import {
  clearAllNotifications,
  dismissNotification,
  getPendingNotifications,
} from "@/services/notification";
import {AdopterNotification} from "@/types/notification";
import {useState, useEffect} from "react";

export function useNotificationBell() {
  const [pending, setPending] = useState<AdopterNotification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPendingNotifications()
      .then(setPending)
      .catch(() => setError("Erro ao carregar notificações"));
  }, []);

  useEffect(() => {
   
    const es = new EventSource(
      `${getViteApiUrl()}/notifications/v1/stream`,
      {
        withCredentials: true,
      },
    );

    es.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPending((prev) => [...prev, ...data.adopters]);
    };

    es.onerror = () => {
      setError("Conexão SSE perdida");
      es.close();
    };

    return () => es.close();
  }, []);

  async function clearAll() {
    try {
      setLoading(true);
      await clearAllNotifications();
      setPending([]);
      setOpen(false);
    } catch {
      setError("Erro ao limpar notificações");
    } finally {
      setLoading(false);
    }
  }

  async function dismissOne(adopterId: string) {
    try {
      await dismissNotification(adopterId);
      setPending((prev) => prev.filter((a) => a.id !== adopterId));
    } catch {
      setError("Erro ao remover notificação");
    }
  }

  function dismissError() {
    setError(null);
  }

  return {
    pending,
    open,
    setOpen,
    clearAll,
    dismissOne,
    loading,
    error,
    dismissError,
  };
}
