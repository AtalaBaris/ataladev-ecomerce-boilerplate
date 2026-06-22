export default async function EditProductPage({ params }) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-100">Ürün Düzenle</h1>
      <p className="text-sm text-zinc-400">Ürün ID: {id}</p>
    </div>
  );
}
