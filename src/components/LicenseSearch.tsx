"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./LicenseSearch.module.css";
import type { LicenseRecord } from "@/data/licenses";

type Props = {
  licenses: LicenseRecord[];
};

const STATUS_CLASS_MAP: Record<string, string> = {
  Active: styles.statusActive,
  "Under Review": styles.statusReview,
  Suspended: styles.statusSuspended,
  Lapsed: styles.statusLapsed,
};

export function LicenseSearch({ licenses }: Props) {
  const [inputValue, setInputValue] = useState("");
  const [activeQuery, setActiveQuery] = useState("");

  const normalisedQuery = activeQuery.trim().toLowerCase();

  const filteredLicenses = useMemo(() => {
    if (!normalisedQuery) {
      return licenses;
    }

    return licenses.filter((license) => {
      const haystack = [
        license.companyName,
        license.licenseNumber,
        license.status,
        license.businessCategory,
        license.description,
        license.registeredAddress,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalisedQuery);
    });
  }, [licenses, normalisedQuery]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActiveQuery(inputValue);
  };

  const handleReset = () => {
    setInputValue("");
    setActiveQuery("");
  };

  return (
    <div className={styles.searchCard}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label} htmlFor="license-query">
          Search by company name, license number or keyword
        </label>
        <div className={styles.controls}>
          <input
            id="license-query"
            name="license-query"
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="Enter search phrase"
            className={styles.input}
          />
          <button type="submit" className={styles.submitButton}>
            Search Registry
          </button>
          <button
            type="button"
            onClick={handleReset}
            className={styles.resetButton}
            disabled={!inputValue && !activeQuery}
          >
            Clear
          </button>
        </div>
      </form>

      <div className={styles.summary}>
        <p>
          Showing <strong>{filteredLicenses.length}</strong> of <strong>{licenses.length}</strong>{" "}
          licensed entities{normalisedQuery ? ` for “${activeQuery}”.` : "."}
        </p>
        <p className={styles.advisory}>
          Note: Results are provided for seminar demonstrations only. Verification with the issuing
          bureau is required before any commercial reliance.
        </p>
      </div>

      <div className={styles.tableWrapper}>
        {filteredLicenses.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No licensed entities matched the supplied terms.</p>
            <p>Try broadening the keywords or resetting the search.</p>
          </div>
        ) : (
          <table>
            <caption>Licensed Financial Operators Index</caption>
            <thead>
              <tr>
                <th scope="col">Company</th>
                <th scope="col">License #</th>
                <th scope="col">Status</th>
                <th scope="col">Issue Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredLicenses.map((license) => {
                const statusVariant = STATUS_CLASS_MAP[license.status] ?? styles.statusDefault;
                return (
                  <tr key={license.licenseNumber}>
                    <td>
                      <Link href={`/licenses/${license.slug}`} className={styles.companyLink}>
                        {license.companyName}
                      </Link>
                      <div className={styles.category}>{license.businessCategory}</div>
                    </td>
                    <td className={styles.licenseCell}>{license.licenseNumber}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${statusVariant}`}>
                        {license.status}
                      </span>
                    </td>
                    <td>{license.issueDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
