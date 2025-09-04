import { toast } from "sonner";

export const toastStatusArray = [
  "success",
  "error",
  "info",
  "warning",
] as const;
export type ToastStatus = (typeof toastStatusArray)[number];

export const useToast = () => {
  const showToast = (message: string, status: ToastStatus = "info") =>
    toast?.[status]?.(message) || toast(message);

  return { showToast };
};
