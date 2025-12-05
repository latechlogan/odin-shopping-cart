import styles from "./CategoryCard.module.css";

export default function CategoryCard({ data, loading, error }) {
  if (!data) return <div>Loading...</div>;

  const products = Object.values(data);

  return (
    <>
      <h1 className={styles.red}>Category Card</h1>
    </>
  );
}
