"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { useLanguage } from "@/components/LanguageProvider";

export default function AdminLoginForm() {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(t("invalidCredentials"));
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-4">
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-md space-y-5"
      >
        <Logo size={72} className="mx-auto" />
        <h1
          className={`text-center text-2xl font-semibold text-text ${
            lang === "te" ? "font-telugu" : "font-heading"
          }`}
        >
          {t("adminLogin")}
        </h1>

        <div>
          <label
            htmlFor="username"
            className={`mb-1 block text-sm font-medium text-text ${
              lang === "te" ? "font-telugu" : ""
            }`}
          >
            {t("username")}
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border border-card-border bg-ivory px-4 py-2 text-text outline-none focus:border-saffron"
            autoComplete="username"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className={`mb-1 block text-sm font-medium text-text ${
              lang === "te" ? "font-telugu" : ""
            }`}
          >
            {t("password")}
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-card-border bg-ivory px-4 py-2 text-text outline-none focus:border-saffron"
            autoComplete="current-password"
          />
        </div>

        {error && (
          <p className={`text-sm text-red-700 ${lang === "te" ? "font-telugu" : ""}`}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-lg bg-saffron py-2.5 font-medium text-white transition-colors hover:bg-saffron/90 disabled:cursor-not-allowed disabled:opacity-60 ${
            lang === "te" ? "font-telugu" : ""
          }`}
        >
          {t("login")}
        </button>
      </form>
    </div>
  );
}
