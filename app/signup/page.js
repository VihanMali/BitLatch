import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import SignUpForm from "./SignUpForm";

const benefits = [
  {
    number: "01",
    title: "Find your people",
    description: "Join developer communities built around what you love to make.",
  },
  {
    number: "02",
    title: "Build your way",
    description: "Start solo or bring a team together around a shared idea.",
  },
  {
    number: "03",
    title: "Keep the work moving",
    description: "Bring tasks, decisions, and project progress into view.",
  },
];

export default function SignUp() {
  return (
    <main className={styles.main}>
      <section className={styles.leftPanel} aria-labelledby="signup-intro">
        <Link className={styles.brand} href="/" aria-label="BitLatch home">
          <Image src="/bitlatch-logo.svg?rev=8" width={42} height={42} alt="" aria-hidden="true" />
          <span className={styles.brandBit}>Bit</span>
          <span className={styles.brandLatch}>Latch</span>
        </Link>

        <div className={styles.intro}>
          <span className={styles.eyebrow}><i /> A community for people who build</span>
          <h1 id="signup-intro">Find your people.<br />Build what matters.</h1>
          <p className={styles.introCopy}>
            Meet developers who share your curiosity, then turn your next idea into a project you can be proud of.
          </p>

          <div className={styles.benefits}>
            {benefits.map((benefit) => (
              <article className={styles.benefit} key={benefit.number}>
                <span className={styles.benefitNumber}>{benefit.number}</span>
                <div>
                  <h2>{benefit.title}</h2>
                  <p>{benefit.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.projectPreview} aria-label="Example BitLatch project workspace">
          <div className={styles.previewTop}>
            <div>
              <span className={styles.previewLabel}>A PROJECT IN MOTION</span>
              <h2>Open Source Starter</h2>
            </div>
            <span className={styles.previewStatus}><i /> ACTIVE</span>
          </div>
          <div className={styles.previewMeta}>
            <span>Milestone 02</span>
            <span>3 collaborators</span>
          </div>
          <div className={styles.progressTrack}><span /></div>
          <div className={styles.previewBottom}>
            <span>Good ideas move further together.</span>
            <div className={styles.avatarStack} aria-hidden="true">
              <i>A</i><i>J</i><i>M</i><b>+</b>
            </div>
          </div>
          <span className={styles.previewCorner} aria-hidden="true" />
        </div>

        <div className={styles.footerNote}>
          <span>COMMUNITY</span><i /><span>COLLABORATION</span><i /><span>PROJECTS</span>
        </div>
      </section>

      <aside className={styles.formSide} aria-label="Sign up">
        <section className={styles.container} aria-labelledby="form-title">
          <div className={styles.formIntro}>
            <span className={styles.formEyebrow}>GET STARTED</span>
            <h1 id="form-title">Create your account</h1>
            <p>Choose a username and password to join BitLatch.</p>
          </div>

          <SignUpForm />

          <p className={styles.loginPrompt}>Already have an account? <a href="/login">Log in</a></p>
          <p className={styles.terms}>By continuing, you agree to BitLatch&apos;s <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>.</p>
        </section>
      </aside>
    </main>
  );
}
