import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Clock,
  Building2,
  ChevronDown,
  Users,
  Mail,
  CheckCircle,
  DollarSign,
  AlertCircle,
  Save,
  Edit,
  Loader2
} from 'lucide-react';
import { ExtraChargesModal } from '../components/ExtraChargesModal';
import { WorkOrderForm } from '../components/WorkOrderForm';
import type { JobPhase } from '../types/workOrder';
import { JOB_PHASE_COLORS } from '../types/workOrder';

interface JobDetailsProps {
  theme: 'dark' | 'light';
}

export function JobDetails({ theme }: JobDetailsProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showPhaseDropdown, setShowPhaseDropdown] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [showExtraChargesModal, setShowExtraChargesModal] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
  const sectionBg = theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50';

  // Mock data with extra charges
  const [job, setJob] = useState({
    id,
    workOrderNumber: 'WO#46',
    property: 'La Vie SouthPark',
    propertyId: '1',
    unit: '122',
    type: 'Paint',
    phase: 'Work Order' as JobPhase,
    scheduledDate: '2024-03-20',
    submittedBy: 'John Doe',
    submittedDate: '2024-03-19',
    description: 'Unit requires full paint job with additional repairs.',
    location: {
      address: '6000 Fairview Rd',
      city: 'Charlotte',
      state: 'NC',
      zip: '28210'
    },
    assignedTo: 'Sarah Johnson',
    paintDetails: {
      type: 'Full Paint',
      walls: 'SW7029 Agreeable Gray',
      trim: 'SW7006 Extra White',
      ceilings: 'Flat White'
    },
    extraCharges: [
      {
        type: 'Drywall Repair',
        location: 'Living Room',
        description: 'Large hole repair required',
        amount: 175.00
      },
      {
        type: 'Additional Prep Work',
        location: 'All Rooms',
        description: 'Heavy wall texturing requiring extra preparation',
        amount: 250.00
      }
    ],
    baseAmount: 450.00,
    totalAmount: 875.00
  });

  // Check for extra charges and update phase automatically
  useEffect(() => {
    if (job.extraCharges?.length > 0 && job.phase === 'Work Order') {
      setJob(prev => ({ ...prev, phase: 'Pending Work Order' }));
    }
  }, [job.extraCharges]);

  // Mock data for extra charges notification
  const hasExtraCharges = job.extraCharges && job.extraCharges.length > 0;
  const showExtraCharges = hasExtraCharges && job.phase === 'Pending Work Order';
  const recipientEmail = 'accounting@laviesouthpark.com';

  const phases: JobPhase[] = [
    'Job Request',
    'Work Order',
    'Pending Work Order',
    'Grading',
    'Invoicing',
    'Completed',
    'Cancelled'
  ];

  const handlePhaseChange = (newPhase: JobPhase) => {
    setJob(prev => ({ ...prev, phase: newPhase }));
    setShowPhaseDropdown(false);
    setHasUnsavedChanges(true);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJob(prev => ({ ...prev, scheduledDate: e.target.value }));
    setHasUnsavedChanges(true);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      // Save changes to the server
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API call
      setHasUnsavedChanges(false);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving changes:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEmailSend = (data: {
    template: string;
    selectedFields: string[];
    recipientEmail: string;
    emailBody: string;
  }) => {
    console.log('Sending email:', data);
    setTimeout(() => {
      setShowExtraChargesModal(false);
      setEmailSent(true);
    }, 1000);
  };

  const handleWorkOrderSubmit = (data: any) => {
    setJob(prev => ({
      ...prev,
      ...data,
      phase: data.extraCharges?.length > 0 ? 'Pending Work Order' : 'Work Order'
    }));
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className={textColor} size={28} />
          <div>
            <h1 className={`text-2xl font-bold ${textColor}`}>
              {job.workOrderNumber}
            </h1>
            <p className={mutedTextColor}>{job.property} - Unit {job.unit}</p>
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <ArrowLeft size={20} />
            <span>Go Back</span>
          </button>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Edit size={20} />
              <span>Edit Job</span>
            </button>
          ) : (
            <button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              {isSaving ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <WorkOrderForm
          theme={theme}
          initialData={job}
          propertyId={job.propertyId}
          onSubmit={handleWorkOrderSubmit}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`${cardBg} p-6 rounded-lg border ${borderColor}`}>
              <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Location</h2>
              <div className="h-[300px] w-full rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(
                    `${job.location.address}, ${job.location.city}, ${job.location.state} ${job.location.zip}`
                  )}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            <div className={`${cardBg} p-6 rounded-lg border ${borderColor}`}>
              <div className="space-y-6">
                <div>
                  <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Job Phase</h2>
                  <div className="relative">
                    <button
                      onClick={() => setShowPhaseDropdown(!showPhaseDropdown)}
                      className={`w-full px-4 py-3 rounded-lg flex items-center justify-between ${
                        JOB_PHASE_COLORS[job.phase].bgOpacity
                      } ${JOB_PHASE_COLORS[job.phase].text}`}
                    >
                      <span className="text-lg font-medium">{job.phase}</span>
                      <ChevronDown size={20} />
                    </button>
                    {showPhaseDropdown && (
                      <div className={`absolute left-0 right-0 mt-2 ${cardBg} rounded-lg shadow-lg border ${borderColor} z-10`}>
                        {phases.map((phase) => (
                          <button
                            key={phase}
                            onClick={() => handlePhaseChange(phase)}
                            className={`w-full px-4 py-3 text-left first:rounded-t-lg last:rounded-b-lg ${
                              phase === job.phase
                                ? `${JOB_PHASE_COLORS[phase].bgOpacity} ${JOB_PHASE_COLORS[phase].text}`
                                : `hover:${JOB_PHASE_COLORS[phase].bgOpacity} ${textColor}`
                            }`}
                          >
                            {phase}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Schedule Date</h2>
                  {isEditingDate ? (
                    <input
                      type="date"
                      value={job.scheduledDate}
                      onChange={handleDateChange}
                      onBlur={() => setIsEditingDate(false)}
                      className={`w-full px-4 py-3 rounded-lg border ${cardBg} ${borderColor} ${textColor}`}
                      autoFocus
                    />
                  ) : (
                    <button
                      onClick={() => setIsEditingDate(true)}
                      className={`w-full px-4 py-3 rounded-lg flex items-center justify-between ${cardBg} border ${borderColor} ${textColor} hover:border-blue-500`}
                    >
                      <span className="text-lg">{new Date(job.scheduledDate).toLocaleDateString()}</span>
                      <Calendar size={20} />
                    </button>
                  )}
                </div>

                {hasUnsavedChanges && (
                  <button
                    onClick={handleSaveChanges}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Save size={20} />
                    <span>Save Changes</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`${cardBg} p-6 rounded-lg border ${borderColor}`}>
              <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Job Information</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Building2 className={mutedTextColor} size={20} />
                  <div>
                    <div className={`font-medium ${textColor}`}>Property</div>
                    <button
                      onClick={() => navigate(`/properties/${job.propertyId}`)}
                      className={`${textColor} hover:opacity-80`}
                    >
                      {job.property}
                    </button>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className={mutedTextColor} size={20} />
                  <div>
                    <div className={`font-medium ${textColor}`}>Location</div>
                    <div className={mutedTextColor}>{job.location.address}</div>
                    <div className={mutedTextColor}>
                      {job.location.city}, {job.location.state} {job.location.zip}
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className={mutedTextColor} size={20} />
                  <div>
                    <div className={`font-medium ${textColor}`}>Assigned To</div>
                    <div className={mutedTextColor}>{job.assignedTo}</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <User className={mutedTextColor} size={20} />
                  <div>
                    <div className={`font-medium ${textColor}`}>Submitted By</div>
                    <div className={mutedTextColor}>{job.submittedBy}</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className={mutedTextColor} size={20} />
                  <div>
                    <div className={`font-medium ${textColor}`}>Submission Date</div>
                    <div className={mutedTextColor}>{job.submittedDate}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${cardBg} p-6 rounded-lg border ${borderColor}`}>
              <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Paint Details</h2>
              <div className="space-y-4">
                <div>
                  <div className={`font-medium ${textColor}`}>Paint Type</div>
                  <div className={mutedTextColor}>{job.paintDetails.type}</div>
                </div>
                <div>
                  <div className={`font-medium ${textColor}`}>Wall Color</div>
                  <div className={mutedTextColor}>{job.paintDetails.walls}</div>
                </div>
                <div>
                  <div className={`font-medium ${textColor}`}>Trim Color</div>
                  <div className={mutedTextColor}>{job.paintDetails.trim}</div>
                </div>
                <div>
                  <div className={`font-medium ${textColor}`}>Ceiling Color</div>
                  <div className={mutedTextColor}>{job.paintDetails.ceilings}</div>
                </div>
              </div>
            </div>
          </div>

          {showExtraCharges && (
            <div className={`${cardBg} p-6 rounded-lg border ${borderColor}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="text-yellow-500" size={24} />
                  <h2 className={`text-lg font-semibold ${textColor}`}>Extra Charges</h2>
                </div>
                {!emailSent && (
                  <button
                    onClick={() => setShowExtraChargesModal(true)}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2"
                  >
                    <Mail size={20} />
                    <span>Send Extra Charges Email</span>
                  </button>
                )}
                {emailSent && (
                  <div className="flex items-center space-x-2 text-green-500">
                    <CheckCircle size={20} />
                    <span>Email Sent</span>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className={`${sectionBg} rounded-lg overflow-hidden`}>
                  <table className="w-full">
                    <thead>
                      <tr className={theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}>
                        <th className={`px-4 py-2 text-left text-sm font-medium ${textColor}`}>Type</th>
                        <th className={`px-4 py-2 text-left text-sm font-medium ${textColor}`}>Location</th>
                        <th className={`px-4 py-2 text-left text-sm font-medium ${textColor}`}>Description</th>
                        <th className={`px-4 py-2 text-right text-sm font-medium ${textColor}`}>Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {job.extraCharges.map((charge, index) => (
                        <tr key={index}>
                          <td className={`px-4 py-2 ${textColor}`}>{charge.type}</td>
                          <td className={`px-4 py-2 ${textColor}`}>{charge.location}</td>
                          <td className={`px-4 py-2 ${textColor}`}>{charge.description}</td>
                          <td className={`px-4 py-2 text-right ${textColor}`}>${charge.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between">
                      <span className={mutedTextColor}>Base Amount:</span>
                      <span className={textColor}>${job.baseAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={mutedTextColor}>Extra Charges:</span>
                      <span className={textColor}>
                        ${job.extraCharges.reduce((sum, charge) => sum + charge.amount, 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-700">
                      <span className={`font-medium ${textColor}`}>Total Amount:</span>
                      <span className={`font-medium ${textColor}`}>${job.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <ExtraChargesModal
            theme={theme}
            isOpen={showExtraChargesModal}
            onClose={() => setShowExtraChargesModal(false)}
            onSend={handleEmailSend}
            workOrderData={job}
            recipientEmail={recipientEmail}
          />
        </>
      )}
    </div>
  );
}