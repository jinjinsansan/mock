import Link from "next/link";
import type { Metadata } from "next";
import "./globals.css";
import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: {
    default: "Boa Vista Financial Licensing Registry",
    template: "%s | Boa Vista Financial Licensing Registry",
  },
  description:
    "Mock registry for Boa Vista Island licensing searches operated by a private issuing firm.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
      noimageindex: true,
      nocache: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={styles.body}>
        <div className={styles.frame}>
          <header className={styles.header}>
            <div className={styles.masthead}>
              <span className={styles.title}>Boa Vista Financial Licensing Registry</span>
              <span className={styles.subtitle}>
                Operated by Boa Vista Private Licensing Bureau · Republic of Cabo Verde
              </span>
            </div>
            <nav className={styles.nav} aria-label="Primary navigation">
              <ul>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/#directory">License Directory</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
              </ul>
            </nav>
          </header>
          <main className={styles.main}>{children}</main>
          <footer className={styles.footer}>
            <p>
              This registry is a mock environment prepared for seminar demonstrations. Records are
              illustrative and hold no regulatory force.
            </p>
            <p>© 2025 Boa Vista Private Licensing Bureau. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
