import styles from "./Hero.module.css";
import { Link } from "react-router";

export default function Hero() {
  return (
    <section className={styles.sectionWrapper}>
      <div className={styles.heroSection}>
        <div className={styles.heroText}>
          <span className={styles.eyebrow}>New Arrivals</span>
          <h2 className={styles.headline}>
            Elevated Essentials for Every Occasion
          </h2>
          <p className={styles.bodyCopy}>
            Curated pieces that blend timeless style with modern living. Build
            your collection with confidence.
          </p>
          <Link to="/products" className={styles.cta}>
            Shop the Collection
          </Link>
        </div>
      </div>
    </section>
  );
}
