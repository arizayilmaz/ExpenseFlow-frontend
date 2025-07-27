import { formatCurrency } from '../../utils/formatters';
import type { IExpense } from '../../types/types';

interface ExpenseListProps {
  expenses: IExpense[];
  onDeleteExpense: (id: string) => void;
  onEditExpense: (expense: IExpense) => void;
}

function ExpenseList({ expenses, onDeleteExpense, onEditExpense }: ExpenseListProps) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-slate-700 border-b-2 border-blue-500 pb-2 mb-4 inline-block">
        One-Time Expenses
      </h3>
      {expenses.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No one-time expenses added yet.</p>
      ) : (
        <ul className="space-y-2">
          {expenses.map((expense) => (
            <li
              key={expense.id}
              className="group flex justify-between items-center bg-white hover:bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm"
            >
              <div>
                <p className="font-semibold text-slate-800">{expense.description}</p>
                <p className="text-xs text-slate-400">{new Date(expense.date).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-slate-800">
                  {formatCurrency(expense.amount)}
                </span>
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-slate-300 mx-2">|</span>
                  <button onClick={() => onEditExpense(expense)} className="text-xs font-medium text-slate-500 hover:text-blue-600 px-2 py-1 rounded">
                    Edit
                  </button>
                  <span className="text-slate-300">|</span>
                  <button onClick={() => onDeleteExpense(expense.id)} className="text-xs font-medium text-slate-500 hover:text-red-600 px-2 py-1 rounded">
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ExpenseList;