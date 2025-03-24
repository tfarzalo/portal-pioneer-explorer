
export type JobPhase = 
  | 'Job Request'
  | 'Work Order'
  | 'Pending Work Order'
  | 'Grading'
  | 'Invoicing'
  | 'Completed'
  | 'Cancelled';

// Color system for job phases
export const JOB_PHASE_COLORS = {
  'Job Request': {
    bg: '#3a82f7',
    bgOpacity: 'bg-[#3a82f7]/10',
    border: 'border-[#3a82f7]',
    text: 'text-[#3a82f7]'
  },
  'Work Order': {
    bg: '#ed8a32',
    bgOpacity: 'bg-[#ed8a32]/10',
    border: 'border-[#ed8a32]',
    text: 'text-[#ed8a32]'
  },
  'Pending Work Order': {
    bg: '#edb520',
    bgOpacity: 'bg-[#edb520]/10',
    border: 'border-[#edb520]',
    text: 'text-[#edb520]'
  },
  'Grading': {
    bg: '#b26ff2',
    bgOpacity: 'bg-[#b26ff2]/10',
    border: 'border-[#b26ff2]',
    text: 'text-[#b26ff2]'
  },
  'Invoicing': {
    bg: '#36c199',
    bgOpacity: 'bg-[#36c199]/10',
    border: 'border-[#36c199]',
    text: 'text-[#36c199]'
  },
  'Completed': {
    bg: '#974b1c',
    bgOpacity: 'bg-[#974b1c]/10',
    border: 'border-[#974b1c]',
    text: 'text-[#974b1c]'
  },
  'Cancelled': {
    bg: '#d3d3d3',
    bgOpacity: 'bg-[#d3d3d3]/10',
    border: 'border-[#d3d3d3]',
    text: 'text-[#d3d3d3]'
  }
} as const;

// Define WorkOrderFormData interface for form submissions
export interface WorkOrderFormData {
  property: string;
  propertyId: string;
  unit?: string;
  type: string;
  description: string;
  scheduledDate: string;
  assignedTo?: string;
  
  // Additional fields used in WorkOrderForm component
  preparedBy?: string;
  unitSize?: string;
  isOccupied?: boolean;
  isFullPaint?: boolean;
  
  // Sprinkler related fields
  hasSprinklers?: boolean;
  sprinklersHaveOldPaint?: boolean;
  hasSprinklerCovers?: boolean;
  
  // Paint details
  paintItems?: Record<string, boolean>;
  ceilingSpotting?: string;
  wallNotes?: string;
  
  // Accent wall details
  hasAccentWall?: boolean;
  accentWallCount?: number;
  isCustomColor?: boolean;
  
  // Prep work details
  prepWorkHours?: number;
  prepWorkDescription?: string;
  extraCharges?: Array<{
    type: string;
    location: string;
    description?: string;
    amount?: number;
  }>;
  
  // Billing details
  billAmount?: number;
  subPayAmount?: number;
  profitAmount?: number;
  
  // Base payment details
  baseAmount?: number;
  totalAmount?: number;
  
  paintDetails?: {
    type: string;
    walls: string;
    trim: string;
    ceilings: string;
  };
}
