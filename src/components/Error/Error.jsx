import styles from "./Error.module.css";

export default function Error({ error }) {
  return (
    <div className={styles.errorContainer}>
      <h1 className={styles.errorHeading}>Oops! Something went wrong.</h1>
      <p className={styles.errorMessage}>{error.message}</p>
    </div>
  );
}
