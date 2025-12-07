import styles from "./Products.module.css";
import { useSearchParams } from "react-router";
import Loader from "../components/Loader/Loader";
import Error from "../components/Error/Error";
import { Link } from "react-router";
import { StarRating } from "react-flexible-star-rating";

export default function Products({ data, loading, error }) {
  if (loading) return <Loader />;
  if (error) return <Error error={error} />;
  if (!data) return null;

  const [searchParams] = useSearchParams();
  const targetCategory = searchParams.get("category");

  const productsToDisplay = targetCategory
    ? data.filter((item) => item.category === targetCategory)
    : data;

  return (
    <div className={styles.sectionWrapper}>
      <div className={styles.productsGrid}>
        {productsToDisplay.map((item) => {
          return (
            <Link
              to={`/product-details/${item.id}`}
              className={styles.productCard}
            >
              <div className={styles.imgContainer}>
                <img
                  src={item.image}
                  alt={item.description}
                  className={styles.img}
                ></img>
              </div>
              <span className={styles.title}>{item.title}</span>
              <span className={styles.reviews}>
                {item.rating.rate}
                <StarRating
                  starsLength="5"
                  initialRating={Math.round(item.rating.rate * 2) / 2}
                  isHalfRatingEnabled="true"
                  isReadOnly="true"
                  dimension="3.5"
                />
                ({item.rating.count})
              </span>
              <span className={styles.price}>${item.price}</span>
              <button className={styles.cta}>Add to Cart</button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
