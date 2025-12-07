import { useSearchParams } from "react-router";
import Loader from "../components/Loader/Loader";

export default function Products({ data, loading, error }) {
  if (loading) return <Loader />;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  const [searchParams] = useSearchParams();
  const targetCategory = searchParams.get("category");

  const productsToDisplay = targetCategory
    ? data.filter((item) => item.category === targetCategory)
    : data;

  return (
    <ul>
      {productsToDisplay.map((item) => {
        return <li>{item.title}</li>;
      })}
    </ul>
  );
}
