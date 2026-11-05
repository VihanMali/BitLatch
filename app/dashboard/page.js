import { Suspense } from "react";
import Link from "next/link";
import { createProjectAction, logOutAction } from "@/app/actions/auth";
import { requireUser } from "@/lib/auth";
import { listProjectsForUserId } from "@/lib/projects";
import styles from "./page.module.css";

export default function DashboardPage() {
  return (
    <main className={styles.page}>
      <Suspense fallback={<p className={styles.loading}>Loading your workspace…</p>}>
        <DashboardContent />
      </Suspense>
    </main>
  );
}

async function DashboardContent() {
  const user = await requireUser();
  const projects = await listProjectsForUserId(user.id);

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}><span className={styles.brandMark}>B</span> BitLatch</Link>
        <div className={styles.account}>
          <span className={styles.username}>@{user.username}</span>
          <form action={logOutAction}>
            <button className={styles.logout} type="submit">Log out</button>
          </form>
        </div>
      </header>

      <section className={styles.welcome}>
        <span className={styles.eyebrow}>YOUR WORKSPACE</span>
        <h1>Welcome, {user.username}.</h1>
        <p>Your account is ready. Create a project to start organizing your work.</p>
      </section>

      <section className={styles.projects} aria-labelledby="projects-title">
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.eyebrow}>PERSONAL PROJECTS</span>
            <h2 id="projects-title">Your projects</h2>
          </div>
          <span className={styles.projectCount}>{projects.length} / 50</span>
        </div>

        <form className={styles.projectForm} action={createProjectAction}>
          <label className={styles.srOnly} htmlFor="project-name">Project name</label>
          <input
            id="project-name"
            name="name"
            type="text"
            minLength={2}
            maxLength={100}
            placeholder="Name your next project"
            required
          />
          <button type="submit">Create project <span aria-hidden="true">+</span></button>
        </form>

        {projects.length > 0 ? (
          <ul className={styles.projectList}>
            {projects.map((project) => (
              <li className={styles.projectCard} key={project.id}>
                <span className={styles.projectIcon} aria-hidden="true">↗</span>
                <span className={styles.projectName}>{project.name}</span>
                <span className={styles.projectDate}>
                  {new Date(project.created_at).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon} aria-hidden="true">＋</span>
            <h3>Your first project starts here</h3>
            <p>Projects you create are saved to your account and only shown in your workspace.</p>
          </div>
        )}
      </section>
    </div>
  );
}
