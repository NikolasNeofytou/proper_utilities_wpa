import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { Card, CardHeader, CardContent, Badge, Button } from '../ui';

export interface Bill {
  id: string;
  propertyId: string;
  propertyAddress: string;
  type: 'electricity' | 'gas' | 'water' | 'combined';
  period: {
    start: string;
    end: string;
  };
  consumption: {
    current: number;
    previous: number;
    usage: number;
    unit: string;
  };
  charges: {
    baseCharge: number;
    consumptionCharge: number;
    taxes: number;
    fees: number;
    total: number;
  };
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  issueDate: string;
  dueDate: string;
  paymentDate?: string;
  paymentMethod?: string;
}

export interface BillViewerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'bill'> {
  bill: Bill;
  onDownload?: (bill: Bill) => void;
  onPay?: (bill: Bill) => void;
  onViewHistory?: (propertyId: string) => void;
  showActions?: boolean;
}

const billTypeLabels = {
  electricity: 'Ρεύμα',
  gas: 'Φυσικό Αέριο',
  water: 'Νερό',
  combined: 'Συνδυασμένος',
} as const;

const statusLabels = {
  pending: 'Εκκρεμής',
  paid: 'Πληρωμένος',
  overdue: 'Ληξιπρόθεσμος',
  cancelled: 'Ακυρωμένος',
} as const;

const statusVariants = {
  pending: 'warning' as const,
  paid: 'success' as const,
  overdue: 'error' as const,
  cancelled: 'secondary' as const,
};

const typeColors = {
  electricity: 'bg-blue-50 text-blue-700 border-blue-200',
  gas: 'bg-orange-50 text-orange-700 border-orange-200',
  water: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  combined: 'bg-purple-50 text-purple-700 border-purple-200',
} as const;

export const BillViewer = forwardRef<HTMLDivElement, BillViewerProps>(
  ({
    bill,
    onDownload,
    onPay,
    onViewHistory,
    showActions = true,
    className = '',
    ...props
  }, ref) => {
    const handleDownload = () => {
      onDownload?.(bill);
    };

    const handlePay = () => {
      onPay?.(bill);
    };

    const handleViewHistory = () => {
      onViewHistory?.(bill.propertyId);
    };

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('el-GR', {
        style: 'currency',
        currency: 'EUR',
      }).format(amount);
    };

    const formatDate = (dateString: string) => {
      return new Intl.DateTimeFormat('el-GR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(new Date(dateString));
    };

    const formatPeriod = (start: string, end: string) => {
      const startDate = new Date(start);
      const endDate = new Date(end);
      return `${startDate.toLocaleDateString('el-GR', { month: 'short', year: 'numeric' })} - ${endDate.toLocaleDateString('el-GR', { month: 'short', year: 'numeric' })}`;
    };

    const isOverdue = bill.status === 'overdue' || (bill.status === 'pending' && new Date(bill.dueDate) < new Date());

    return (
      <Card
        ref={ref}
        variant="elevated"
        className={`${isOverdue ? 'border-l-4 border-l-red-500' : ''} ${className}`}
        {...props}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className={`px-2 py-1 rounded-md text-sm font-medium border ${typeColors[bill.type]}`}>
                  {billTypeLabels[bill.type]}
                </div>
                <Badge
                  variant={statusVariants[bill.status]}
                  size="sm"
                >
                  {statusLabels[bill.status]}
                </Badge>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {bill.propertyAddress}
              </h3>
              <p className="text-sm text-gray-500">
                Περίοδος: {formatPeriod(bill.period.start, bill.period.end)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(bill.charges.total)}
              </p>
              {isOverdue && (
                <p className="text-sm text-red-600 font-medium">
                  Ληξιπρόθεσμος
                </p>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {/* Consumption Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Κατανάλωση</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Προηγούμενη Ένδειξη</p>
                  <p className="font-medium">
                    {bill.consumption.previous.toLocaleString()} {bill.consumption.unit}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Τρέχουσα Ένδειξη</p>
                  <p className="font-medium">
                    {bill.consumption.current.toLocaleString()} {bill.consumption.unit}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Συνολική Χρήση</p>
                  <p className="font-medium text-blue-600">
                    {bill.consumption.usage.toLocaleString()} {bill.consumption.unit}
                  </p>
                </div>
              </div>
            </div>

            {/* Charges Breakdown */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Αναλυτική Χρέωση</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Βασικό Τέλος</span>
                  <span className="font-medium">{formatCurrency(bill.charges.baseCharge)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Χρέωση Κατανάλωσης</span>
                  <span className="font-medium">{formatCurrency(bill.charges.consumptionCharge)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Φόροι</span>
                  <span className="font-medium">{formatCurrency(bill.charges.taxes)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Λοιπά Τέλη</span>
                  <span className="font-medium">{formatCurrency(bill.charges.fees)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold border-t pt-2">
                  <span>Συνολικό Ποσό</span>
                  <span className="text-green-600">{formatCurrency(bill.charges.total)}</span>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Ημερομηνία Έκδοσης</p>
                <p className="font-medium">{formatDate(bill.issueDate)}</p>
              </div>
              <div>
                <p className="text-gray-500">Ημερομηνία Λήξης</p>
                <p className={`font-medium ${isOverdue ? 'text-red-600' : ''}`}>
                  {formatDate(bill.dueDate)}
                </p>
              </div>
            </div>

            {bill.status === 'paid' && bill.paymentDate && (
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="font-medium text-green-800">Πληρωμένος</p>
                    <p className="text-sm text-green-600">
                      {formatDate(bill.paymentDate)}
                      {bill.paymentMethod && ` • ${bill.paymentMethod}`}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        {showActions && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Λήψη
              </Button>
              
              {bill.status === 'pending' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handlePay}
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Πληρωμή
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleViewHistory}
              >
                Ιστορικό
              </Button>
            </div>
          </div>
        )}
      </Card>
    );
  }
);

BillViewer.displayName = 'BillViewer';