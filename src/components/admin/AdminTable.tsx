'use client';

import { Button } from '@/components/ui';

interface Column<T> {
  header: string;
  render: (row: T) => React.ReactNode;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  rows?: T[];
  loading: boolean;
  error: unknown;
  page: number;
  total: number;
  limit: number;
  onPage: (page: number) => void;
  toolbar?: React.ReactNode;
}

const pages = (total: number, limit: number) => Math.max(1, Math.ceil(total / limit));

export function AdminTable<T extends { id: string }>({
  columns,
  rows,
  loading,
  error,
  page,
  total,
  limit,
  onPage,
  toolbar,
}: AdminTableProps<T>) {
  if (loading)
    return <div className="py-16 text-center text-brand-gray uppercase tracking-widest text-xs">Loading…</div>;
  if (error)
    return (
      <div className="py-16 text-center text-ui-error text-sm">
        {error instanceof Error ? error.message : 'Failed to load data'}
      </div>
    );
  if (!rows?.length)
    return <div className="py-16 text-center text-brand-gray uppercase tracking-widest text-xs">No data</div>;

  return (
    <>
      {toolbar && <div className="flex flex-wrap items-center gap-3 mb-4">{toolbar}</div>}
      <div className="overflow-x-auto border border-brand-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-border bg-brand-gray">
              {columns.map((c) => (
                <th key={c.header} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider">
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-brand-border last:border-b-0 hover:bg-brand-gray">
                {columns.map((c, i) => (
                  <td key={i} className="px-4 py-3 align-middle">
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-4 text-xs">
        <span className="text-brand-gray">
          {total === 0 ? 0 : (page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
        </span>
        <div className="flex gap-2">
          {page > 1 && (
            <Button size="sm" variant="secondary" onClick={() => onPage(page - 1)} type="button">
              Prev
            </Button>
          )}
          <span className="px-2 py-2">
            {page} / {pages(total, limit)}
          </span>
          {page < pages(total, limit) && (
            <Button size="sm" variant="secondary" onClick={() => onPage(page + 1)} type="button">
              Next
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
