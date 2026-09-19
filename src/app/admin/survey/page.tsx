'use client';

import { useState } from 'react';
import { Button, Input, Modal } from '@/components/ui';
import { useCreateSurvey, useSurveys } from '@/services/admin/admin-cms';
import type { SurveyEntry } from '@/lib/api-types';

export default function AdminSurveyPage() {
  const { data: surveys, isLoading } = useSurveys();
  const create = useCreateSurvey();
  const [title, setTitle] = useState('');
  const [question, setQuestion] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const list: SurveyEntry[] = surveys ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold uppercase tracking-widest">Survey</h1>
        <Button size="sm" type="button" onClick={() => { setTitle(''); setQuestion(''); setOpen(true); }}>
          + Add
        </Button>
      </div>
      {isLoading && <p className="text-xs text-brand-gray">Loading…</p>}
      <div className="flex flex-col gap-3 mb-8">
        {list.map((s) => (
          <div key={String(s.id)} className="border border-brand-border p-4">
            <p className="text-sm font-medium">{String(s.title ?? s.question ?? s.id)}</p>
            <pre className="text-2xs text-brand-gray mt-2 whitespace-pre-wrap">{JSON.stringify(s, null, 2).slice(0, 300)}</pre>
          </div>
        ))}
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="New Survey">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setError('');
            create.mutate(
              { title, question },
              {
                onSuccess: () => { setTitle(''); setQuestion(''); setOpen(false); },
                onError: (err) => setError(err.message),
              }
            );
          }}
          className="flex flex-col gap-4"
        >
          <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Input label="Question" value={question} onChange={(e) => setQuestion(e.target.value)} required />
          {error && <span className="text-2xs text-ui-error">{error}</span>}
          <Button type="submit">{create.isPending ? 'Saving…' : 'Create'}</Button>
        </form>
      </Modal>
    </div>
  );
}
