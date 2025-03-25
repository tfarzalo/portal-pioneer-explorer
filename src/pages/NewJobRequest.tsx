import { 
  FileText, 
  ArrowLeft, 
  Building2, 
  Calendar 
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import { formatDateForInput, TIMEZONE } from '../utils/formatters';

interface Property {
  id: string;
  name: string;
  address: string;
}

interface NewJobRequestProps {
  theme: 'dark' | 'light';
}

// Define the job type to match the Supabase enum
type JobType = 'paint' | 'callback' | 'repair';

export function NewJobRequest({ theme }: NewJobRequestProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [formData, setFormData] = useState({
    propertyId: '',
    unitNumber: '',
    scheduledDate: formatDateForInput(new Date().toISOString()), // Default to today
    jobType: '' as JobType, // Type assertion to ensure it's treated as JobType
    specialInstructions: ''
  });
  
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
  const calendarIconColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  
  // Fetch properties from the database
  useEffect(() => {
    async function fetchProperties() {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('id, name, address')
          .order('name');
          
        if (error) throw error;
        setProperties(data || []);
      } catch (error) {
        console.error('Error fetching properties:', error);
        toast.error('Failed to load properties');
      }
    }
    
    fetchProperties();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateJobNumber = async () => {
    try {
      // Get the latest job number to generate a sequential 6-digit number
      const { data, error } = await supabase
        .from('jobs')
        .select('job_number')
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (error) throw error;
      
      let nextNumber = 1; // Default starting number
      
      if (data && data.length > 0 && data[0].job_number) {
        // Try to extract a number from the existing job number
        const currentNumberMatch = data[0].job_number.match(/(\d+)/);
        if (currentNumberMatch) {
          nextNumber = parseInt(currentNumberMatch[0], 10) + 1;
        }
      }
      
      // Format as 6-digit number with leading zeros
      return nextNumber.toString().padStart(6, '0');
    } catch (error) {
      console.error('Error generating job number:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.propertyId || !formData.unitNumber || !formData.scheduledDate || !formData.jobType) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate a job number
      const jobNumber = await generateJobNumber();
      
      // Ensure date is stored as YYYY-MM-DD without time component
      const scheduledDate = formData.scheduledDate;
      
      // Insert the new job
      const { data, error } = await supabase
        .from('jobs')
        .insert({
          job_number: jobNumber,
          property_id: formData.propertyId,
          unit_number: formData.unitNumber,
          scheduled_date: scheduledDate,
          job_type: formData.jobType as JobType,
          description: formData.specialInstructions, // Use description field for special instructions
          phase: 'job_request' // Explicitly set phase to job_request
        })
        .select();
        
      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }
      
      toast.success('Job request submitted successfully');
      
      // Redirect to the job details page
      if (data && data.length > 0) {
        navigate(`/jobs/${data[0].id}`);
      } else {
        // If data is returned but empty, still navigate to jobs list
        navigate('/jobs');
      }
    } catch (error) {
      console.error('Error submitting job request:', error);
      toast.error('Failed to submit job request');
    } finally {
      setIsSubmitting(false);
    }
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

      <div className={`${cardBg} p-6 rounded-lg border ${borderColor}`}>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                <Building2 size={16} className="inline mr-2" />
                Property
              </label>
              <select
                name="propertyId"
                value={formData.propertyId}
                onChange={handleInputChange}
                className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                required
              >
                <option value="">Select a property</option>
                {properties.map(property => (
                  <option key={property.id} value={property.id}>
                    {property.name} - {property.address}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                Unit Number
              </label>
              <input
                type="text"
                name="unitNumber"
                value={formData.unitNumber}
                onChange={handleInputChange}
                placeholder="Enter unit number"
                className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                <Calendar size={16} className={`inline mr-2 ${calendarIconColor}`} />
                Scheduled Work Date (Eastern Time)
              </label>
              <input
                type="date"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleInputChange}
                className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                Job Type
              </label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleInputChange}
                className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
                required
              >
                <option value="">Select job type</option>
                <option value="paint">Paint</option>
                <option value="callback">Callback</option>
                <option value="repair">Repair</option>
              </select>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${textColor}`}>
              Special Instructions
            </label>
            <textarea
              rows={3}
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleInputChange}
              placeholder="Enter any special instructions"
              className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
            ></textarea>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Job Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
