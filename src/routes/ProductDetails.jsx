import styles from "./ProductDetails.module.css";
import { useParams } from "react-router";
import { Reviews } from "./Products";
import AddToCart from "../components/AddToCart/AddToCart";
import Loader from "../components/Loader/Loader";
import Error from "../components/Error/Error";

export default function ProductDetails({ data, loading, error }) {
  if (loading) return <Loader />;
  if (error) return <Error error={error} />;
  if (!data) return null;

  const params = useParams();
  const productId = parseInt(params.productId);
  const item = data.find((item) => item.id === productId);

  if (!item)
    return (
      <div className={styles.itemError}>
        <h2>Something went wrong.</h2>
        <p>We can't find the product you're looking for.</p>
      </div>
    );

  return (
    <div className={styles.sectionWrapper}>
      <div className={styles.productContainer}>
        <div className={styles.imgContainer}>
          <img src={item.image} alt={item.description} className={styles.img} />
        </div>
        <div className={styles.details}>
          <span className={styles.eyebrow}>{item.category}</span>
          <h2 className={styles.title}>{item.title}</h2>
          <Reviews item={item} dimension={5} className={styles.reviews} />
          <span className={styles.price}>${item.price.toFixed(2)}</span>
          <AddToCart showOptions={true} item={item} />
          <span className={styles.description}>{item.description}</span>
        </div>
      </div>
    </div>
  );
}
