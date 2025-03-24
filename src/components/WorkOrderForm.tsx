import React, { useState, useEffect } from 'react';
import { 
  Camera,
  Plus,
  Minus,
  AlertCircle,
  Lock
} from 'lucide-react';
import type { WorkOrderFormData } from '../types/workOrder';

interface WorkOrderFormProps {
  theme: 'dark' | 'light';
  initialData?: Partial<WorkOrderFormData>;
  propertyId: string;
  userRole?: 'admin' | 'jg_management' | 'subcontractor';
  onSubmit: (data: WorkOrderFormData) => void;
  onCancel: () => void;
}

interface BillingRates {
  regular: Record<string, { bill: number; sub: number; profit: number }>;
  ceiling: Record<string, { bill: number; sub: number; profit: number }>;
  extras: Record<string, { bill: number; sub: number; profit: number }>;
}

export function WorkOrderForm({ 
  theme, 
  initialData, 
  propertyId,
  userRole = 'subcontractor',
  onSubmit, 
  onCancel 
}: WorkOrderFormProps) {
  const [formData, setFormData] = useState<Partial<WorkOrderFormData>>(initialData || {});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [billingRates, setBillingRates] = useState<BillingRates>({
    regular: {
      '2 Bedroom': { bill: 250, sub: 185, profit: 105 },
      '3 Bedroom': { bill: 325, sub: 200, profit: 125 }
    },
    ceiling: {
      '2 Bedroom': { bill: 175, sub: 150, profit: 75 },
      '3 Bedroom': { bill: 195, sub: 120, profit: 75 }
    },
    extras: {
      'Prep Work': { bill: 45, sub: 25, profit: 20 },
      'Paint Over Accent Wall': { bill: 85, sub: 40, profit: 45 }
    }
  });

  const isManagement = userRole === 'admin' || userRole === 'jg_management';

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';

  useEffect(() => {
    // In a real app, fetch billing rates based on propertyId
    // For now, using mock data set in state initialization
  }, [propertyId]);

  useEffect(() => {
    // Auto-calculate billing amounts based on unit size and extras
    if (formData.unitSize) {
      const baseRates = billingRates.regular[formData.unitSize];
      let totalBill = baseRates?.bill || 0;
      let totalSub = baseRates?.sub || 0;

      // Add ceiling paint if selected
      if (formData.paintItems?.ceilings) {
        const ceilingRates = billingRates.ceiling[formData.unitSize];
        totalBill += ceilingRates?.bill || 0;
        totalSub += ceilingRates?.sub || 0;
      }

      // Add accent wall charges
      if (formData.hasAccentWall && formData.accentWallCount) {
        const accentWallRates = billingRates.extras['Paint Over Accent Wall'];
        totalBill += (accentWallRates?.bill || 0) * formData.accentWallCount;
        totalSub += (accentWallRates?.sub || 0) * formData.accentWallCount;
      }

      // Add prep work charges
      if (formData.prepWorkHours) {
        const prepWorkRates = billingRates.extras['Prep Work'];
        totalBill += (prepWorkRates?.bill || 0) * formData.prepWorkHours;
        totalSub += (prepWorkRates?.sub || 0) * formData.prepWorkHours;
      }

      // Update form data with calculated amounts
      setFormData(prev => ({
        ...prev,
        billAmount: totalBill,
        subPayAmount: totalSub,
        profitAmount: totalBill - totalSub
      }));
    }
  }, [
    formData.unitSize,
    formData.paintItems?.ceilings,
    formData.hasAccentWall,
    formData.accentWallCount,
    formData.prepWorkHours,
    billingRates
  ]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    const requiredFields = [
      'preparedBy',
      'unit',
      'unitSize'
    ];

    requiredFields.forEach(field => {
      if (!formData[field as keyof WorkOrderFormData]) {
        newErrors[field] = 'This field is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData as WorkOrderFormData);
    }
  };

  const handleInputChange = (field: keyof WorkOrderFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when field is modified
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General Information */}
      <div className={`${cardBg} p-6 rounded-lg border ${borderColor}`}>
        <h2 className={`text-lg font-semibold ${textColor} mb-4`}>General Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${textColor}`}>
              Work Order Prepared By
            </label>
            <input
              type="text"
              value={formData.preparedBy || ''}
              onChange={(e) => handleInputChange('preparedBy', e.target.value)}
              className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
              placeholder="Enter name"
            />
            {errors.preparedBy && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {errors.preparedBy}
              </p>
            )}
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${textColor}`}>
              Unit #
            </label>
            <input
              type="text"
              value={formData.unit || ''}
              onChange={(e) => handleInputChange('unit', e.target.value)}
              className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
              placeholder="Enter unit number"
            />
            {errors.unit && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {errors.unit}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Unit Information */}
      <div className={`${cardBg} p-6 rounded-lg border ${borderColor}`}>
        <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Unit Information</h2>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                Unit Size
              </label>
              <select
                value={formData.unitSize || ''}
                onChange={(e) => handleInputChange('unitSize', e.target.value)}
                className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
              >
                <option value="">Select unit size...</option>
                <option value="Studio">Studio</option>
                <option value="1 Bedroom">1 Bedroom</option>
                <option value="2 Bedroom">2 Bedroom</option>
                <option value="3 Bedroom">3 Bedroom</option>
              </select>
              {errors.unitSize && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle size={16} className="mr-1" />
                  {errors.unitSize}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isOccupied || false}
                  onChange={(e) => handleInputChange('isOccupied', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className={`ml-3 text-sm font-medium ${textColor}`}>Unit is Occupied</span>
              </label>
            </div>

            <div className="flex items-center space-x-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFullPaint || false}
                  onChange={(e) => handleInputChange('isFullPaint', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className={`ml-3 text-sm font-medium ${textColor}`}>Full Paint Job</span>
              </label>
            </div>

            <div>
              <h3 className={`text-sm font-medium ${textColor} mb-2`}>Sprinkler Information</h3>
              <div className="space-y-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasSprinklers || false}
                    onChange={(e) => handleInputChange('hasSprinklers', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span className={`ml-3 text-sm font-medium ${textColor}`}>Has Sprinklers</span>
                </label>

                {formData.hasSprinklers && (
                  <div className="ml-6 space-y-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.sprinklersHaveOldPaint || false}
                        onChange={(e) => handleInputChange('sprinklersHaveOldPaint', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      <span className={`ml-3 text-sm font-medium ${textColor}`}>Old Paint on Heads</span>
                    </label>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.hasSprinklerCovers || false}
                        onChange={(e) => handleInputChange('hasSprinklerCovers', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      <span className={`ml-3 text-sm font-medium ${textColor}`}>Has Sprinkler Covers</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Paint Details */}
      <div className={`${cardBg} p-6 rounded-lg border ${borderColor}`}>
        <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Paint Details</h2>
        <div className="space-y-6">
          <div>
            <h3 className={`text-sm font-medium ${textColor} mb-3`}>Items to Paint</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData.paintItems || {}).map(([key, value]) => (
                <label key={key} className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value || false}
                    onChange={(e) => handleInputChange('paintItems', {
                      ...formData.paintItems,
                      [key]: e.target.checked
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span className={`ml-3 text-sm font-medium ${textColor}`}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${textColor}`}>
              Ceiling Notes
            </label>
            <textarea
              value={formData.ceilingSpotting || ''}
              onChange={(e) => handleInputChange('ceilingSpotting', e.target.value)}
              className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor} min-h-[100px]`}
              placeholder="Enter ceiling notes..."
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${textColor}`}>
              Wall Notes
            </label>
            <textarea
              value={formData.wallNotes || ''}
              onChange={(e) => handleInputChange('wallNotes', e.target.value)}
              className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor} min-h-[100px]`}
              placeholder="Enter wall notes..."
            />
          </div>

          <div>
            <div className="flex items-center space-x-4 mb-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasAccentWall || false}
                  onChange={(e) => handleInputChange('hasAccentWall', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className={`ml-3 text-sm font-medium ${textColor}`}>Has Accent Wall</span>
              </label>
            </div>

            {formData.hasAccentWall && (
              <div className="ml-6 space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                    Number of Accent Walls
                  </label>
                  <input
                    type="number"
                    value={formData.accentWallCount || 0}
                    onChange={(e) => handleInputChange('accentWallCount', parseInt(e.target.value))}
                    min="1"
                    max="4"
                    className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                  />
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isCustomColor || false}
                    onChange={(e) => handleInputChange('isCustomColor', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span className={`ml-3 text-sm font-medium ${textColor}`}>Custom Color</span>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Prep Work */}
      <div className={`${cardBg} p-6 rounded-lg border ${borderColor}`}>
        <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Prep Work</h2>
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-sm font-medium ${textColor}`}>Extra Charges</h3>
              <button
                type="button"
                onClick={() => handleInputChange('extraCharges', [
                  ...(formData.extraCharges || []),
                  { type: '', location: '' }
                ])}
                className="flex items-center space-x-2 text-blue-500 hover:text-blue-600"
              >
                <Plus size={16} />
                <span>Add Charge</span>
              </button>
            </div>
            <div className="space-y-4">
              {(formData.extraCharges || []).map((charge, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={charge.type}
                      onChange={(e) => {
                        const newCharges = [...(formData.extraCharges || [])];
                        newCharges[index].type = e.target.value;
                        handleInputChange('extraCharges', newCharges);
                      }}
                      placeholder="Type of charge"
                      className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                    />
                    <input
                      type="text"
                      value={charge.location}
                      onChange={(e) => {
                        const newCharges = [...(formData.extraCharges || [])];
                        newCharges[index].location = e.target.value;
                        handleInputChange('extraCharges', newCharges);
                      }}
                      placeholder="Location"
                      className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newCharges = [...(formData.extraCharges || [])];
                      newCharges.splice(index, 1);
                      handleInputChange('extraCharges', newCharges);
                    }}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Minus size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${textColor}`}>
              Prep Work Hours
            </label>
            <input
              type="number"
              value={formData.prepWorkHours || 0}
              onChange={(e) => handleInputChange('prepWorkHours', parseInt(e.target.value))}
              min="0"
              step="0.5"
              className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${textColor}`}>
              Description
            </label>
            <textarea
              value={formData.prepWorkDescription || ''}
              onChange={(e) => handleInputChange('prepWorkDescription', e.target.value)}
              className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor} min-h-[100px]`}
              placeholder="Describe the prep work needed..."
            />
          </div>
        </div>
      </div>

      {/* Photos */}
      <div className={`${cardBg} p-6 rounded-lg border ${borderColor}`}>
        <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Photos</h2>
        <div>
          <h3 className={`text-sm font-medium ${textColor} mb-3`}>Before Photos</h3>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-800/50">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Camera size={48} className={mutedTextColor} />
                <p className={`mb-2 text-sm ${textColor}`}>
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className={`text-xs ${mutedTextColor}`}>PNG, JPG or JPEG</p>
              </div>
              <input type="file" className="hidden" multiple accept="image/*" />
            </label>
          </div>
        </div>
      </div>

      {/* Billing - Only visible to admin/JG Management */}
      {isManagement ? (
        <div className={`${cardBg} p-6 rounded-lg border ${borderColor}`}>
          <div className="flex items-center space-x-2 mb-4">
            <Lock size={20} className="text-yellow-500" />
            <h2 className={`text-lg font-semibold ${textColor}`}>Billing (JG Management Only)</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                Bill Amount
              </label>
              <div className="relative">
                <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${mutedTextColor}`}>$</span>
                <input
                  type="number"
                  value={formData.billAmount || ''}
                  disabled
                  className={`w-full pl-8 p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor} bg-gray-800`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                Sub Pay Amount
              </label>
              <div className="relative">
                <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${mutedTextColor}`}>$</span>
                <input
                  type="number"
                  value={formData.subPayAmount || ''}
                  disabled
                  className={`w-full pl-8 p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor} bg-gray-800`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                Profit Amount
              </label>
              <div className="relative">
                <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${mutedTextColor}`}>$</span>
                <input
                  type="number"
                  value={formData.profitAmount || ''}
                  disabled
                  className={`w-full pl-8 p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor} bg-gray-800`}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Submit Work Order
        </button>
      </div>
    </form>
  );
}