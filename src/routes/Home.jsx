import CategoryCard from "../components/CategoryCard/CategoryCard";
import Hero from "../components/Hero/Hero";

export default function Home({ data, loading, error }) {
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  return (
    <>
      <Hero />
      <CategoryCard data={data} loading={loading} error={error} />
    </>
  );
}
