export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-bold capitalize">{slug.replace(/-/g, ' ')}</h1>
      <p className="mt-4 text-zinc-400">Ürün detay sayfası yakında.</p>
    </div>
  );
}
