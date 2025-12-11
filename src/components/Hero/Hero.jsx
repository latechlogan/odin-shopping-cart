import styles from "./Hero.module.css";
import { Link } from "react-router";

export default function Hero() {
  return (
    <section className={styles.sectionWrapper}>
      <div className={styles.heroSection}>
        <span className={styles.photoCred}>
          Photo by{" "}
          <a href="https://unsplash.com/@marjantaghipour?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
            Marjan Taghipour
          </a>{" "}
          on{" "}
          <a href="https://unsplash.com/photos/a-woman-in-a-red-dress-is-holding-a-green-umbrella-W_iBXR2m6cw?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
            Unsplash
          </a>
        </span>
        <div className={styles.heroText}>
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
