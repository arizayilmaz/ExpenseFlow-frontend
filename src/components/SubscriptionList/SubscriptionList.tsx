import type { ISubscription } from '../../types/types';

/**
 * A helper function to determine the status and styling of a subscription.
 * @param subscription The subscription object to evaluate.
 * @param today The current date.
 * @returns An object with the status label, color class, and paid status.
 */
const getSubscriptionStatus = (subscription: ISubscription, today: Date) => {
  const currentCycle = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  if (!subscription.paymentDay) {
    return { label: 'Payment Day Not Set', colorClass: 'text-gray-500 border-gray-300', isPaid: false };
  }
  
  const paymentDateThisMonth = new Date(today.getFullYear(), today.getMonth(), subscription.paymentDay);
  const isPaidThisCycle = subscription.lastPaidCycle === currentCycle;

  if (isPaidThisCycle) {
    return { label: 'Paid', colorClass: 'text-green-600 border-green-500', isPaid: true };
  }

  const todayWithoutTime = new Date();
  todayWithoutTime.setHours(0, 0, 0, 0);

  if (todayWithoutTime > paymentDateThisMonth) {
    return { label: 'Overdue', colorClass: 'text-red-600 border-red-500', isPaid: false };
  }

  if (todayWithoutTime.getTime() === paymentDateThisMonth.getTime()) {
    return { label: 'Due Today', colorClass: 'text-yellow-600 border-yellow-500', isPaid: false };
  }

  return { label: 'Pending', colorClass: 'text-gray-800 border-gray-300', isPaid: false };
};

/**
 * Props for the SubscriptionList component.
 */
interface SubscriptionListProps {
  subscriptions: ISubscription[];
  onToggleSubscription: (id: string) => void;
  onDeleteSubscription: (id: string) => void;
  onEditSubscription: (subscription: ISubscription) => void;
}

/**
 * Displays a list of monthly subscriptions.
 * Each item shows its status and provides controls for editing and deleting.
 */
function SubscriptionList({ subscriptions, onToggleSubscription, onDeleteSubscription, onEditSubscription }: SubscriptionListProps) {
  const today = new Date();

  return (
    <div>
      <h3 className="text-xl font-semibold text-slate-700 border-b-2 border-green-500 pb-2 mb-4 inline-block">
        Monthly Subscriptions
      </h3>
      {subscriptions.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No subscriptions added yet.</p>
      ) : (
        <div className="space-y-3">
          {subscriptions.map((sub) => {
            const status = getSubscriptionStatus(sub, today);
            return (
              <div key={sub.id} className={`p-4 rounded-xl border bg-white transition-all duration-300 ${status.colorClass} hover:shadow-md hover:border-transparent`}>
                {/* DÜZELTME: Eksik olan JSX içeriği buraya eklendi. */}
                <div className="flex items-center justify-between">
                  {/* Sol Taraf: Checkbox, İsim ve Durum Etiketi */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={status.isPaid}
                      onChange={() => onToggleSubscription(sub.id)}
                      className="h-5 w-5 rounded border-slate-300 text-green-600 focus:ring-green-500 cursor-pointer"
                    />
                    <div className="ml-4">
                      <p className="font-semibold text-slate-800">{sub.name}</p>
                      <p className={`text-xs font-medium ${status.colorClass}`}>{status.label}</p>
                    </div>
                  </div>
                  {/* Sağ Taraf: Tutar ve Ödeme Günü */}
                  <div className="text-right">
                    <p className="font-bold text-slate-800">{sub.amount.toFixed(2)} TL</p>
                    <p className="text-xs text-slate-400">Day {sub.paymentDay} of Month</p>
                  </div>
                </div>
                {/* Edit and Delete buttons */}
                <div className="flex items-center justify-end space-x-2 mt-2 pt-2 border-t border-slate-100">
                  <button onClick={() => onEditSubscription(sub)} className="text-xs font-medium text-slate-500 hover:text-blue-600 px-2 py-1 rounded">
                    Edit
                  </button>
                  <span className="text-slate-300">|</span>
                  <button onClick={() => onDeleteSubscription(sub.id)} className="text-xs font-medium text-slate-500 hover:text-red-600 px-2 py-1 rounded">
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SubscriptionList;