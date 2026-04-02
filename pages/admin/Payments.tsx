import React, { useEffect, useMemo, useState } from 'react';
import { adminAPI } from '../../services/api';
import { Badge, Button, Card, ConfirmModal, Input, Modal, Select, Toast } from '../../components/ui';
import { formatApiDateTime } from '../../utils/date';
import {
  Banknote,
  Clock,
  Wallet,
  CheckCircle,
  ArrowUpCircle,
  MapPin,
  User,
  Star,
  History,
  Camera,
  ShieldCheck,
} from 'lucide-react';

type PendingPayment = {
  id: string;
  cleaner_id: string;
  cleaner_name: string;
  cleaner_email?: string;
  task_id: string;
  task_description?: string;
  task_completed_at?: string;
  task_status?: string;
  report_id?: string;
  report_description?: string;
  before_image_url?: string;
  after_image_url?: string;
  review_rating?: number;
  review_comment?: string;
  review_created_at?: string;
  completion_percentage?: number;
  quality_rating?: string;
  verification_status?: string;
  location?: { lat: number; lng: number } | null;
  amount: number;
  created_at: string;
};

type FundTransaction = {
  id: string;
  type: 'TOP_UP' | 'PAYOUT' | string;
  amount: number;
  balance_after: number;
  note?: string;
  created_by_name?: string;
  created_at: string;
};

type PaymentSummary = {
  overall?: {
    pending_amount?: number;
    pending_transactions?: number;
    paid_amount?: number;
    paid_transactions?: number;
  };
  wallet?: {
    current_balance?: number;
    total_added?: number;
    total_paid?: number;
  };
};

