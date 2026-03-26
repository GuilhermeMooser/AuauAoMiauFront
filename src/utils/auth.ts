import { getViteApiDomain } from "@/config/runtimeEnv";
import { parseCookies, destroyCookie, setCookie } from "nookies";
import { Login } from "@/types/login";

export const authenticate = (login: Login) => {
  console.log('domain:', getViteApiDomain());
  setCookie(null, "login", JSON.stringify(login), {
    maxAge: 1 * 60 * 60,
    path: "/",
    domain: getViteApiDomain(),
    secure: true,
    sameSite: "lax",
  });
};

export const logoutFront = () => {
  destroyCookie(null, "login", {
    path: "/",
    domain: getViteApiDomain(),
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
