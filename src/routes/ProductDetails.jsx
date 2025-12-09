import styles from "./ProductDetails.module.css";
import { useParams } from "react-router";
import { Reviews } from "./Products";
import AddToCart from "../components/AddToCart/AddToCart";

export default function ProductDetails({ data }) {
  const params = useParams();
  const id = params.productId;
  const item = data[id - 1]; //accounts for the differenece between data id and key

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
