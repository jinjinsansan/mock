import styles from "./page.module.css";

export default function ContactPage() {
  return (
    <div className={styles.card}>
      <h1>Contact the Licensing Bureau</h1>
      <p>
        Correspondence relating to licensing dossiers should be directed through the official
        registry channels listed below. Please reference the relevant license number on all
        submissions to ensure timely indexing by clerical staff.
      </p>
      <table>
        <tbody>
          <tr>
            <th scope="row">Mail Room</th>
            <td>Boa Vista Private Licensing Bureau, Caixa Postal 88, Sal Rei, Boa Vista</td>
          </tr>
          <tr>
            <th scope="row">Clerical Email</th>
            <td>records@bvp-licensing.cv</td>
          </tr>
          <tr>
            <th scope="row">Document Intake</th>
            <td>Counter Service, Monday to Friday · 09:30 – 16:00 (Closed on Provincial Holidays)</td>
          </tr>
        </tbody>
      </table>
      <p className={styles.notice}>
        Kindly note this registry operates within a controlled demonstration environment and will not
        process public licensing applications. This contact desk is maintained solely for seminar
        exercises.
      </p>
    </div>
  );
}
