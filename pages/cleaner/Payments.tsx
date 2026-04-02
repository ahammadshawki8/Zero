import React, { useEffect, useState } from 'react';
import { Badge, Button, Card, ConfirmModal, Input, Modal, Select, Toast } from '../../components/ui';
import { cleanerAPI } from '../../services/api';
import { ArrowDownToLine, Banknote, Clock, Wallet } from 'lucide-react';
import { formatApiDateTime } from '../../utils/date';

type PaymentSummary = {
  total_earnings: number;
  pending_promises: number;
  withdrawn_total: number;
  available_balance: number;
};

type PaymentTimelineItem = {
  id: string;
  event_type: 'WITHDRAWAL' | 'ADMIN_PAYMENT' | string;
  amount: number;
  method: 'BKASH' | 'BANK' | 'CARD' | string;
  destination_account?: string;
  reference_code?: string;
  note?: string;
  status: 'PROCESSED' | 'PENDING' | 'FAILED' | string;
  event_at?: string;
  processed_at?: string;
  task_id?: string;
  task_description?: string;
};

export const CleanerPayments = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [history, setHistory] = useState<PaymentTimelineItem[]>([]);

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [amount, setAmount] = useState('1000');
  const [method, setMethod] = useState<'BKASH' | 'BANK' | 'CARD'>('BKASH');
  const [destinationAccount, setDestinationAccount] = useState('');
  const [referenceCode, setReferenceCode] = useState('');
  const [note, setNote] = useState('');

  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'warning' | 'info' }>({
    show: false,
    message: '',
    type: 'success',
  });

  const loadData = async () => {
    try {
      setIsLoading(true);
      const summaryData = await cleanerAPI.getPaymentSummary();
      const historyData = await cleanerAPI.getPaymentHistory();

      setSummary(summaryData || null);
      setHistory(Array.isArray(historyData) ? historyData : []);
    } catch (error) {
      console.error('Failed to load cleaner payment data:', error);
      setToast({ show: true, message: 'Failed to load payment data', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmitWithdraw = () => {
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      setToast({ show: true, message: 'Enter a valid withdrawal amount', type: 'warning' });
      return;
    }

    if (!destinationAccount.trim()) {
      setToast({ show: true, message: 'Destination account is required', type: 'warning' });
      return;
    }

    if (!summary || numericAmount > Number(summary.available_balance || 0)) {
      setToast({ show: true, message: 'Insufficient available balance', type: 'error' });
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmWithdraw = async () => {
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) return;

    setIsSubmitting(true);
    try {
      await cleanerAPI.requestWithdrawal({
        amount: numericAmount,
        method,
        destination_account: destinationAccount.trim(),
        reference_code: referenceCode.trim() || undefined,
        note: note.trim() || undefined,
      });

      setShowConfirmModal(false);
      setShowWithdrawModal(false);
      setDestinationAccount('');
      setReferenceCode('');
      setNote('');

      setToast({
        show: true,
        message: `Withdrawal of ৳${numericAmount.toLocaleString()} was processed successfully`,
        type: 'success',
      });

      await loadData();
    } catch (error: any) {
      console.error('Withdrawal failed:', error);
      setToast({ show: true, message: error?.message || 'Withdrawal failed', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Loading payments...</p>
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
        <div className="w-full">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100">Payments</h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Withdraw confirmed earnings to your bKash, bank account, or card.
          </p>
        </div>
        <Button onClick={() => setShowWithdrawModal(true)}>
          <ArrowDownToLine size={16} className="mr-2" />
          Withdraw Money
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <Wallet size={18} className="text-emerald-700 dark:text-emerald-300" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Available Balance</p>
              <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                ৳{Number(summary?.available_balance || 0).toLocaleString()}
              </p>
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
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                ৳{Number(summary?.pending_promises || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Banknote size={18} className="text-blue-700 dark:text-blue-300" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Withdrawn</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                ৳{Number(summary?.withdrawn_total || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/40 text-sm text-slate-600 dark:text-slate-300 mb-4">
          Balance increases only when admin confirms payout promises for your completed tasks.
        </div>

        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">Payment History</h3>
        {history.length === 0 ? (
          <div className="py-8 text-center text-slate-500 dark:text-slate-400">No payment history yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-300">
                <tr>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Details</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <td className="px-4 py-3">
                      <Badge variant={item.event_type === 'ADMIN_PAYMENT' ? 'success' : 'info'}>
                        {item.event_type === 'ADMIN_PAYMENT' ? 'Admin Payment' : 'Withdrawal'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">{item.method}</td>
                    <td className="px-4 py-3">
                      {item.event_type === 'ADMIN_PAYMENT'
                        ? (item.task_description || 'Task payout')
                        : (item.destination_account || '-')}
                    </td>
                    <td className="px-4 py-3 font-medium">৳{Number(item.amount || 0).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <Badge variant={item.status === 'PROCESSED' || item.status === 'PAID' ? 'success' : 'warning'}>{item.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                      {formatApiDateTime(item.event_at, '-')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        title="Withdraw Earnings"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowWithdrawModal(false)}>Cancel</Button>
            <Button onClick={handleSubmitWithdraw}>Continue</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-sm text-blue-800 dark:text-blue-200">
            You can withdraw only your confirmed available balance.
          </div>

          <Input
            label="Amount (BDT)"
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />

          <Select
            label="Withdraw To"
            value={method}
            onChange={(e) => setMethod(e.target.value as 'BKASH' | 'BANK' | 'CARD')}
            options={[
              { value: 'BKASH', label: 'bKash' },
              { value: 'BANK', label: 'Bank Account' },
              { value: 'CARD', label: 'Card' },
            ]}
          />

          <Input
            label={method === 'BKASH' ? 'bKash Number' : method === 'BANK' ? 'Bank Account' : 'Card Number (masked)'}
            value={destinationAccount}
            onChange={(e) => setDestinationAccount(e.target.value)}
            placeholder={method === 'BKASH' ? '01XXXXXXXXX' : method === 'BANK' ? 'AC-****1234' : '**** 1234'}
          />

          <Input
            label={method === 'BKASH' ? 'TrxID (optional)' : method === 'BANK' ? 'Transfer Ref (optional)' : 'Auth Code (optional)'}
            value={referenceCode}
            onChange={(e) => setReferenceCode(e.target.value)}
            placeholder="Reference code"
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Note (optional)</label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800"
              placeholder="Add note"
            />
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmWithdraw}
        title="Confirm Withdrawal"
        message={`Withdraw ৳${Number(amount || 0).toLocaleString()} to ${method}?`}
        confirmText={isSubmitting ? 'Processing...' : 'Confirm Withdrawal'}
        type="info"
      />
    </div>
  );
};
