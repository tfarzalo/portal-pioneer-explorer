
import { PropertyDetails } from '../../types';

interface BillingRatesProps {
  propertyDetails: PropertyDetails;
  theme: 'dark' | 'light';
}

export function BillingRates({ propertyDetails, theme }: BillingRatesProps) {
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const sectionBg = theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50';

  return (
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
                {Object.entries(propertyDetails.billing.regular).map(([type, rates]) => (
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
                {Object.entries(propertyDetails.billing.ceiling).map(([type, rates]) => (
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
                {Object.entries(propertyDetails.billing.extras).map(([service, rates]) => (
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
  );
}
