export interface Property {
  id: string;
  name: string;
  address: string;
  status: 'active' | 'inactive';
  lastInspection: string;
}

export interface WorkOrder {
  id: string;
  propertyId: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}

export interface Invoice {
  id: string;
  workOrderId: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid';
  dueDate: string;
}

export interface JobRequest {
  id: string;
  propertyId: string;
  requestedBy: string;
  description: string;
  status: 'new' | 'reviewed' | 'approved' | 'rejected';
  submittedDate: string;
}