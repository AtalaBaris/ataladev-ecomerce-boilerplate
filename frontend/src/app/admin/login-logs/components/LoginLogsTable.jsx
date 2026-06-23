import { Badge } from '@/components/ui/Badge';
import { formatDateTime } from '@/utils/formatDateTime';

function truncateUserAgent(userAgent) {
  if (!userAgent) return '—';
  if (userAgent.length <= 48) return userAgent;
  return `${userAgent.slice(0, 48)}…`;
}

export function LoginLogsTable({ logs }) {
  if (logs.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-6 py-12 text-center text-sm text-zinc-400">
        Henüz giriş kaydı yok.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400">
              <th className="px-4 py-3 font-medium">Tarih</th>
              <th className="px-4 py-3 font-medium">E-posta</th>
              <th className="px-4 py-3 font-medium">Durum</th>
              <th className="px-4 py-3 font-medium">IP</th>
              <th className="px-4 py-3 font-medium">Tarayıcı</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                className="border-b border-zinc-800/80 last:border-0 hover:bg-zinc-900/80"
              >
                <td className="whitespace-nowrap px-4 py-3 text-zinc-300">
                  {formatDateTime(log.createdAt)}
                </td>
                <td className="px-4 py-3 text-zinc-100">{log.email}</td>
                <td className="px-4 py-3">
                  <Badge variant={log.success ? 'success' : 'danger'}>
                    {log.success ? 'Başarılı' : 'Başarısız'}
                  </Badge>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-zinc-400">
                  {log.ip || '—'}
                </td>
                <td
                  className="max-w-xs truncate px-4 py-3 text-zinc-500"
                  title={log.userAgent || undefined}
                >
                  {truncateUserAgent(log.userAgent)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
