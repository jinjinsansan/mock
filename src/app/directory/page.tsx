import Link from "next/link";
import type { Metadata } from "next";
import { licenses } from "@/data/licenses";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Alphabetical License Directory",
  description:
    "Complete alphabetical roster of all financial operators registered with the Boa Vista Private Licensing Bureau.",
};

const NUMBERS = "0123456789".split("");
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function groupLicenses() {
  const sorted = [...licenses].sort((a, b) =>
    a.companyName.localeCompare(b.companyName, "en", { sensitivity: "base" }),
  );

  const groups = new Map<string, typeof sorted>();

  for (const entry of sorted) {
    const firstChar = entry.companyName.charAt(0);
    let key: string;
    
    if (/[0-9]/.test(firstChar)) {
      key = firstChar;
    } else if (LETTERS.includes(firstChar.toUpperCase())) {
      key = firstChar.toUpperCase();
    } else {
      key = "#";
    }
    
    const bucket = groups.get(key);
    if (bucket) {
      bucket.push(entry);
    } else {
      groups.set(key, [entry]);
    }
  }

  return { groups, total: licenses.length };
}

export default function DirectoryPage() {
  const { groups, total } = groupLicenses();
  
  // 0-9, A-Z, # の順に並べる
  const sortedKeys = [...groups.keys()].sort((a, b) => {
    if (a === "#") return 1;
    if (b === "#") return -1;
    if (/[0-9]/.test(a) && /[0-9]/.test(b)) return a.localeCompare(b);
    if (/[0-9]/.test(a)) return -1;
    if (/[0-9]/.test(b)) return 1;
    return a.localeCompare(b);
  });
  
  const availableGroups = sortedKeys.map(key => [key, groups.get(key)!] as const);
  const hasMisc = groups.has("#");

  return (
    <div className={styles.container}>
      <section className={styles.intro}>
        <h1>Alphabetical License Directory</h1>
        <p>
          This register lists every authorised financial operator maintained by the Boa Vista
          Private Licensing Bureau. A total of <strong>{total.toLocaleString("en-US")}</strong> active
          and historical entries are provided below, organised by the leading character of the
          entity name.
        </p>
        <p className={styles.notice}>
          Use the index to jump to a number or letter grouping, then select any operator to open its full
          license record.
        </p>
      </section>

      <nav className={styles.alphaNav} aria-label="Index navigation">
        <ul>
          {NUMBERS.map((num) => {
            const target = `section-${num}`;
            const enabled = groups.has(num);
            return (
              <li key={num}>
                {enabled ? (
                  <Link href={`#${target}`}>{num}</Link>
                ) : (
                  <span aria-disabled="true">{num}</span>
                )}
              </li>
            );
          })}
          <li className={styles.separator}>|</li>
          {LETTERS.map((letter) => {
            const target = `section-${letter}`;
            const enabled = groups.has(letter);
            return (
              <li key={letter}>
                {enabled ? (
                  <Link href={`#${target}`}>{letter}</Link>
                ) : (
                  <span aria-disabled="true">{letter}</span>
                )}
              </li>
            );
          })}
          {hasMisc && (
            <>
              <li className={styles.separator}>|</li>
              <li>
                <Link href="#section-misc">#</Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      <div className={styles.directoryWrapper}>
        {availableGroups.map(([key, entries]) => {
          const sectionId = key === "#" ? "section-misc" : `section-${key}`;
          let headingLabel: string;
          if (key === "#") {
            headingLabel = "Other Characters";
          } else if (/[0-9]/.test(key)) {
            headingLabel = `Number ${key}`;
          } else {
            headingLabel = `Letter ${key}`;
          }

          return (
            <section key={sectionId} id={sectionId} className={styles.letterSection}>
              <header className={styles.sectionHeader}>
                <h2>{headingLabel}</h2>
                <span>{entries.length.toLocaleString("en-US")} entries</span>
              </header>
              <ul className={styles.entryList}>
                {entries.map((entry) => (
                  <li key={entry.slug} className={styles.entryItem}>
                    <div className={styles.entryHeading}>
                      <Link href={`/licenses/${entry.slug}`} className={styles.entryLink}>
                        {entry.companyName}
                      </Link>
                      <span className={styles.entryStatus}>{entry.status}</span>
                    </div>
                    <dl className={styles.entryMeta}>
                      <div>
                        <dt>License Reference</dt>
                        <dd>{entry.licenseNumber}</dd>
                      </div>
                      <div>
                        <dt>Business Class</dt>
                        <dd>{entry.businessCategory}</dd>
                      </div>
                      <div>
                        <dt>Issue Date</dt>
                        <dd>{entry.issueDate}</dd>
                      </div>
                    </dl>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