export const AdminPayments = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pending, setPending] = useState<PendingPayment[]>([]);
  const [fundHistory, setFundHistory] = useState<FundTransaction[]>([]);
  const [summary, setSummary] = useState<PaymentSummary>({});
  const [selectedPromise, setSelectedPromise] = useState<PendingPayment | null>(null);

  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showTopUpConfirm, setShowTopUpConfirm] = useState(false);
  const [showPayoutConfirm, setShowPayoutConfirm] = useState(false);

  const [topUpAmount, setTopUpAmount] = useState('5000');
  const [topUpSource, setTopUpSource] = useState<'BKASH' | 'BANK' | 'CARD'>('BKASH');
  const [topUpSourceAccount, setTopUpSourceAccount] = useState('');
  const [topUpReference, setTopUpReference] = useState('');
  const [topUpNote, setTopUpNote] = useState('Mock gateway funding');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>({ show: false, message: '', type: 'success' });

  const walletBalance = Number(summary?.wallet?.current_balance || 0);
  const promisedAmount = Number(summary?.overall?.pending_amount || 0);
  const promisedCount = Number(summary?.overall?.pending_transactions || pending.length || 0);

  const canPaySelected = useMemo(() => {
    if (!selectedPromise) return false;
    return walletBalance >= Number(selectedPromise.amount || 0);
  }, [selectedPromise, walletBalance]);

  const loadData = async (initial = false) => {
    try {
      if (initial) setIsLoading(true);
      else setIsRefreshing(true);

      // Load the payment screen in sequence to avoid bursty pool usage on Render.
      const paymentSummary = await adminAPI.getPaymentSummary();
      const pendingData = await adminAPI.getPendingPayments();
      const fundHistoryData = await adminAPI.getFundTransactionHistory();

      setPending(Array.isArray(pendingData) ? pendingData : []);
      setFundHistory(Array.isArray(fundHistoryData) ? fundHistoryData : []);
      setSummary((paymentSummary || {}) as PaymentSummary);
    } catch (error) {
      console.error('Failed to load payment data:', error);
      setToast({ show: true, message: 'Failed to load payment data', type: 'error' });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData(true);
  }, []);

  const handleTopUpSubmit = () => {
    const amount = Number(topUpAmount);
    if (!amount || amount <= 0) {
      setToast({ show: true, message: 'Enter a valid top-up amount', type: 'warning' });
      return;
    }

    if (!topUpReference.trim()) {
      setToast({ show: true, message: 'Reference/transaction ID is required for mock gateway flow', type: 'warning' });
      return;
    }

    setShowTopUpConfirm(true);
  };

  const handleTopUpConfirm = async () => {
    const amount = Number(topUpAmount);
    if (!amount || amount <= 0) return;

    setIsSubmitting(true);
    try {
      const sourceLabel = topUpSource === 'BKASH' ? 'bKash' : topUpSource === 'BANK' ? 'Bank Transfer' : 'Card';
      const methodDetails = [
        `Source: ${sourceLabel}`,
        topUpSourceAccount.trim() ? `Account: ${topUpSourceAccount.trim()}` : '',
        `Ref: ${topUpReference.trim()}`,
      ]
        .filter(Boolean)
        .join(' | ');

      const finalNote = [topUpNote?.trim(), methodDetails].filter(Boolean).join(' || ');

      await adminAPI.topUpSystemFunds({
        amount,
        note: finalNote || undefined,
      });

      setShowTopUpConfirm(false);
      setShowTopUpModal(false);
      setToast({ show: true, message: `System wallet topped up by ৳${amount.toLocaleString()}`, type: 'success' });
      await loadData();
    } catch (error: any) {
      console.error('Top-up failed:', error);
      setToast({ show: true, message: error?.message || 'Top-up failed', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmPayout = async () => {
    if (!selectedPromise) return;

    setIsSubmitting(true);
    try {
      await adminAPI.processPayments({ transaction_ids: [selectedPromise.id] });

      setShowPayoutConfirm(false);
      setSelectedPromise(null);
      setToast({
        show: true,
        message: `Payment confirmed for ${selectedPromise.cleaner_name} (৳${Number(selectedPromise.amount).toLocaleString()})`,
        type: 'success',
      });
      await loadData();
    } catch (error: any) {
      console.error('Payout confirmation failed:', error);
      setToast({
        show: true,
        message: error?.message || 'Failed to confirm payment',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Loading payment center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6">
      <Toast
        isOpen={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        message={toast.message}
        type={toast.type}
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Payments Center</h1>
          <p className="text-slate-600 dark:text-slate-300">
            Manage system balance, payout promises, and payment confirmations.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => loadData()} disabled={isRefreshing}>
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button onClick={() => setShowTopUpModal(true)}>
            <ArrowUpCircle size={16} className="mr-2" />
            Add Funds
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <Wallet size={18} className="text-emerald-700 dark:text-emerald-300" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">System Wallet</p>
              <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">৳{walletBalance.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Clock size={18} className="text-amber-700 dark:text-amber-300" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pending Promises</p>
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{promisedCount}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Banknote size={18} className="text-blue-700 dark:text-blue-300" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Promised Amount</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">৳{promisedAmount.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Payout Promises (Task/Cleaner Based)">
        {pending.length === 0 ? (
          <div className="py-10 text-center text-slate-500 dark:text-slate-400">
            <CheckCircle size={36} className="mx-auto mb-2 opacity-50" />
            No pending promises right now.
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {item.cleaner_name} <span className="text-slate-500">(Task #{item.task_id?.slice(-8)})</span>
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-1">
                      {item.task_description || item.report_description || 'Task details unavailable'}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1"><User size={12} /> {item.cleaner_email || 'No email'}</span>
                      <span className="inline-flex items-center gap-1"><Clock size={12} /> {formatApiDateTime(item.task_completed_at, 'Not completed time')}</span>
                      {item.location && (
                        <span className="inline-flex items-center gap-1"><MapPin size={12} /> {item.location.lat.toFixed(4)}, {item.location.lng.toFixed(4)}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                    <div className="shrink-0">
                      <Badge variant={item.task_status === 'COMPLETED' ? 'success' : 'warning'}>
                        {item.task_status || 'PENDING'}
                      </Badge>
                    </div>
                    <span className="text-lg font-bold text-green-700 dark:text-green-300 shrink-0">৳{Number(item.amount).toLocaleString()}</span>
                    <Button className="whitespace-nowrap shrink-0" variant="outline" onClick={() => setSelectedPromise(item)}>
                      Review & Confirm
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title="System Wallet Transaction History">
        {fundHistory.length === 0 ? (
          <div className="py-8 text-center text-slate-500 dark:text-slate-400">No wallet transactions yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-300">
                <tr>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Balance After</th>
                  <th className="px-4 py-3">Note</th>
                  <th className="px-4 py-3">By</th>
                  <th className="px-4 py-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {fundHistory.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                    <td className="px-4 py-3">
                      <Badge variant={txn.type === 'TOP_UP' ? 'success' : 'info'}>{txn.type === 'TOP_UP' ? 'TOP UP' : 'PAYOUT'}</Badge>
                    </td>
                    <td className="px-4 py-3 font-medium">৳{Number(txn.amount || 0).toLocaleString()}</td>
                    <td className="px-4 py-3">৳{Number(txn.balance_after || 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{txn.note || '-'}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{txn.created_by_name || 'System'}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{formatApiDateTime(txn.created_at, '-')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        isOpen={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
        title="Add Funds (Mock Payment Gateway)"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowTopUpModal(false)}>Cancel</Button>
            <Button onClick={handleTopUpSubmit}>Continue</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-sm text-blue-800 dark:text-blue-200">
            This is a mock gateway top-up. No real payment provider is used.
          </div>
          <Input
            label="Amount (BDT)"
            type="number"
            min={1}
            value={topUpAmount}
            onChange={(e) => setTopUpAmount(e.target.value)}
            placeholder="Enter amount"
          />

          <Select
            label="Funding Source"
            value={topUpSource}
            onChange={(e) => setTopUpSource(e.target.value as 'BKASH' | 'BANK' | 'CARD')}
            options={[
              { value: 'BKASH', label: 'From bKash' },
              { value: 'BANK', label: 'From Bank Transfer' },
              { value: 'CARD', label: 'From Card' },
            ]}
          />

          <Input
            label={topUpSource === 'BKASH' ? 'bKash Number' : topUpSource === 'BANK' ? 'Bank Account (masked)' : 'Card Number (last 4)'}
            value={topUpSourceAccount}
            onChange={(e) => setTopUpSourceAccount(e.target.value)}
            placeholder={topUpSource === 'BKASH' ? '01XXXXXXXXX' : topUpSource === 'BANK' ? 'AC-****1234' : '**** 1234'}
          />

          <Input
            label={topUpSource === 'BKASH' ? 'bKash TrxID' : topUpSource === 'BANK' ? 'Bank Transfer Ref' : 'Card Auth Code'}
            value={topUpReference}
            onChange={(e) => setTopUpReference(e.target.value)}
            placeholder={topUpSource === 'BKASH' ? 'e.g. B4KX9A2P' : topUpSource === 'BANK' ? 'e.g. NPSB-784551' : 'e.g. AUTH-55231'}
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Note (optional)</label>
            <textarea
              value={topUpNote}
              onChange={(e) => setTopUpNote(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800"
              placeholder="Funding source note"
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!selectedPromise}
        onClose={() => setSelectedPromise(null)}
        title={selectedPromise ? `Payout Review - ${selectedPromise.cleaner_name}` : 'Payout Review'}
        footer={
          selectedPromise ? (
            <>
              <Button variant="outline" onClick={() => setSelectedPromise(null)}>Close</Button>
              <Button
                onClick={() => setShowPayoutConfirm(true)}
                disabled={!canPaySelected || isSubmitting}
              >
                {isSubmitting ? 'Confirming...' : 'Confirm Payment'}
              </Button>
              <button
                onClick={() => setShowTopUpModal(true)}
                className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 transition-all touch-manipulation"
              >
                <ArrowUpCircle size={14} className="sm:w-4 sm:h-4 mr-2 inline" />
                Add Funds
              </button>
            </>
          ) : undefined
        }
      >
        {selectedPromise && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/40">
                <p className="text-xs text-slate-500 dark:text-slate-400">Cleaner</p>
                <p className="font-semibold text-slate-900 dark:text-slate-100">{selectedPromise.cleaner_name}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/40">
                <p className="text-xs text-slate-500 dark:text-slate-400">Promised Amount</p>
                <p className="font-semibold text-green-700 dark:text-green-300">৳{Number(selectedPromise.amount).toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/40">
                <p className="text-xs text-slate-500 dark:text-slate-400">Wallet Balance</p>
                <p className={`font-semibold ${canPaySelected ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>
                  ৳{walletBalance.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2 inline-flex items-center gap-2">
                  <Camera size={16} /> Before
                </h4>
                {selectedPromise.before_image_url ? (
                  <img src={selectedPromise.before_image_url} alt="Before cleanup" className="w-full h-44 object-cover rounded-lg border border-slate-200 dark:border-slate-700" />
                ) : (
                  <div className="h-44 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center text-sm text-slate-500">No before image</div>
                )}
              </div>
              <div>
                <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2 inline-flex items-center gap-2">
                  <CheckCircle size={16} /> After
                </h4>
                {selectedPromise.after_image_url ? (
                  <img src={selectedPromise.after_image_url} alt="After cleanup" className="w-full h-44 object-cover rounded-lg border border-slate-200 dark:border-slate-700" />
                ) : (
                  <div className="h-44 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center text-sm text-slate-500">No after image uploaded</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60">
                <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2 inline-flex items-center gap-2">
                  <ShieldCheck size={16} /> Citizen Watchdog Review
                </h4>
                {selectedPromise.review_rating ? (
                  <>
                    <p className="text-sm text-slate-700 dark:text-slate-300 inline-flex items-center gap-1">
                      <Star size={14} className="text-amber-500" /> {selectedPromise.review_rating}/5
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{selectedPromise.review_comment || 'No comment provided.'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {formatApiDateTime(selectedPromise.review_created_at, '')}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400">No citizen review submitted yet.</p>
                )}
              </div>

              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60">
                <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2 inline-flex items-center gap-2">
                  <History size={16} /> Verification Snapshot
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Task status: {selectedPromise.task_status || 'Unknown'}</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">Completion: {selectedPromise.completion_percentage ?? 'N/A'}%</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">Quality: {selectedPromise.quality_rating || 'N/A'}</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">Verification: {selectedPromise.verification_status || 'N/A'}</p>
              </div>
            </div>

            {!canPaySelected && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-sm text-red-700 dark:text-red-300">
                Insufficient wallet balance for this payout. Add funds first.
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmModal
        isOpen={showTopUpConfirm}
        onClose={() => setShowTopUpConfirm(false)}
        onConfirm={handleTopUpConfirm}
        title="Confirm Wallet Top-up"
        message={`Add ৳${Number(topUpAmount || 0).toLocaleString()} from ${topUpSource === 'BKASH' ? 'bKash' : topUpSource === 'BANK' ? 'Bank Transfer' : 'Card'} to system wallet?`}
        confirmText={isSubmitting ? 'Processing...' : 'Confirm Top-up'}
        type="info"
      />

      <ConfirmModal
        isOpen={showPayoutConfirm}
        onClose={() => setShowPayoutConfirm(false)}
        onConfirm={handleConfirmPayout}
        title="Confirm Cleaner Payment"
        message={selectedPromise ? `Release ৳${Number(selectedPromise.amount).toLocaleString()} to ${selectedPromise.cleaner_name}?` : 'Confirm payout?'}
        confirmText={isSubmitting ? 'Confirming...' : 'Confirm Payment'}
        type="success"
      />
    </div>
  );
};
