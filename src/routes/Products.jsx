import styles from "./Products.module.css";
import { useSearchParams } from "react-router";
import Loader from "../components/Loader/Loader";
import Error from "../components/Error/Error";
import { Link } from "react-router";
import { StarRating } from "react-flexible-star-rating";
import { useCart } from "../contexts/CartContext";
import AddToCart from "../components/AddToCart/AddToCart";

export default function Products({ data, loading, error }) {
  if (loading) return <Loader />;
  if (error) return <Error error={error} />;
  if (!data) return null;

  const [searchParams] = useSearchParams();
  const targetCategory = searchParams.get("category");

  const productsToDisplay = targetCategory
    ? data.filter((item) => item.category === targetCategory)
    : data;

  const { addToCart } = useCart();

  return (
    <div className={styles.sectionWrapper}>
      <div className={styles.productsGrid}>
        {productsToDisplay.map((item) => {
          return (
            <div className={styles.productCard} key={item.id}>
              <Link
                to={`/product-details/${item.id}`}
                className={styles.detailsLink}
              >
                <div className={styles.imgContainer}>
                  <img
                    src={item.image}
                    alt={item.description}
                    className={styles.img}
                  ></img>
                </div>
                <span className={styles.title}>{item.title}</span>
                <Reviews item={item} dimension={4} />
                <span className={styles.price}>${item.price.toFixed(2)}</span>
              </Link>
              <AddToCart options={false} item={item} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Reviews({ item, dimension, className }) {
  return (
    <span className={className || styles.reviews}>
      {item.rating.rate}
      <StarRating
        starsLength="5"
        initialRating={Math.round(item.rating.rate * 2) / 2}
        isHalfRatingEnabled="true"
        isReadOnly="true"
        dimension={dimension}
      />
      ({item.rating.count})
    </span>
  );
}
