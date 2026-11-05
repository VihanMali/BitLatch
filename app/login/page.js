import Image from "next/image";
import Link from "next/link";
import LoginForm from "./LoginForm";
import styles from "./page.module.css";

export default function LoginPage() {
  return (
    <main className={styles.page}>
      <Link className={styles.brand} href="/" aria-label="BitLatch home">
        <Image src="/bitlatch-logo.svg?rev=8" width={40} height={40} alt="" aria-hidden="true" />
        <span><b>Bit</b>Latch</span>
      </Link>

      <section className={styles.card} aria-labelledby="login-title">
        <span className={styles.eyebrow}>WELCOME BACK</span>
        <h1 id="login-title">Log in to BitLatch</h1>
        <p className={styles.description}>Pick up where you left off.</p>

        <LoginForm />

        <p className={styles.signupPrompt}>
          New to BitLatch? <a href="/signup">Create an account</a>
        </p>
      </section>

      <p className={styles.footer}>A community for people who build.</p>
    </main>
  );
}
