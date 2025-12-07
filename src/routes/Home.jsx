import styles from "./Home.module.css";
import CategoryCard from "../components/CategoryCard/CategoryCard";
import Hero from "../components/Hero/Hero";
import Loader from "../components/Loader/Loader";
import Error from "../components/Error/Error";

export default function Home({ data, loading, error }) {
  if (loading) return <Loader />;
  if (error) return <Error error={error} />;
  if (!data) return null;

  const categories = data.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <>
      <Hero />
      <div className={styles.sectionWrapper}>
        <div className={styles.categorySection}>
          <div className={styles.categoryGrid}>
            <CategoryCard data={categories["men's clothing"]} />
            <CategoryCard data={categories["women's clothing"]} />
            <CategoryCard data={categories["jewelery"]} />
            <CategoryCard data={categories["electronics"]} />
          </div>
        </div>
      </div>
    </>
  );
}
