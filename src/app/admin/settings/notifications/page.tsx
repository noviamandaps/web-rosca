'use client';

import { useState } from 'react';
import { Button, Input } from '@/components/ui';
import { useNotificationHistory, useSendNotification } from '@/services/admin/admin-cms';
import type { NotificationItem } from '@/lib/api-types';

export default function AdminNotificationsPage() {
  const { data: history, isLoading } = useNotificationHistory();
  const send = useSendNotification();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  return (
    <div>
      <h1 className="text-xl font-bold uppercase tracking-widest mb-6">Notifications</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send.mutate(
            { title, message },
            { onSuccess: () => { setTitle(''); setMessage(''); }, onError: (err) => alert(err.message) }
          );
        }}
        className="max-w-lg flex flex-col gap-4 mb-10"
      >
        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Input label="Message" value={message} onChange={(e) => setMessage(e.target.value)} required />
        <Button type="submit">{send.isPending ? 'Sending…' : 'Send'}</Button>
      </form>

      <h2 className="text-xs font-semibold uppercase tracking-wider mb-4">History</h2>
      <div className="flex flex-col gap-3">
        {(history ?? []).map((n: NotificationItem) => (
          <div key={n.id} className="border border-brand-border p-4">
            <p className="text-sm font-medium">{n.title}</p>
            <p className="text-2xs text-brand-gray">{n.message}</p>
            <p className="text-2xs text-brand-gray">{n.sentAt ?? ''}</p>
          </div>
        ))}
        {!history?.length && <p className="text-xs text-brand-gray">No notifications sent</p>}
      </div>
    </div>
  );
}
