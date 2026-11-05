"use client";

import { useActionState } from "react";
import { logInAction } from "@/app/actions/auth";
import styles from "./page.module.css";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(logInAction, null);

  return (
    <form className={styles.form} action={formAction}>
      <div className={styles.field}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck="false"
          minLength={3}
          maxLength={24}
          pattern="[A-Za-z0-9_]{3,24}"
          placeholder="Your username"
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          minLength={12}
          maxLength={128}
          placeholder="Your password"
          required
        />
      </div>

      {state?.error ? <p className={styles.error} role="alert">{state.error}</p> : null}

      <button type="submit" disabled={pending}>
        {pending ? "Signing in…" : "Log in"}
        <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
