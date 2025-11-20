import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLicenseBySlug, licenses } from "@/data/licenses";
import styles from "./page.module.css";

type Params = {
  slug: string;
};

const STATUS_VARIANTS: Record<string, string> = {
  Active: styles.statusActive,
  "Under Review": styles.statusReview,
  Suspended: styles.statusSuspended,
  Lapsed: styles.statusLapsed,
};

export function generateStaticParams() {
  return licenses.map((license) => ({ slug: license.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const record = getLicenseBySlug(params.slug);
  if (!record) {
    return {
      title: "License Record Not Found",
      description: "Requested license record could not be located in the registry.",
    };
  }

  return {
    title: `${record.companyName} License Record`,
    description: `Regulatory summary for ${record.companyName}, license ${record.licenseNumber}.`,
  };
}

export default function LicenseDetail({ params }: { params: Params }) {
  const license = getLicenseBySlug(params.slug);

  if (!license) {
    notFound();
  }

  const statusClass = STATUS_VARIANTS[license.status] ?? styles.statusDefault;

  return (
    <article className={styles.detailCard}>
      <header className={styles.header}>
        <div>
          <h1>{license.companyName}</h1>
          <p className={styles.subtitle}>Registry License Reference: {license.licenseNumber}</p>
        </div>
        <div className={`${styles.statusBadge} ${statusClass}`}>{license.status}</div>
      </header>

      <section className={styles.summaryGrid}>
        <div>
          <h2>License Particulars</h2>
          <table>
            <tbody>
              <tr>
                <th scope="row">Issue Date</th>
                <td>{license.issueDate}</td>
              </tr>
              <tr>
                <th scope="row">Expiry / Review Date</th>
                <td>{license.expiryDate}</td>
              </tr>
              <tr>
                <th scope="row">Business Category</th>
                <td>{license.businessCategory}</td>
              </tr>
              <tr>
                <th scope="row">Registered Address</th>
                <td>{license.registeredAddress}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <h2>Contact Registry</h2>
          <table>
            <tbody>
              <tr>
                <th scope="row">Primary Email</th>
                <td>{license.contactEmail}</td>
              </tr>
              <tr>
                <th scope="row">Telephone</th>
                <td>{license.contactPhone}</td>
              </tr>
              <tr>
                <th scope="row">Compliance Notes</th>
                <td>{license.complianceNotes}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.descriptionSection}>
        <h2>Operational Synopsis</h2>
        <p>{license.description}</p>
      </section>

      <section className={styles.personnelSection}>
        <h2>Key Appointed Persons</h2>
        <ul>
          {license.keyPersons.map((person) => (
            <li key={person.name}>
              <span className={styles.personName}>{person.name}</span>
              <span className={styles.personRole}>{person.role}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className={styles.actions}>
        <button type="button" disabled>
          Download Certificate (PDF)
        </button>
        <p className={styles.disclaimer}>
          Certificates are available upon written request to the Licensing Bureau. Digital
          distribution is reserved for notarised parties.
        </p>
      </div>

      <div className={styles.returnLink}>
        <Link href="/">← Return to registry search</Link>
      </div>
    </article>
  );
}
