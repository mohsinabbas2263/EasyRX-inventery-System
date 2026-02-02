import { api } from "./apiClient";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const isDemo = () => !(import.meta.env.VITE_API_BASE_URL || "").trim();

export async function loginWeb({ companyCode, username, password }) {
  if (isDemo()) {
    await sleep(700);
    if (password !== "Password123") {
      const err = new Error("Invalid login credentials");
      err.code = 401;
      throw err;
    }
    return {
      token: "demo-web-token",
      user: { name: username || "Admin", role: "Admin", companyCode },
    };
  }
  const res = await api.post("/auth/login/web", { companyCode, username, password });
  return res.data;
}

export async function loginPos({ username, pinOrPassword }) {
  if (isDemo()) {
    await sleep(600);
    if ((pinOrPassword || "").length < 4) {
      const err = new Error("Invalid login credentials");
      err.code = 401;
      throw err;
    }
    return {
      token: "demo-pos-token",
      user: { name: username || "Cashier", role: "Cashier" },
    };
  }
  const res = await api.post("/auth/login/pos", { username, pinOrPassword });
  return res.data;
}

export async function requestResetLink({ email }) {
  if (isDemo()) {
    await sleep(600);
    if ((email || "").toLowerCase().includes("notfound")) {
      const err = new Error("Identity not found");
      err.code = 404;
      throw err;
    }
    return { ok: true };
  }
  const res = await api.post("/auth/forgot/request", { email });
  return res.data;
}

export async function resetPassword({ token, newPassword }) {
  if (isDemo()) {
    await sleep(600);
    if (token === "expired") {
      const err = new Error("Reset link expired");
      err.code = 410;
      throw err;
    }
    return { ok: true };
  }
  const res = await api.post("/auth/forgot/reset", { token, newPassword });
  return res.data;
}
