import styles from '../../Styles/Trackers.module.css'

export default function FAQs() {
  return (
    <main className={styles.wrapper}>
      <section className={styles.faq}>
        <h1 className={styles.faqTitle}>Frequently Asked Questions</h1>
        <details className={styles.faqItem}>
          <summary>How do I set up my tracker?</summary>
          <p>
            Download the PetPulse app, pair your tracker via Bluetooth, and
            follow the setup guide.
          </p>
        </details>
        <details className={styles.faqItem}>
          <summary>Can I use PetPulse without a subscription?</summary>
          <p>
            Yes. Core tracking works without a subscription. Enhanced analytics
            are optional.
          </p>
        </details>
        <details className={styles.faqItem}>
          <summary>What devices are supported?</summary>
          <p>iOS 13+ and Android 9+ are supported for the PetPulse app.</p>
        </details>
      </section>
    </main>
  )
}
