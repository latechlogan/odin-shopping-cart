import styles from "./CategoryCard.module.css";

export default function CategoryCard({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div>
      <h3>{data[1].category}</h3>
      <div>
        {data.slice(0, 4).map((item) => {
          return <li key={item.id}>{item.title}</li>;
        })}
      </div>
    </div>
  );
}
