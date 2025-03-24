import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  ArrowLeft,
  MapPin,
  Plus,
  Trash2,
  Loader2,
  DollarSign
} from 'lucide-react';

interface BillingRate {
  bill: number;
  sub: number;
  profit: number;
}

interface BillingRates {
  [key: string]: {
    [key: string]: BillingRate;
  };
}

interface EditPropertyProps {
  theme: 'dark' | 'light';
}

export function EditProperty({ theme }: EditPropertyProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
  const sectionBg = theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50';

  const [formData, setFormData] = useState({
    name: '511 Queens',
    address: '511 Queens Road',
    city: 'Charlotte',
    state: 'NC',
    zip: '28207',
    region: 'Region',
    managementCompany: 'RKW Residential',
    contact: {
      name: 'John Smith',
      role: 'Maintenance Supervisor',
      phone: '(555) 123-4567',
      email: 'john.smith@example.com'
    },
    paintDetails: {
      locations: ['Regular Apartments', 'Common Areas', 'Exterior'],
      selections: {
        walls: 'SW7029 Agreeable Gray',
        trim: 'SW7006 Extra White',
        doors: 'SW7006 Extra White',
        ceilings: 'Flat White'
      }
    },
    billingRates: {
      'Regular Paint': {
        'Studio': { bill: 200, sub: 150, profit: 50 },
        '1 Bedroom': { bill: 225, sub: 165, profit: 60 },
        '2 Bedroom': { bill: 250, sub: 185, profit: 65 },
        '3 Bedroom': { bill: 325, sub: 200, profit: 125 }
      },
      'Ceiling Paint': {
        'Studio': { bill: 150, sub: 100, profit: 50 },
        '1 Bedroom': { bill: 165, sub: 115, profit: 50 },
        '2 Bedroom': { bill: 175, sub: 150, profit: 75 },
        '3 Bedroom': { bill: 195, sub: 120, profit: 75 }
      },
      'Extra Charges': {
        'Prep Work': { bill: 45, sub: 25, profit: 20 },
        'Paint Over Accent Wall': { bill: 85, sub: 40, profit: 45 }
      }
    } as BillingRates
  });

  const [newBillingType, setNewBillingType] = useState('');
  const [newUnitType, setNewUnitType] = useState('');
  const [showNewBillingTypeForm, setShowNewBillingTypeForm] = useState(false);
  const [showNewUnitTypeForm, setShowNewUnitTypeForm] = useState(false);
  const [selectedBillingType, setSelectedBillingType] = useState<string | null>(null);

  useEffect(() => {
    // Fetch property data using id
    // For now using mock data set in initial state
  }, [id]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev };
      const fields = field.split('.');
      let current: any = newData;
      
      for (let i = 0; i < fields.length - 1; i++) {
        current = current[fields[i]];
      }
      
      current[fields[fields.length - 1]] = value;
      return newData;
    });
  };

  const handleBillingRateChange = (
    billingType: string,
    unitType: string,
    field: keyof BillingRate,
    value: string
  ) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => {
      const newData = { ...prev };
      const currentRate = newData.billingRates[billingType][unitType];
      
      if (field === 'bill') {
        const subDiff = currentRate.bill - currentRate.sub;
        newData.billingRates[billingType][unitType] = {
          bill: numValue,
          sub: numValue - subDiff,
          profit: subDiff
        };
      } else if (field === 'sub') {
        newData.billingRates[billingType][unitType] = {
          ...currentRate,
          sub: numValue,
          profit: currentRate.bill - numValue
        };
      }
      
      return newData;
    });
  };

  const handleAddBillingType = () => {
    if (newBillingType.trim()) {
      setFormData(prev => ({
        ...prev,
        billingRates: {
          ...prev.billingRates,
          [newBillingType]: {}
        }
      }));
      setNewBillingType('');
      setShowNewBillingTypeForm(false);
      setSelectedBillingType(newBillingType);
    }
  };

  const handleAddUnitType = (billingType: string) => {
    if (newUnitType.trim()) {
      setFormData(prev => ({
        ...prev,
        billingRates: {
          ...prev.billingRates,
          [billingType]: {
            ...prev.billingRates[billingType],
            [newUnitType]: { bill: 0, sub: 0, profit: 0 }
          }
        }
      }));
      setNewUnitType('');
      setShowNewUnitTypeForm(false);
    }
  };

  const handleDeleteBillingType = (billingType: string) => {
    if (window.confirm(`Are you sure you want to delete ${billingType} and all its rates?`)) {
      setFormData(prev => {
        const newData = { ...prev };
        delete newData.billingRates[billingType];
        return newData;
      });
      setSelectedBillingType(null);
    }
  };

  const handleDeleteUnitType = (billingType: string, unitType: string) => {
    if (window.confirm(`Are you sure you want to delete ${unitType} from ${billingType}?`)) {
      setFormData(prev => {
        const newData = { ...prev };
        delete newData.billingRates[billingType][unitType];
        return newData;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Save property data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API call
      navigate(`/properties/${id}`);
    } catch (error) {
      console.error('Error saving property:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Building2 className={textColor} size={28} />
          <div>
            <h1 className={`text-2xl font-bold ${textColor}`}>Edit Property</h1>
            <p className={mutedTextColor}>{formData.name}</p>
          </div>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
        >
          <ArrowLeft size={20} />
          <span>Go Back</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`${cardBg} p-6 rounded-lg border ${borderColor}`}>
            <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Property Information</h2>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${textColor}`}>Property Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                  <MapPin size={16} className="inline mr-2" />
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${textColor}`}>City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${textColor}`}>State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${textColor}`}>ZIP Code</label>
                  <input
                    type="text"
                    value={formData.zip}
                    onChange={(e) => handleInputChange('zip', e.target.value)}
                    className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                    required
                  />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${textColor}`}>Management Company</label>
                <input
                  type="text"
                  value={formData.managementCompany}
                  onChange={(e) => handleInputChange('managementCompany', e.target.value)}
                  className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                  required
                />
              </div>
            </div>
          </div>

          <div className={`${cardBg} p-6 rounded-lg border ${borderColor}`}>
            <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Location Map</h2>
            <div className="aspect-video w-full bg-gray-800 rounded-lg flex items-center justify-center">
              <div className={`text-center ${mutedTextColor}`}>
                <p className="mb-2">No property map available</p>
                <button 
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
                >
                  <Plus size={20} />
                  <span>Upload Map</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={`${cardBg} p-6 rounded-lg border ${borderColor}`}>
          <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>Contact Name</label>
              <input
                type="text"
                value={formData.contact.name}
                onChange={(e) => handleInputChange('contact.name', e.target.value)}
                className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>Role</label>
              <input
                type="text"
                value={formData.contact.role}
                onChange={(e) => handleInputChange('contact.role', e.target.value)}
                className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>Phone</label>
              <input
                type="tel"
                value={formData.contact.phone}
                onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>Email</label>
              <input
                type="email"
                value={formData.contact.email}
                onChange={(e) => handleInputChange('contact.email', e.target.value)}
                className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                required
              />
            </div>
          </div>
        </div>

        <div className={`${cardBg} p-6 rounded-lg border ${borderColor}`}>
          <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Paint Details</h2>
          <div className="space-y-6">
            <div>
              <h3 className={`text-sm font-medium ${textColor} mb-3`}>Paint Locations</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.paintDetails.locations.map((location, index) => (
                  <div
                    key={index}
                    className={`${sectionBg} px-3 py-1 rounded-full flex items-center space-x-2`}
                  >
                    <span className={textColor}>{location}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newLocations = formData.paintDetails.locations.filter((_, i) => i !== index);
                        handleInputChange('paintDetails.locations', newLocations);
                      }}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newLocations = [...formData.paintDetails.locations, 'New Location'];
                    handleInputChange('paintDetails.locations', newLocations);
                  }}
                  className="flex items-center space-x-2 text-blue-500 hover:text-blue-600"
                >
                  <Plus size={20} />
                  <span>Add Location</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                  Wall Paint
                </label>
                <input
                  type="text"
                  value={formData.paintDetails.selections.walls}
                  onChange={(e) => handleInputChange('paintDetails.selections.walls', e.target.value)}
                  className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                  placeholder="Enter wall paint selection"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                  Trim Paint
                </label>
                <input
                  type="text"
                  value={formData.paintDetails.selections.trim}
                  onChange={(e) => handleInputChange('paintDetails.selections.trim', e.target.value)}
                  className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                  placeholder="Enter trim paint selection"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                  Door Paint
                </label>
                <input
                  type="text"
                  value={formData.paintDetails.selections.doors}
                  onChange={(e) => handleInputChange('paintDetails.selections.doors', e.target.value)}
                  className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                  placeholder="Enter door paint selection"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                  Ceiling Paint
                </label>
                <input
                  type="text"
                  value={formData.paintDetails.selections.ceilings}
                  onChange={(e) => handleInputChange('paintDetails.selections.ceilings', e.target.value)}
                  className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                  placeholder="Enter ceiling paint selection"
                />
              </div>
            </div>
          </div>
        </div>

        <div className={`${cardBg} p-6 rounded-lg border ${borderColor}`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-lg font-semibold ${textColor}`}>
              <DollarSign className="inline-block mr-2" size={24} />
              Billing Rates
            </h2>
            <button
              type="button"
              onClick={() => setShowNewBillingTypeForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add Billing Type</span>
            </button>
          </div>

          {showNewBillingTypeForm && (
            <div className={`${sectionBg} p-4 rounded-lg mb-4`}>
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={newBillingType}
                  onChange={(e) => setNewBillingType(e.target.value)}
                  placeholder="Enter billing type name"
                  className={`flex-1 p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                />
                <button
                  type="button"
                  onClick={handleAddBillingType}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewBillingTypeForm(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 gap-4">
            <div className={`${sectionBg} p-4 rounded-lg`}>
              <h3 className={`text-sm font-medium ${textColor} mb-4`}>Billing Types</h3>
              <div className="space-y-2">
                {Object.keys(formData.billingRates).map((billingType) => (
                  <button
                    key={billingType}
                    type="button"
                    onClick={() => setSelectedBillingType(billingType)}
                    className={`w-full p-2 rounded-lg text-left transition-colors ${
                      selectedBillingType === billingType
                        ? 'bg-blue-600 text-white'
                        : `${cardBg} ${textColor} hover:bg-gray-700`
                    }`}
                  >
                    {billingType}
                  </button>
                ))}
              </div>
            </div>

            <div className="col-span-3">
              {selectedBillingType ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-lg font-medium ${textColor}`}>
                      {selectedBillingType} Rates
                    </h3>
                    <div className="space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowNewUnitTypeForm(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add Unit Type
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBillingType(selectedBillingType)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Delete Billing Type
                      </button>
                    </div>
                  </div>

                  {showNewUnitTypeForm && (
                    <div className={`${sectionBg} p-4 rounded-lg`}>
                      <div className="flex items-center space-x-4">
                        <input
                          type="text"
                          value={newUnitType}
                          onChange={(e) => setNewUnitType(e.target.value)}
                          placeholder="Enter unit type"
                          className={`flex-1 p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                        />
                        <button
                          type="button"
                          onClick={() => handleAddUnitType(selectedBillingType)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowNewUnitTypeForm(false)}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  <div className={`${sectionBg} rounded-lg overflow-hidden`}>
                    <table className="w-full">
                      <thead>
                        <tr className={theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}>
                          <th className={`px-4 py-2 text-left text-sm ${textColor}`}>Unit Type</th>
                          <th className={`px-4 py-2 text-left text-sm ${textColor}`}>Bill Amount</th>
                          <th className={`px-4 py-2 text-left text-sm ${textColor}`}>Sub Pay</th>
                          <th className={`px-4 py-2 text-left text-sm ${textColor}`}>Profit</th>
                          <th className={`px-4 py-2 text-left text-sm ${textColor}`}>Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {Object.entries(formData.billingRates[selectedBillingType]).map(([unitType, rates]) => (
                          <tr key={unitType}>
                            <td className={`px-4 py-2 ${textColor}`}>{unitType}</td>
                            <td className={`px-4 py-2`}>
                              <div className="relative">
                                <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${mutedTextColor}`}>$</span>
                                <input
                                  type="number"
                                  value={rates.bill}
                                  onChange={(e) => handleBillingRateChange(selectedBillingType, unitType, 'bill', e.target.value)}
                                  className={`w-full pl-8 p-2 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                                />
                              </div>
                            </td>
                            <td className={`px-4 py-2`}>
                              <div className="relative">
                                <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${mutedTextColor}`}>$</span>
                                <input
                                  type="number"
                                  value={rates.sub}
                                  onChange={(e) => handleBillingRateChange(selectedBillingType, unitType, 'sub', e.target.value)}
                                  className={`w-full pl-8 p-2 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                                />
                              </div>
                            </td>
                            <td className={`px-4 py-2`}>
                              <div className="relative">
                                <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${mutedTextColor}`}>$</span>
                                <input
                                  type="number"
                                  value={rates.profit}
                                  disabled
                                  className={`w-full pl-8 p-2 rounded-lg border ${inputBg} ${borderColor} ${textColor} bg-gray-800`}
                                />
                              </div>
                            </td>
                            <td className={`px-4 py-2`}>
                              <button
                                type="button"
                                onClick={() => handleDeleteUnitType(selectedBillingType, unitType)}
                                className="text-red-500 hover:text-red-600"
                              >
                                <Trash2 size={20} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className={`h-full flex items-center justify-center ${mutedTextColor}`}>
                  Select a billing type to view and edit rates
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            {isSaving ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}