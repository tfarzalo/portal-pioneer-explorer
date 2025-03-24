import React, { useState } from 'react';
import { FileText, Info, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NewJobRequestProps {
  theme: 'dark' | 'light';
}

interface UnitOption {
  label: string;
  group: string;
}

export function NewJobRequest({ theme }: NewJobRequestProps) {
  const navigate = useNavigate();
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-600' : 'border-gray-300';
  const labelColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-700';
  const noteBg = theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50';
  const noteText = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const cardBorder = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  const properties = [
    { id: 'a', name: 'Property A' },
    { id: 'b', name: 'Property B' },
    { id: 'c', name: 'Property C' }
  ];

  const jobTypes = ['Paint', 'Repair', 'Callback'];

  const unitOptions: { [key: string]: UnitOption[] } = {
    'Standard Units': [
      { label: 'Studio', group: 'Standard Units' },
      { label: '1 Bedroom', group: 'Standard Units' },
      { label: '2 Bedroom', group: 'Standard Units' },
      { label: '3 Bedroom', group: 'Standard Units' },
      { label: '4 Bedroom', group: 'Standard Units' },
      { label: '5 Bedroom', group: 'Standard Units' }
    ],
    'Townhouses': [
      { label: '1 Bedroom | Townhouse', group: 'Townhouses' },
      { label: '2 Bedroom | Townhouse', group: 'Townhouses' },
      { label: '3 Bedroom | Townhouse', group: 'Townhouses' },
      { label: '4 Bedroom | Townhouse', group: 'Townhouses' },
      { label: '5 Bedroom | Townhouse', group: 'Townhouses' }
    ],
    'Lofts': [
      { label: '1 Bedroom | Loft', group: 'Lofts' },
      { label: '2 Bedroom | Loft', group: 'Lofts' },
      { label: '3 Bedroom | Loft', group: 'Lofts' },
      { label: '4 Bedroom | Loft', group: 'Lofts' },
      { label: '5 Bedroom | Loft', group: 'Lofts' }
    ],
    'Special Units': [
      { label: '1 Bedroom | Stairs', group: 'Special Units' },
      { label: '2 Bedroom | Stairs', group: 'Special Units' },
      { label: '3 Bedroom | Stairs', group: 'Special Units' },
      { label: '2 Bedroom | Penthouse', group: 'Special Units' },
      { label: '1 Bedroom | Den', group: 'Special Units' },
      { label: '2 Bedroom | Den', group: 'Special Units' },
      { label: '3 Bedroom | Den', group: 'Special Units' }
    ],
    'Special Jobs': [
      { label: 'Miscellaneous', group: 'Special Jobs' },
      { label: 'Other', group: 'Special Jobs' },
      { label: 'Prep Work / Drywall Repairs', group: 'Special Jobs' },
      { label: 'Paint Individual Ceiling', group: 'Special Jobs' },
      { label: 'Paint Over Accent Wall', group: 'Special Jobs' },
      { label: 'Paint Door (Exterior)', group: 'Special Jobs' },
      { label: 'Crown Molding', group: 'Special Jobs' }
    ]
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className={textColor} size={28} />
          <h1 className={`text-2xl font-bold ${textColor}`}>New Job Request</h1>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
        >
          <ArrowLeft size={20} />
          <span>Go Back</span>
        </button>
      </div>

      <div className={`${noteBg} p-4 rounded-lg flex items-center space-x-2`}>
        <Info size={20} className={noteText} />
        <span className={noteText}>Work Order # will be auto-generated upon submission (Starting from #100001)</span>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Property Selection Card */}
        <div className={`${cardBg} p-6 rounded-lg border ${cardBorder}`}>
          <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Property Information</h2>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${labelColor}`}>
                Select Property
              </label>
              <select
                className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                required
              >
                <option value="">Select a property...</option>
                {properties.map(property => (
                  <option key={property.id} value={property.id}>{property.name}</option>
                ))}
              </select>
              <p className={`mt-1.5 text-xs ${noteText}`}>(Will be populated from database)</p>
            </div>
          </div>
        </div>

        {/* Unit Details Card */}
        <div className={`${cardBg} p-6 rounded-lg border ${cardBorder}`}>
          <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Unit Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${labelColor}`}>
                Unit #
              </label>
              <input
                type="text"
                className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                placeholder="Enter unit number"
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${labelColor}`}>
                Job Type
              </label>
              <select
                className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                required
              >
                <option value="">Select job type...</option>
                {jobTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Unit Size Card */}
        <div className={`${cardBg} p-6 rounded-lg border ${cardBorder}`}>
          <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Unit Configuration</h2>
          <div>
            <label className={`block text-sm font-medium mb-2 ${labelColor}`}>
              Unit Size
            </label>
            <select
              className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
              required
            >
              <option value="">Select unit size...</option>
              {Object.entries(unitOptions).map(([group, options]) => (
                <optgroup key={group} label={group}>
                  {options.map(option => (
                    <option key={option.label} value={option.label}>
                      {option.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        {/* Schedule Card */}
        <div className={`${cardBg} p-6 rounded-lg border ${cardBorder}`}>
          <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Schedule</h2>
          <div>
            <label className={`block text-sm font-medium mb-2 ${labelColor}`}>
              Job Date (All Day Event)
            </label>
            <input
              type="date"
              className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
              required
            />
          </div>
        </div>

        {/* Additional Details Card */}
        <div className={`${cardBg} p-6 rounded-lg border ${cardBorder}`}>
          <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Additional Information</h2>
          <div>
            <label className={`block text-sm font-medium mb-2 ${labelColor}`}>
              Additional Details
            </label>
            <textarea
              className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor} min-h-[120px]`}
              placeholder="Enter any specific instructions or requirements"
            />
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Submit Job Request
          </button>
        </div>
      </form>
    </div>
  );
}