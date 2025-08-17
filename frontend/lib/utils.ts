import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CHATBOT_NAME = "Quasar AI Assistant";

export const ALLROUTER = {
  LOGIN: "/login",
  REGISTER: "/register",
  HOME: "/",
  ALLCHAT: "/chat",
};
