'use client';

import { useState } from 'react';
import { Button, Input, Modal } from '@/components/ui';
import { useActiveWarehouses } from '@/services/admin/admin-warehouse';
import {
  useAddStock,
  useLowStock,
  useSetStock,
  useStockOuts,
  useStockRequests,
  useTransferStock,
  useUpdateStockOutStatus,
  useUpdateStockRequestStatus,
} from '@/services/admin/admin-warehouse';
import type { WarehouseProduct, StockRequest, StockOut } from '@/lib/api-types';

type Op = 'add' | 'set' | 'transfer';

export default function AdminInventoryPage() {
  const [op, setOp] = useState<Op | null>(null);
  const [variantId, setVariantId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [toWarehouseId, setToWarehouseId] = useState('');
  const [stock, setStock] = useState('');
  const { data: warehouses } = useActiveWarehouses();

  const low = useLowStock({ limit: 20 });
  const requests = useStockRequests({ limit: 20 });
  const outs = useStockOuts({ limit: 20 });
  const add = useAddStock();
  const set = useSetStock();
  const transfer = useTransferStock();
  const setReqStatus = useUpdateStockRequestStatus();
  const setOutStatus = useUpdateStockOutStatus();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const body = { variantId, warehouseId, stock: Number(stock) };
    const fn =
      op === 'add' ? () => add.mutateAsync(body) : op === 'set' ? () => set.mutateAsync(body) : () => transfer.mutateAsync({ variantId, fromWarehouseId: warehouseId, toWarehouseId, quantity: Number(stock) });
    try {
      await fn();
      setOp(null);
      setVariantId('');
      setWarehouseId('');
      setToWarehouseId('');
      setStock('');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed');
    }
  }

  const openOp = (kind: Op) => () => setOp(kind);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-xl font-bold uppercase tracking-widest">Inventory</h1>
        <div className="flex gap-2">
          <Button size="sm" type="button" onClick={openOp('add')}>Add Stock</Button>
          <Button size="sm" variant="secondary" type="button" onClick={openOp('set')}>Set Stock</Button>
          <Button size="sm" variant="secondary" type="button" onClick={openOp('transfer')}>Transfer</Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-4">Low Stock</h2>
          <div className="overflow-x-auto border border-brand-border">
            <table className="w-full text-sm">
              <tbody>
                {(low.data?.data ?? []).map((p: WarehouseProduct) => (
                  <tr key={p.id} className="border-b border-brand-border last:border-b-0">
                    <td className="px-4 py-3">{p.name ?? p.sku}</td>
                    <td className="px-4 py-3 font-bold">{p.stock ?? 0}</td>
                  </tr>
                ))}
                {!low.data?.data.length && (
                  <tr>
                    <td className="px-4 py-3 text-brand-gray">No low stock</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-4">Stock Requests</h2>
          <div className="overflow-x-auto border border-brand-border">
            <table className="w-full text-sm">
              <tbody>
                {(requests.data?.data ?? []).map((r: StockRequest) => (
                  <tr key={r.id} className="border-b border-brand-border last:border-b-0">
                    <td className="px-4 py-3">
                      {r.sku ?? r.variantId ?? r.id}
                      <span className="block text-2xs text-brand-gray">
                        qty {r.quantity ?? 0} · {r.status ?? '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {r.status === 'PENDING' && (
                        <Button
                          size="sm"
                          type="button"
                          onClick={() => setReqStatus.mutate({ id: r.id, status: 'APPROVED' })}
                        >
                          Approve
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                {!requests.data?.data.length && (
                  <tr>
                    <td className="px-4 py-3 text-brand-gray">No requests</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-4">Stock Out</h2>
          <div className="overflow-x-auto border border-brand-border">
            <table className="w-full text-sm">
              <tbody>
                {(outs.data?.data ?? []).map((s: StockOut) => (
                  <tr key={s.id} className="border-b border-brand-border last:border-b-0">
                    <td className="px-4 py-3">
                      {s.sku ?? s.id}
                      <span className="block text-2xs text-brand-gray">
                        qty {s.quantity ?? 0} · {s.status ?? '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {s.status === 'PENDING' && (
                        <Button
                          size="sm"
                          type="button"
                          onClick={() => setOutStatus.mutate({ id: s.id, status: 'APPROVED' })}
                        >
                          Approve
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                {!outs.data?.data.length && (
                  <tr>
                    <td className="px-4 py-3 text-brand-gray">No stock-out</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <Modal
        isOpen={!!op}
        onClose={() => setOp(null)}
        title={op === 'add' ? 'Add Stock' : op === 'set' ? 'Set Stock' : 'Transfer Stock'}
      >
        <form onSubmit={submit} className="flex flex-col gap-4">
          <Input label="Variant ID" value={variantId} onChange={(e) => setVariantId(e.target.value)} required />
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-brand-dark">
              {op === 'transfer' ? 'From Warehouse' : 'Warehouse'}
            </label>
            <select
              value={warehouseId}
              onChange={(e) => setWarehouseId(e.target.value)}
              required
              className="w-full border border-brand-border px-4 py-3 text-sm mt-1 bg-white focus:border-brand-black focus:outline-none"
            >
              <option value="">—</option>
              {(warehouses ?? []).map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
          {op === 'transfer' && (
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-brand-dark">To Warehouse</label>
              <select
                value={toWarehouseId}
                onChange={(e) => setToWarehouseId(e.target.value)}
                required
                className="w-full border border-brand-border px-4 py-3 text-sm mt-1 bg-white focus:border-brand-black focus:outline-none"
              >
                <option value="">—</option>
                {(warehouses ?? []).map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <Input label="Quantity" type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
          <Button type="submit">{add.isPending || set.isPending || transfer.isPending ? 'Saving…' : 'Submit'}</Button>
        </form>
      </Modal>
    </div>
  );
}
