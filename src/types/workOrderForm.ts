
// WorkOrderForm related types

export interface WorkOrderFormData {
  id?: string;
  propertyId: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  startDate: string;
  dueDate: string;
  assignedTo: string[];
  estimatedHours: number;
  materialsCost: number;
  laborCost: number;
  additionalCharges: AdditionalCharge[];
  totalCost: number;
  notes: string;
}

export interface AdditionalCharge {
  id: string;
  description: string;
  amount: number;
}

export interface BillingRate {
  id: string;
  name: string;
  rate: number;
}
