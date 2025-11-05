import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { Card, CardHeader, CardContent, Badge, Button } from '../ui';

export interface Property {
  id: string;
  address: string;
  type: 'apartment' | 'house' | 'commercial' | 'industrial';
  size: number; // in square meters
  tenants: number;
  status: 'active' | 'pending' | 'inactive' | 'maintenance';
  monthlyConsumption: {
    electricity: number; // kWh
    gas: number; // m³
    water: number; // m³
  };
  lastBillAmount: number; // in euros
  lastBillDate: string;
  nextBillDate: string;
  manager?: string;
}

export interface PropertyCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'property'> {
  property: Property;
  onViewDetails?: (property: Property) => void;
  onEditProperty?: (property: Property) => void;
  onViewBills?: (property: Property) => void;
  showActions?: boolean;
}

const propertyTypeLabels = {
  apartment: 'Διαμέρισμα',
  house: 'Κατοικία',
  commercial: 'Εμπορικό',
  industrial: 'Βιομηχανικό',
} as const;

const statusLabels = {
  active: 'Ενεργό',
  pending: 'Εκκρεμές',
  inactive: 'Ανενεργό',
  maintenance: 'Συντήρηση',
} as const;

const statusVariants = {
  active: 'success' as const,
  pending: 'warning' as const,
  inactive: 'secondary' as const,
  maintenance: 'info' as const,
};

export const PropertyCard = forwardRef<HTMLDivElement, PropertyCardProps>(
  ({
    property,
    onViewDetails,
    onEditProperty,
    onViewBills,
    showActions = true,
    className = '',
    ...props
  }, ref) => {
    const handleViewDetails = () => {
      onViewDetails?.(property);
    };

    const handleEditProperty = () => {
      onEditProperty?.(property);
    };

    const handleViewBills = () => {
      onViewBills?.(property);
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

    return (
      <Card
        ref={ref}
        variant="elevated"
        className={`hover:shadow-lg transition-shadow duration-200 ${className}`}
        {...props}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {property.address}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" size="sm">
                  {propertyTypeLabels[property.type]}
                </Badge>
                <Badge
                  variant={statusVariants[property.status]}
                  size="sm"
                >
                  {statusLabels[property.status]}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {/* Property Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Εμβαδόν</p>
                <p className="font-medium">{property.size} m²</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ενοικιαστές</p>
                <p className="font-medium">{property.tenants}</p>
              </div>
            </div>

            {/* Monthly Consumption */}
            <div>
              <p className="text-sm text-gray-500 mb-2">Μηνιαία Κατανάλωση</p>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="bg-blue-50 p-2 rounded">
                  <p className="text-blue-600 font-medium">
                    {property.monthlyConsumption.electricity} kWh
                  </p>
                  <p className="text-blue-500 text-xs">Ρεύμα</p>
                </div>
                <div className="bg-orange-50 p-2 rounded">
                  <p className="text-orange-600 font-medium">
                    {property.monthlyConsumption.gas} m³
                  </p>
                  <p className="text-orange-500 text-xs">Φυσικό Αέριο</p>
                </div>
                <div className="bg-cyan-50 p-2 rounded">
                  <p className="text-cyan-600 font-medium">
                    {property.monthlyConsumption.water} m³
                  </p>
                  <p className="text-cyan-500 text-xs">Νερό</p>
                </div>
              </div>
            </div>

            {/* Billing Information */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-500">Τελευταίος Λογαριασμός</p>
                <p className="font-semibold text-green-600">
                  {formatCurrency(property.lastBillAmount)}
                </p>
              </div>
              <div className="flex justify-between items-center text-sm">
                <p className="text-gray-500">
                  Ημερομηνία: {formatDate(property.lastBillDate)}
                </p>
                <p className="text-gray-500">
                  Επόμενος: {formatDate(property.nextBillDate)}
                </p>
              </div>
            </div>

            {property.manager && (
              <div className="border-t pt-2">
                <p className="text-sm text-gray-500">Διαχειριστής</p>
                <p className="font-medium text-sm">{property.manager}</p>
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
                onClick={handleViewDetails}
                className="flex-1"
              >
                Λεπτομέρειες
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewBills}
                className="flex-1"
              >
                Λογαριασμοί
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEditProperty}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </Button>
            </div>
          </div>
        )}
      </Card>
    );
  }
);

PropertyCard.displayName = 'PropertyCard';