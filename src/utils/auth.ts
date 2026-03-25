import { parseCookies, destroyCookie, setCookie } from "nookies";
import { Login } from "@/types/login";

export const authenticate = (login: Login) => {
  setCookie(null, "login", JSON.stringify(login), {
    maxAge: 1 * 60 * 60,
    path: "/",
    // domain: "localhost", LOCALMENTE TIRA
  });
};

export const logoutFront = () => {
  destroyCookie(null, "login", {
    path: "/",
    domain: import.meta.env.VITE_API_DOMAIN,
  });
};

export const getAuth = () => {
  const { login } = parseCookies();
  if (login) {
    const auth: Login = JSON.parse(login);
    return auth;
  }

  return null;
};
