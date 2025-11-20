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

const STATUS_SUMMARY: Record<string, string> = {
  Active: "License remains in force with no outstanding supervisory actions recorded this cycle.",
  "Under Review": "License is subject to an enhanced review. Additional disclosures have been requested by the bureau.",
  Suspended: "License privileges are temporarily suspended pending remediation steps filed with the bureau.",
  Lapsed: "License has lapsed. Reinstatement requires full reapplication and settlement of statutory fees.",
};

export const dynamic = "force-static";
export const dynamicParams = false;
export const revalidate = false;

export function generateStaticParams() {
  return licenses.map((license) => ({ slug: license.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const record = getLicenseBySlug(slug);
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

export default async function LicenseDetail({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const license = getLicenseBySlug(slug);

  if (!license) {
    notFound();
  }

  const statusClass = STATUS_VARIANTS[license.status] ?? styles.statusDefault;
  const statusSummary = STATUS_SUMMARY[license.status] ?? "License status is maintained as filed with the Boa Vista bureau.";

  const issueDateObj = new Date(license.issueDate);
  const formatter = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
  const formattedIssueDate = formatter.format(issueDateObj);
  const formattedExpiryDate = license.expiryDate === "N/A" ? "Not time-bound" : formatter.format(new Date(license.expiryDate));
  const filingQuarter = `Q${Math.floor(issueDateObj.getUTCMonth() / 3) + 1} ${issueDateObj.getUTCFullYear()}`;

  const documentReferences = [
    {
      label: "Supervisory Clearance Memo",
      value: `${license.licenseNumber}-SCM`,
    },
    {
      label: "Client Asset Safeguard Schedule",
      value: `${license.licenseNumber}-CAS`,
    },
    {
      label: "Annual Prudential Statement",
      value: `${license.licenseNumber}-APS`,
    },
  ];

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
        <div className={styles.panel}>
          <h2>License Particulars</h2>
          <dl>
            <div>
              <dt>Issue Date</dt>
              <dd>{formattedIssueDate}</dd>
            </div>
            <div>
              <dt>Next Review Window</dt>
              <dd>{formattedExpiryDate}</dd>
            </div>
            <div>
              <dt>Filing Cycle</dt>
              <dd>{filingQuarter}</dd>
            </div>
            <div>
              <dt>Business Class</dt>
              <dd>{license.businessCategory}</dd>
            </div>
            <div>
              <dt>Registered Address</dt>
              <dd>{license.registeredAddress}</dd>
            </div>
          </dl>
        </div>

        <div className={styles.panel}>
          <h2>Compliance & Registry Notes</h2>
          <p>{statusSummary}</p>
          <p>{license.complianceNotes}</p>
          <div className={styles.documentList}>
            <span className={styles.documentHeading}>Document References</span>
            <ul>
              {documentReferences.map((doc) => (
                <li key={doc.value}>
                  <span>{doc.label}</span>
                  <code>{doc.value}</code>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.descriptionSection}>
        <h2>Operational Synopsis</h2>
        <p>{license.description}</p>
        <p>
          The bureau has verified client asset segregation controls and ongoing treasury safeguards as
          part of the Boa Vista Private Licensing Bureau supervision framework. Applicants seeking
          counterparty confirmation may cite the references above when liaising with provincial audit
          teams.
        </p>
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

      <section className={styles.contactSection}>
        <h2>Contact Directory</h2>
        <div className={styles.contactGrid}>
          <div>
            <h3>Primary Registry Contact</h3>
            <p>
              <strong>Email:</strong> {license.contactEmail}
            </p>
          </div>
          <div>
            <h3>Submission Instructions</h3>
            <p>
              All dossiers must quote the registry reference {license.licenseNumber}. Supporting
              evidence should be delivered via secured courier or authenticated fax to the bureau’s
              filing office.
            </p>
          </div>
        </div>
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
