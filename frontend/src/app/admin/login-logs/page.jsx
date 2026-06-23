'use client';

import { useCallback, useEffect, useState } from 'react';
import { authService } from '@/services/auth.service';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { LoginLogsTable } from './components/LoginLogsTable';

const LOG_LIMIT = 50;

export default function AdminLoginLogsPage() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await authService.getLoginLogs(LOG_LIMIT);

      if (!response.success) {
        throw new Error(response.error?.message || 'Loglar alınamadı.');
      }

      setLogs(response.data?.logs || []);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.message ||
          'Loglar yüklenirken bir hata oluştu.',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleClearLogs = async () => {
    setIsClearing(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await authService.clearLoginLogs();

      if (!response.success) {
        throw new Error(response.error?.message || 'Loglar silinemedi.');
      }

      setLogs([]);
      setSuccessMessage(
        response.message ||
          `${response.data?.deletedCount ?? 0} giriş kaydı silindi.`,
      );
      setIsModalOpen(false);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.message ||
          'Loglar silinirken bir hata oluştu.',
      );
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Giriş Logları</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Son {LOG_LIMIT} admin giriş denemesi (30 gün saklanır)
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" size="sm" onClick={fetchLogs} isLoading={isLoading}>
            Yenile
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            disabled={isLoading || logs.length === 0}
          >
            Tümünü Temizle
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {successMessage}
        </div>
      )}

      {isLoading && logs.length === 0 ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : (
        <LoginLogsTable logs={logs} />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => !isClearing && setIsModalOpen(false)}
        title="Giriş loglarını temizle"
      >
        <p className="text-sm text-zinc-400">
          Tüm giriş kayıtları kalıcı olarak silinecek. Bu işlem geri alınamaz.
          Devam etmek istiyor musunuz?
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsModalOpen(false)}
            disabled={isClearing}
          >
            İptal
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleClearLogs}
            isLoading={isClearing}
          >
            Evet, temizle
          </Button>
        </div>
      </Modal>
    </div>
  );
}
