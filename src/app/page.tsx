import { LicenseSearch } from "@/components/LicenseSearch";
import { licenses } from "@/data/licenses";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.layout}>
      <div className={styles.primaryColumn}>
        <section className={styles.noticeBoard}>
          <h1>Financial Operator Licensing Registry</h1>
          <p>
            Welcome to the central index for financial market authorisations issued on Boa Vista
            Island, Republic of Cabo Verde. This archive is maintained by the Boa Vista Private
            Licensing Bureau to facilitate quick verification of retail and institutional FX service
            providers.
          </p>
          <ul>
            <li>Search by company name, license reference or descriptive keywords.</li>
            <li>Review status indicators reflecting the most recent supervisory assessment.</li>
            <li>Access individual operator records with compliance notes and key personnel.</li>
          </ul>
          <div className={styles.lastUpdated}>
            <span className={styles.label}>Registry Extract Date:</span>
            <span className={styles.value}>15 November 2025 (Revision Cycle Q4)</span>
          </div>
        </section>

        <section id="directory" className={styles.directorySection}>
          <LicenseSearch licenses={licenses} />
        </section>
      </div>

      <aside className={styles.sidebar}>
        <div className={styles.sidebarCard}>
          <h2>Operating Statement</h2>
          <p>
            The Boa Vista Private Licensing Bureau acts under provincial mandate to monitor issuance
            of foreign exchange and derivatives permissions. All files listed herein are subject to
            annual prudential review.
          </p>
        </div>

        <div className={styles.sidebarCard}>
          <h2>Submission Desk</h2>
          <p>
            For amendments or inquiries, lodge documentation via the postal counter or faxed copies
            to +238 595 221. Digital submissions are catalogued within two working days.
          </p>
          <div className={styles.sidebarList}>
            <span>Office Hours: Monday to Friday · 09:30 – 16:00</span>
            <span>Physical Registry: Avenida Principal 44, Sal Rei</span>
            <span>Official Fax: +238 595 221</span>
            <span>Clerical Email: records@bvp-licensing.cv</span>
          </div>
        </div>

        <div className={styles.sidebarCard}>
          <h2>Advisory Notices</h2>
          <p className={styles.noticeItem}>
            • Provisional statuses remain in effect until supplemental capital attestations are
            received.
          </p>
          <p className={styles.noticeItem}>
            • Suspended entities retain appeal rights for 30 days from notification of action.
          </p>
          <p className={styles.noticeItem}>
            • Operators flagged as lapsed may not solicit clients within Boa Vista jurisdiction.
          </p>
        </div>
      </aside>
    </div>
  );
}
