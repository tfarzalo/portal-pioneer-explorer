
export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  status: 'active' | 'inactive';
  property_management_group?: string;
  community_manager_name?: string;
  community_manager_email?: string;
  community_manager_phone?: string;
  maintenance_supervisor_name?: string;
  maintenance_supervisor_email?: string;
  maintenance_supervisor_phone?: string;
  colors_walls?: string;
  colors_trim_base_doors?: string;
  colors_ceilings?: string;
}

export interface PropertyDetails extends Property {
  billing: {
    regular: Record<string, { bill: number; sub: number; profit: number }>;
    ceiling: Record<string, { bill: number; sub: number; profit: number }>;
    extras: Record<string, { bill: number; sub: number; profit: number }>;
  };
  compliance: {
    status: string;
    approved: boolean;
    approvalDate: string;
    coiAddress: string;
    w9Status: string;
    lastInspection: string;
  };
  paintDetails: {
    locations: string[];
    selections: {
      walls: string;
      trim: string;
      doors: string;
      ceilings: string;
    };
  };
  recentJobs: Array<{
    id: string;
    unit: string;
    type: string;
    status: string;
    date: string;
  }>;
  notes: Array<{
    date: string;
    updateType: string;
    note: string;
    postedBy: string;
  }>;
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
