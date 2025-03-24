import React from 'react';
import { FileText, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { WorkOrderForm } from '../components/WorkOrderForm';
import type { WorkOrderFormData } from '../types/workOrder';

interface NewWorkOrderProps {
  theme: 'dark' | 'light';
}

export function NewWorkOrder({ theme }: NewWorkOrderProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';

  const handleSubmit = (data: WorkOrderFormData) => {
    // Handle form submission
    console.log('Form submitted:', data);
    // Navigate back to job details
    navigate(`/jobs/${id}`);
  };

  const handleCancel = () => {
    navigate(`/jobs/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className={textColor} size={28} />
          <h1 className={`text-2xl font-bold ${textColor}`}>New Work Order</h1>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
        >
          <ArrowLeft size={20} />
          <span>Go Back</span>
        </button>
      </div>

      <WorkOrderForm
        theme={theme}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}