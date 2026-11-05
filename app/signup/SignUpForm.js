"use client";

import { useActionState } from "react";
import { signUpAction } from "@/app/actions/auth";
import styles from "./page.module.css";

export default function SignUpForm() {
  const [state, formAction, pending] = useActionState(signUpAction, null);

  return (
    <form className={styles.formFields} action={formAction}>
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
          placeholder="Choose a username"
          required
        />
        <span className={styles.fieldHint}>3–24 letters, numbers, or underscores.</span>
      </div>

      <div className={styles.field}>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={12}
          maxLength={128}
          placeholder="Create a password"
          required
        />
        <span className={styles.fieldHint}>Use at least 12 characters.</span>
      </div>

      {state?.error ? <p className={styles.formError} role="alert">{state.error}</p> : null}

      <button className={styles.submitButton} type="submit" disabled={pending}>
        {pending ? "Creating account…" : "Create account"}
        <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
