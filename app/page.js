import Image from "next/image";
import styles from "./page.module.css";

const activity = [
  { initials: "AM", name: "Alex Morgan", action: "opened a pull request", time: "2m ago", tone: "mint" },
  { initials: "JL", name: "Jamie Lee", action: "completed API design", time: "18m ago", tone: "blue" },
  { initials: "SK", name: "Sam Kim", action: "shared a project update", time: "42m ago", tone: "gold" },
];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className={styles.arrowIcon}>
      <path d="M4 10h11M10 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className={styles.siteShell}>
      <header className={styles.header}>
        <a className={styles.brand} href="#top" aria-label="BitLatch home">
          <Image src="/bitlatch-logo.svg?rev=8" width={38} height={38} alt="" aria-hidden="true" />
          <span className={styles.brandBit}>Bit</span>
          <span className={styles.brandLatch}>Latch</span>
        </a>

        <nav className={styles.navLinks} aria-label="Main navigation">
          <a href="#communities">Communities</a>
          <a href="#projects">Projects</a>
          <a href="#how-it-works">How it works</a>
        </nav>

        <div className={styles.headerActions}>
          <a className={styles.loginLink} href="/login">Log in</a>
          <a className={styles.joinButton} href="/signup">Register</a>
        </div>
      </header>

      <section className={styles.hero} id="top">
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}><span className={styles.eyebrowDot} /> A place for developers who build</div>
          <h1>Find your people.<br />Build what&apos;s next.</h1>
          <p className={styles.heroDescription}>
            Meet your community, share ideas, and turn side projects into real progress. BitLatch brings your people and your work together.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryButton} href="/signup">Start building for free <ArrowIcon /></a>
            <a className={styles.secondaryButton} href="#how-it-works">Explore BitLatch</a>
          </div>
          <div className={styles.heroNote}>
            <div className={styles.avatarStack} aria-hidden="true">
              <span className={styles.avatarOne}>A</span>
              <span className={styles.avatarTwo}>J</span>
              <span className={styles.avatarThree}>S</span>
              <span className={styles.avatarFour}>+</span>
            </div>
            <span>Good work happens together.</span>
          </div>
        </div>

        <div className={styles.heroVisual} id="projects" aria-label="Preview of a BitLatch project workspace">
          <div className={styles.visualGlow} />
          <div className={styles.workspaceCard}>
            <div className={styles.workspaceTopbar}>
              <div className={styles.windowDots}><i /><i /><i /></div>
              <span className={styles.workspaceLabel}>BITLATCH / WORKSPACE</span>
              <span className={styles.liveIndicator}><i /> LIVE</span>
            </div>

            <div className={styles.workspaceBody}>
              <aside className={styles.workspaceRail} aria-hidden="true">
                <span className={styles.railLogo}>B</span>
                <span className={`${styles.railIcon} ${styles.railIconActive}`}><i /></span>
                <span className={styles.railIcon}><i /></span>
                <span className={styles.railIcon}><i /></span>
                <span className={styles.railDivider} />
                <span className={styles.railAdd}>+</span>
              </aside>

              <div className={styles.projectContent}>
                <div className={styles.projectHeading}>
                  <div>
                    <div className={styles.breadcrumb}>PROJECTS <span>/</span> OPEN SOURCE</div>
                    <h2>Atlas Kit</h2>
                    <p>A component library for the web</p>
                  </div>
                  <button className={styles.moreButton} type="button" aria-label="More project options">•••</button>
                </div>

                <div className={styles.projectMeta}>
                  <span className={styles.statusPill}><i /> In progress</span>
                  <span className={styles.metaDivider} />
                  <span className={styles.metaText}>Sprint 04</span>
                  <div className={styles.memberStack} aria-label="3 project collaborators">
                    <span className={styles.memberA}>A</span>
                    <span className={styles.memberB}>J</span>
                    <span className={styles.memberC}>S</span>
                  </div>
                </div>

                <div className={styles.progressCard}>
                  <div className={styles.progressTop}><span>Project progress</span><strong>68%</strong></div>
                  <div className={styles.progressTrack}><span /></div>
                  <div className={styles.progressBottom}><span>17 of 25 tasks complete</span><span>Updated just now</span></div>
                </div>

                <div className={styles.activityHeader}><span>TEAM ACTIVITY</span><a href="#how-it-works">View all <ArrowIcon /></a></div>
                <div className={styles.activityList}>
                  {activity.map((item) => (
                    <div className={styles.activityRow} key={item.initials}>
                      <span className={`${styles.activityAvatar} ${styles[item.tone]}`}>{item.initials}</span>
                      <span className={styles.activityText}><strong>{item.name}</strong> {item.action}</span>
                      <span className={styles.activityTime}>{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.workspaceFooter}><span><i /> All systems moving</span><span>Built in the open <b>↗</b></span></div>
          </div>

          <div className={styles.floatingCard}>
            <span className={styles.floatingCheck}>✓</span>
            <span><strong>Milestone reached</strong><small>Core components merged</small></span>
          </div>
        </div>
      </section>

      <section className={styles.valueStrip} id="how-it-works">
        <div className={styles.valueIntro}>
          <span className={styles.sectionEyebrow}>MORE THAN A CHAT</span>
          <h2>Your whole build,<br />in one place.</h2>
        </div>
        <article className={styles.valueCard} id="communities">
          <span className={styles.valueNumber}>01</span>
          <h3>Find your community</h3>
          <p>Join focused spaces, meet people who care about the same things, and find your next collaborator.</p>
        </article>
        <article className={styles.valueCard}>
          <span className={styles.valueNumber}>02</span>
          <h3>Make ideas real</h3>
          <p>Start a solo project or bring a team together. Keep tasks, updates, and decisions connected to the work.</p>
        </article>
        <article className={styles.valueCard}>
          <span className={styles.valueNumber}>03</span>
          <h3>See your momentum</h3>
          <p>Follow milestones and activity as they happen, so every contributor can see what moved forward.</p>
        </article>
      </section>

      <section className={styles.communitySection}>
        <div className={styles.communityCopy}>
          <span className={styles.sectionEyebrow}>GOOD PEOPLE. GOOD PROJECTS.</span>
          <h2>Find your corner<br />of the dev world.</h2>
          <p>From swapping ideas to finding a teammate, join conversations that help you make your next thing happen.</p>
          <a className={styles.textLink} href="#communities">Explore communities <ArrowIcon /></a>
        </div>
        <div className={styles.communityGrid}>
          <article className={`${styles.communityCard} ${styles.communityCardLarge}`}>
            <div className={styles.communityMark}>&lt;/&gt;</div>
            <span className={styles.communityCategory}>WEB DEVELOPMENT</span>
            <h3>Frontend Collective</h3>
            <p>Patterns, tools, and thoughtful interfaces.</p>
            <div className={styles.communityBottom}><span>Open community</span><span className={styles.communityArrow}>↗</span></div>
          </article>
          <article className={styles.communityCard}>
            <div className={`${styles.communityMark} ${styles.markAlt}`}>⌘</div>
            <span className={styles.communityCategory}>BUILD IN PUBLIC</span>
            <h3>Indie Ship Room</h3>
            <p>Keep your momentum with fellow makers.</p>
            <div className={styles.communityBottom}><span>Open community</span><span className={styles.communityArrow}>↗</span></div>
          </article>
          <article className={styles.communityCard}>
            <div className={`${styles.communityMark} ${styles.markThird}`}>⌁</div>
            <span className={styles.communityCategory}>OPEN SOURCE</span>
            <h3>Maintainer Exchange</h3>
            <p>Share knowledge and make better software.</p>
            <div className={styles.communityBottom}><span>Open community</span><span className={styles.communityArrow}>↗</span></div>
          </article>
        </div>
      </section>

      <section className={styles.workflowSection}>
        <div className={styles.workflowHeading}>
          <span className={styles.sectionEyebrow}>FROM FIRST NOTE TO SHIPPED</span>
          <h2>A simple path from idea to done.</h2>
          <p>Keep the process visible, the team in sync, and the next step easy to find.</p>
        </div>
        <div className={styles.workflowSteps}>
          <article className={styles.workflowStep}>
            <span className={styles.workflowIndex}>01</span>
            <span className={styles.workflowIcon}>↗</span>
            <h3>Bring an idea</h3>
            <p>Start with a goal, a rough plan, or a project you want to grow.</p>
          </article>
          <article className={styles.workflowStep}>
            <span className={styles.workflowIndex}>02</span>
            <span className={styles.workflowIcon}>⌘</span>
            <h3>Build your crew</h3>
            <p>Work solo or invite collaborators who want to help make it real.</p>
          </article>
          <article className={styles.workflowStep}>
            <span className={styles.workflowIndex}>03</span>
            <span className={styles.workflowIcon}>✓</span>
            <h3>Track the progress</h3>
            <p>Share updates, follow milestones, and celebrate what ships.</p>
          </article>
        </div>
      </section>

      <section className={styles.bottomCta}>
        <div>
          <span className={styles.sectionEyebrow}>YOUR NEXT BUILD STARTS HERE</span>
          <h2>Make something<br className={styles.mobileBreak} /> with your people.</h2>
        </div>
        <a className={styles.primaryButton} href="/signup">Join BitLatch <ArrowIcon /></a>
      </section>

      <footer className={styles.footer}>
        <a className={styles.footerBrand} href="#top">BitLatch</a>
        <span>A community for people who build.</span>
        <span>© 2026 BitLatch</span>
      </footer>
    </main>
  );
}
