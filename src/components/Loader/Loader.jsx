import { Ring } from "ldrs/react";
import "ldrs/react/Ring.css";
import styles from "./Loader.module.css";

export default function Loader() {
  return (
    <>
      <div className={styles.loaderContainer}>
        <Ring size="80" stroke="5" bgOpacity="0" speed="1.8" color="#ddd" />
      </div>
    </>
  );
}
