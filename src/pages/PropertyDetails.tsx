import { useParams, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  ArrowLeft, 
  MapPin, 
  Users, 
  Phone, 
  Mail,
  Plus,
  Briefcase,
  Clock,
  CheckCircle,
  Calendar
} from 'lucide-react';
import { GoogleMap } from '../components/GoogleMap';

interface PropertyDetailsProps {
  theme: 'dark' | 'light';
}

export function PropertyDetails({ theme }: PropertyDetailsProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const sectionBg = theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50';

  // Mock data - replace with actual data fetching
  const property = {
    id: '1',
    name: '511 Queens',
    address: '511 Queens Road',
    city: 'Charlotte',
    state: 'NC',
    zip: '28207',
    region: 'Region',
    managementCompany: 'RKW Residential',
    grade: 'A',
    contact: {
      name: 'John Smith',
      role: 'Maintenance Supervisor',
      phone: '(555) 123-4567',
      email: 'john.smith@example.com'
    },
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
        walls: 'SW7029 Agreeable Gray',
        trim: 'SW7006 Extra White',
        doors: 'SW7006 Extra White',
        ceilings: 'Flat White'
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

  const stats = [
    {
      label: 'Total Jobs',
      value: '42',
      icon: Briefcase,
      color: 'bg-blue-600'
    },
    {
      label: 'Active Jobs',
      value: '3',
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      label: 'Scheduled Jobs',
      value: '5',
      icon: Calendar,
      color: 'bg-purple-500'
    },
    {
      label: 'Completed',
      value: '38',
      icon: CheckCircle,
      color: 'bg-green-500'
    }
  ];

  // Create the full address string for the Google Map
  const fullAddress = `${property.address}, ${property.city}, ${property.state} ${property.zip}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Building2 className={textColor} size={28} />
          <div>
            <h1 className={`text-2xl font-bold ${textColor}`}>{property.name}</h1>
            <p className={mutedTextColor}>{property.address}, {property.city}, {property.state} {property.zip}</p>
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
          <button
            onClick={() => navigate(`/properties/${id}/edit`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Edit Property
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className={`${cardBg} p-4 rounded-lg border ${borderColor} flex items-center space-x-4`}
          >
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="text-white" size={24} />
            </div>
            <div>
              <div className={`text-2xl font-bold ${textColor}`}>{stat.value}</div>
              <div className={mutedTextColor}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`${cardBg} rounded-lg border ${borderColor} p-6`}>
          <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Location Map</h2>
          <div className="aspect-video w-full rounded-lg overflow-hidden">
            <GoogleMap address={fullAddress} theme={theme} />
          </div>
        </div>

        <div className={`${cardBg} rounded-lg border ${borderColor} p-6`}>
          <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Property Map</h2>
          <div className="aspect-video w-full bg-gray-800 rounded-lg flex items-center justify-center">
            <div className={`text-center ${mutedTextColor}`}>
              <p className="mb-2">No property map available</p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto">
                <Plus size={20} />
                <span>Upload Map</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className={`${cardBg} rounded-lg border ${borderColor} p-6`}>
            <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Property Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className={mutedTextColor} size={20} />
                  <div>
                    <div className={`font-medium ${textColor}`}>Address</div>
                    <div className={mutedTextColor}>{property.address}</div>
                    <div className={mutedTextColor}>{property.city}, {property.state} {property.zip}</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className={mutedTextColor} size={20} />
                  <div>
                    <div className={`font-medium ${textColor}`}>Management Company</div>
                    <div className={mutedTextColor}>{property.managementCompany}</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Phone className={mutedTextColor} size={20} />
                  <div>
                    <div className={`font-medium ${textColor}`}>Contact Phone</div>
                    <div className={mutedTextColor}>{property.contact.phone}</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Mail className={mutedTextColor} size={20} />
                  <div>
                    <div className={`font-medium ${textColor}`}>Contact Email</div>
                    <div className={mutedTextColor}>{property.contact.email}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`${cardBg} rounded-lg border ${borderColor} p-6`}>
            <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Billing Rates</h2>
            <div className="space-y-6">
              <div>
                <h3 className={`text-sm font-medium ${mutedTextColor} mb-2`}>Regular Paint</h3>
                <div className={`${sectionBg} rounded-lg overflow-hidden`}>
                  <table className="w-full">
                    <thead>
                      <tr className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        <th className={`px-4 py-2 text-left text-sm ${textColor}`}>Unit Type</th>
                        <th className={`px-4 py-2 text-left text-sm ${textColor}`}>Bill Amount</th>
                        <th className={`px-4 py-2 text-left text-sm ${textColor}`}>Sub Pay</th>
                        <th className={`px-4 py-2 text-left text-sm ${textColor}`}>Profit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {Object.entries(property.billing.regular).map(([type, rates]) => (
                        <tr key={type}>
                          <td className={`px-4 py-2 ${textColor}`}>{type}</td>
                          <td className={`px-4 py-2 ${textColor}`}>${rates.bill}</td>
                          <td className={`px-4 py-2 ${textColor}`}>${rates.sub}</td>
                          <td className={`px-4 py-2 ${textColor}`}>${rates.profit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className={`text-sm font-medium ${mutedTextColor} mb-2`}>Ceiling Paint</h3>
                <div className={`${sectionBg} rounded-lg overflow-hidden`}>
                  <table className="w-full">
                    <thead>
                      <tr className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        <th className={`px-4 py-2 text-left text-sm ${textColor}`}>Unit Type</th>
                        <th className={`px-4 py-2 text-left text-sm ${textColor}`}>Bill Amount</th>
                        <th className={`px-4 py-2 text-left text-sm ${textColor}`}>Sub Pay</th>
                        <th className={`px-4 py-2 text-left text-sm ${textColor}`}>Profit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {Object.entries(property.billing.ceiling).map(([type, rates]) => (
                        <tr key={type}>
                          <td className={`px-4 py-2 ${textColor}`}>{type}</td>
                          <td className={`px-4 py-2 ${textColor}`}>${rates.bill}</td>
                          <td className={`px-4 py-2 ${textColor}`}>${rates.sub}</td>
                          <td className={`px-4 py-2 ${textColor}`}>${rates.profit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className={`text-sm font-medium ${mutedTextColor} mb-2`}>Extra Charges</h3>
                <div className={`${sectionBg} rounded-lg overflow-hidden`}>
                  <table className="w-full">
                    <thead>
                      <tr className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        <th className={`px-4 py-2 text-left text-sm ${textColor}`}>Service</th>
                        <th className={`px-4 py-2 text-left text-sm ${textColor}`}>Bill Amount</th>
                        <th className={`px-4 py-2 text-left text-sm ${textColor}`}>Sub Pay</th>
                        <th className={`px-4 py-2 text-left text-sm ${textColor}`}>Profit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {Object.entries(property.billing.extras).map(([service, rates]) => (
                        <tr key={service}>
                          <td className={`px-4 py-2 ${textColor}`}>{service}</td>
                          <td className={`px-4 py-2 ${textColor}`}>${rates.bill}</td>
                          <td className={`px-4 py-2 ${textColor}`}>${rates.sub}</td>
                          <td className={`px-4 py-2 ${textColor}`}>${rates.profit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className={`${cardBg} rounded-lg border ${borderColor} p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold ${textColor}`}>Recent Jobs</h2>
              <button 
                onClick={() => navigate(`/properties/${id}/jobs`)}
                className="text-blue-500 hover:text-blue-600"
              >
                View All
              </button>
            </div>
            <div className={`${sectionBg} rounded-lg overflow-hidden`}>
              <table className="w-full">
                <thead>
                  <tr className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <th className={`px-4 py-2 text-left text-sm ${textColor}`}>WO#</th>
                    <th className={`px-4 py-2 text-left text-sm ${textColor}`}>Unit</th>
                    <th className={`px-4 py-2 text-left text-sm ${textColor}`}>Type</th>
                    <th className={`px-4 py-2 text-left text-sm ${textColor}`}>Status</th>
                    <th className={`px-4 py-2 text-left text-sm ${textColor}`}>Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {property.recentJobs.map((job) => (
                    <tr key={job.id}>
                      <td className={`px-4 py-2 ${textColor}`}>{job.id}</td>
                      <td className={`px-4 py-2 ${textColor}`}>{job.unit}</td>
                      <td className={`px-4 py-2 ${textColor}`}>{job.type}</td>
                      <td className={`px-4 py-2`}>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          job.status === 'Completed' 
                            ? 'bg-green-500/20 text-green-500' 
                            : 'bg-yellow-500/20 text-yellow-500'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className={`px-4 py-2 ${textColor}`}>{job.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={`${cardBg} rounded-lg border ${borderColor} p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold ${textColor}`}>Property Updates / Notes</h2>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Add Note</span>
              </button>
            </div>
            <div className={`${sectionBg} rounded-lg overflow-hidden`}>
              <table className="w-full">
                <thead>
                  <tr className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <th className={`px-4 py-2 text-left text-sm ${textColor}`}>Date</th>
                    <th className={`px-4 py-2 text-left text-sm ${textColor}`}>Update Type</th>
                    <th className={`px-4 py-2 text-left text-sm ${textColor}`}>Note / Update</th>
                    <th className={`px-4 py-2 text-left text-sm ${textColor}`}>Posted By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {property.notes.map((note, index) => (
                    <tr key={index}>
                      <td className={`px-4 py-2 ${textColor}`}>{note.date}</td>
                      <td className={`px-4 py-2 ${textColor}`}>{note.updateType}</td>
                      <td className={`px-4 py-2 ${textColor}`}>{note.note}</td>
                      <td className={`px-4 py-2 ${textColor}`}>{note.postedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className={`${cardBg} rounded-lg border ${borderColor} p-6`}>
            <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Compliance Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={mutedTextColor}>Status</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  property.compliance.status === 'Compliant'
                    ? 'bg-green-500/20 text-green-500'
                    : 'bg-red-500/20 text-red-500'
                }`}>
                  {property.compliance.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={mutedTextColor}>Last Inspection</span>
                <span className={textColor}>{property.compliance.lastInspection}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={mutedTextColor}>COI Status</span>
                <span className={textColor}>{property.compliance.coiAddress}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={mutedTextColor}>W9 Status</span>
                <span className={textColor}>{property.compliance.w9Status}</span>
              </div>
            </div>
          </div>

          <div className={`${cardBg} rounded-lg border ${borderColor} p-6`}>
            <h2 className={`text-lg font-semibold ${textColor} mb-4`}>Paint Details</h2>
            <div className="space-y-4">
              <div>
                <h3 className={`text-sm font-medium ${mutedTextColor} mb-2`}>Paint Locations</h3>
                <div className="flex flex-wrap gap-2">
                  {property.paintDetails.locations.map((location) => (
                    <span 
                      key={location}
                      className={`px-3 py-1 rounded-full text-xs ${sectionBg} ${textColor}`}
                    >
                      {location}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className={`text-sm font-medium ${mutedTextColor} mb-2`}>Paint Selections</h3>
                <div className="space-y-2">
                  {Object.entries(property.paintDetails.selections).map(([surface, color]) => (
                    <div key={surface} className="flex items-center justify-between">
                      <span className={`capitalize ${mutedTextColor}`}>{surface}</span>
                      <span className={textColor}>{color}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
