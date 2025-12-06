import styles from "./CategoryCard.module.css";
import { Link } from "react-router";

export default function CategoryCard({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className={styles.categoryCard}>
      <h3 className={styles.categoryTitle}>{data[1].category}</h3>
      <div className={styles.categoryItemGrid}>
        {data.slice(0, 4).map((item) => {
          return (
            <Link
              to="/product-details/item.id"
              className={styles.categoryItem}
              key={item.id}
            >
              <div className={styles.itemImgContainer}>
                <img src={item.image} className={styles.itemImg} />
              </div>
              <p className={styles.itemTitle}>{item.title}</p>
            </Link>
          );
        })}
      </div>
      <Link to="/products" className={styles.categoryCTA}>
        Shop All {data[1].category}
      </Link>
    </div>
  );
}
