import Link from 'next/link'
import styles from '../../Styles/Trackers.module.css'

export default function TrackersPage() {
  return (
    <main className={styles.wrapper}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Choose your PetPulse tracker</h1>
        <p className={styles.subtitle}>
          Monitor activity, rest and more with our trackers
        </p>
      </section>

      <section className={styles.grid}>
        <article className={styles.card}>
          <img
            src="/image/monitor.png"
            alt="Tracker"
            className={styles.cardImage}
          />
          <h2 className={styles.cardTitle}>Tracker</h2>
          <p className={styles.cardText}>
            Essential tracking, great battery life.
          </p>
          <Link className={styles.cardButton} href="/tracker">
            View details
          </Link>
        </article>
        <article className={styles.card}>
          <img
            src="/image/monitorplus.png"
            alt="Tracker Plus"
            className={styles.cardImage}
          />
          <h2 className={styles.cardTitle}>Tracker Plus</h2>
          <p className={styles.cardText}>
            Advanced insights and premium build.
          </p>
          <Link className={styles.cardButton} href="/tracker_plus">
            View details
          </Link>
        </article>
      </section>

      <section className={styles.faq}>
        <h2 className={styles.faqTitle}>FAQs</h2>
        <details className={styles.faqItem}>
          <summary>Is the tracker waterproof?</summary>
          <p>
            Yes, both Tracker and Tracker Plus are rated IP67 for daily water
            exposure.
          </p>
        </details>
        <details className={styles.faqItem}>
          <summary>How long does the battery last?</summary>
          <p>
            Typical use gives up to 7 days for Tracker and up to 10 days for
            Tracker Plus.
          </p>
        </details>
        <details className={styles.faqItem}>
          <summary>Do I need a subscription?</summary>
          <p>
            No subscription is required for basic features. Advanced analytics
            are optional.
          </p>
        </details>
      </section>
    </main>
  )
}
