import CategoryCard from "../components/CategoryCard/CategoryCard";
import Hero from "../components/Hero/Hero";

export default function Home({ data, loading, error }) {
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  const categories = data.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <>
      <Hero />
      <CategoryCard data={categories["men's clothing"]} />
      <CategoryCard data={categories["women's clothing"]} />
      <CategoryCard data={categories["jewelery"]} />
      <CategoryCard data={categories["electronics"]} />
    </>
  );
}
