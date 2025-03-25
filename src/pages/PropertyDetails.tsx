
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import { Property, PropertyDetails as PropertyDetailsType } from '../types';
import { PropertyHeader } from '../components/property/PropertyHeader';
import { PropertyStats } from '../components/property/PropertyStats';
import { PropertyMaps } from '../components/property/PropertyMaps';
import { PropertyDetailsPanel } from '../components/property/PropertyDetailsPanel';
import { BillingRates } from '../components/property/BillingRates';
import { RecentJobs } from '../components/property/RecentJobs';
import { PropertyNotes } from '../components/property/PropertyNotes';
import { CompliancePanel } from '../components/property/CompliancePanel';
import { PaintDetailsPanel } from '../components/property/PaintDetailsPanel';
import { Callbacks } from '../components/property/Callbacks';

interface PropertyDetailsProps {
  theme: 'dark' | 'light';
}

export function PropertyDetails({ theme }: PropertyDetailsProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchPropertyDetails() {
      if (!id) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          console.error('Error fetching property details:', error);
          toast.error('Failed to load property details');
          return;
        }
        
        if (data) {
          const propertyData: Property = {
            id: data.id,
            name: data.name,
            address: data.address,
            city: data.city,
            state: data.state,
            zip: data.zip,
            status: data.status || 'active',
            property_management_group: data.property_management_group || undefined,
            community_manager_name: data.community_manager_name || undefined,
            community_manager_email: data.community_manager_email || undefined,
            community_manager_phone: data.community_manager_phone || undefined,
            maintenance_supervisor_name: data.maintenance_supervisor_name || undefined,
            maintenance_supervisor_email: data.maintenance_supervisor_email || undefined,
            maintenance_supervisor_phone: data.maintenance_supervisor_phone || undefined,
            colors_walls: data.colors_walls || undefined,
            colors_trim_base_doors: data.colors_trim_base_doors || undefined,
            colors_ceilings: data.colors_ceilings || undefined
          };
          
          setProperty(propertyData);
          
          const detailsData: PropertyDetailsType = {
            ...propertyData,
            billing: {
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
            },
            compliance: {
              status: 'Compliant',
              approved: true,
              approvalDate: '2024-01-15',
              coiAddress: 'on file',
              w9Status: 'Verified',
              lastInspection: '2024-02-20'
            },
            paintDetails: {
              locations: ['Regular Apartments', 'Common Areas', 'Exterior'],
              selections: {
                walls: propertyData.colors_walls || 'SW7029 Agreeable Gray',
                trim: propertyData.colors_trim_base_doors || 'SW7006 Extra White',
                doors: propertyData.colors_trim_base_doors || 'SW7006 Extra White',
                ceilings: propertyData.colors_ceilings || 'Flat White'
              }
            },
            recentJobs: [
              {
                id: 'WO#42',
                unit: '12',
                type: 'Paint',
                status: 'Completed',
                date: '2024-02-25'
              },
              {
                id: 'WO#46',
                unit: '2/25',
                type: 'Paint',
                status: 'In Progress',
                date: '2024-02-26'
              }
            ],
            notes: [
              {
                date: '2/10/25',
                updateType: 'Test',
                note: 'Test note update',
                postedBy: 'Timothy Farzalo'
              }
            ]
          };
          
          setPropertyDetails(detailsData);
        } else {
          toast.error('Property not found');
          navigate('/properties');
        }
      } catch (error) {
        console.error('Error fetching property details:', error);
        toast.error('Failed to load property details');
      } finally {
        setLoading(false);
      }
    }
    
    fetchPropertyDetails();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className={`text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          <p className="text-xl">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property || !propertyDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className={`text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          <p className="text-xl">Property not found</p>
          <button
            onClick={() => navigate('/properties')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Properties
          </button>
        </div>
      </div>
    );
  }

  const fullAddress = `${property.address}, ${property.city}, ${property.state} ${property.zip}`;

  return (
    <div className="space-y-6">
      <PropertyHeader property={property} theme={theme} />
      <PropertyStats theme={theme} />
      <PropertyMaps address={fullAddress} theme={theme} />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <PropertyDetailsPanel property={property} theme={theme} />
          <BillingRates propertyDetails={propertyDetails} theme={theme} />
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <CompliancePanel propertyDetails={propertyDetails} theme={theme} />
          <PaintDetailsPanel propertyDetails={propertyDetails} theme={theme} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Callbacks theme={theme} />
        <PropertyNotes propertyDetails={propertyDetails} theme={theme} />
      </div>
      
      <RecentJobs propertyDetails={propertyDetails} propertyId={property.id} theme={theme} />
    </div>
  );
}
