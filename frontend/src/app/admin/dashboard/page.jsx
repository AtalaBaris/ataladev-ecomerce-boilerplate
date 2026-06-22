export const metadata = {
  title: 'Dashboard | Atala Admin',
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Mağaza performansına genel bakış
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Toplam Satış', value: '₺0' },
          { label: 'Siparişler', value: '0' },
          { label: 'Ürünler', value: '0' },
          { label: 'Müşteriler', value: '0' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5"
          >
            <p className="text-sm text-zinc-400">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold text-zinc-100">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
