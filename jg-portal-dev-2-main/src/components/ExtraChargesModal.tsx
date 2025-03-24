import React, { useState, useEffect } from 'react';
import { X, Mail, CheckCircle } from 'lucide-react';

interface ExtraChargesModalProps {
  theme: 'dark' | 'light';
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: {
    template: string;
    selectedFields: string[];
    recipientEmail: string;
    emailBody: string;
  }) => void;
  workOrderData: any;
  recipientEmail: string;
}

export function ExtraChargesModal({
  theme,
  isOpen,
  onClose,
  onSend,
  workOrderData,
  recipientEmail: defaultRecipientEmail
}: ExtraChargesModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('template1');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [recipientEmail, setRecipientEmail] = useState(defaultRecipientEmail);
  const [emailBody, setEmailBody] = useState('');
  const [previewContent, setPreviewContent] = useState('');

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const modalBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const overlayBg = theme === 'dark' ? 'bg-black/50' : 'bg-gray-500/50';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
  const previewBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50';

  const templates = [
    {
      id: 'template1',
      name: 'Standard Extra Charges',
      subject: 'Extra Charges Notification - [Work Order #]',
      content: `Dear Property Manager,

We are writing to inform you about additional charges that have been identified for the following work order:

[WORK_ORDER_DETAILS]

These extra charges are necessary due to additional work requirements discovered during the job. A detailed breakdown of the charges is provided below:

[EXTRA_CHARGES]

Total Additional Amount: [TOTAL_AMOUNT]

Please review these charges and provide your approval to proceed. If you have any questions or concerns, please don't hesitate to contact us.

Best regards,
JG Painting Pros Inc.`
    },
    {
      id: 'template2',
      name: 'Urgent Extra Charges',
      subject: 'URGENT: Additional Charges Required - [Work Order #]',
      content: `URGENT: Additional Charges Notification

Dear Property Manager,

This is an urgent notification regarding necessary additional charges for:

[WORK_ORDER_DETAILS]

These charges require immediate attention to prevent work delays:

[EXTRA_CHARGES]

Total Additional Amount: [TOTAL_AMOUNT]

Please provide your urgent approval to avoid any work stoppage. We appreciate your prompt attention to this matter.

Best regards,
JG Painting Pros Inc.`
    },
    {
      id: 'template3',
      name: 'Detailed Breakdown',
      subject: 'Detailed Extra Charges Breakdown - [Work Order #]',
      content: `Dear Property Manager,

Please find below a detailed breakdown of additional charges identified for:

[WORK_ORDER_DETAILS]

Itemized Extra Charges:
[EXTRA_CHARGES]

Total Base Amount: $[BASE_AMOUNT]
Total Extra Charges: $[EXTRA_AMOUNT]
Final Total Amount: $[TOTAL_AMOUNT]

Additional Notes:
[DESCRIPTION]

Please review the detailed breakdown above and let us know if you need any clarification.

Best regards,
JG Painting Pros Inc.`
    }
  ];

  const availableFields = [
    { id: 'workOrderNumber', label: 'Work Order #', value: workOrderData.workOrderNumber },
    { id: 'propertyName', label: 'Property Name', value: workOrderData.property },
    { id: 'unitNumber', label: 'Unit Number', value: workOrderData.unit },
    { id: 'description', label: 'Description', value: workOrderData.description },
    { id: 'baseAmount', label: 'Base Amount', value: `$${workOrderData.baseAmount.toFixed(2)}` },
    { id: 'extraCharges', label: 'Extra Charges', value: workOrderData.extraCharges.map((charge: any) => 
      `\n• ${charge.type} (${charge.location}): $${charge.amount.toFixed(2)} - ${charge.description}`
    ).join('') },
    { id: 'totalAmount', label: 'Total Amount', value: `$${workOrderData.totalAmount.toFixed(2)}` }
  ];

  useEffect(() => {
    let content = templates.find(t => t.id === selectedTemplate)?.content || '';
    
    // Replace template placeholders with actual values if field is selected
    content = content
      .replace('[WORK_ORDER_DETAILS]', selectedFields.includes('workOrderNumber') || selectedFields.includes('propertyName') ?
        `Work Order: ${workOrderData.workOrderNumber}\nProperty: ${workOrderData.property}\nUnit: ${workOrderData.unit}` : '[Work Order Details Not Included]')
      .replace('[EXTRA_CHARGES]', selectedFields.includes('extraCharges') ?
        workOrderData.extraCharges.map((charge: any) => 
          `• ${charge.type} (${charge.location}): $${charge.amount.toFixed(2)}\n  ${charge.description}`
        ).join('\n') : '[Extra Charges Not Included]')
      .replace('[BASE_AMOUNT]', selectedFields.includes('baseAmount') ? 
        workOrderData.baseAmount.toFixed(2) : '[Base Amount Not Included]')
      .replace('[EXTRA_AMOUNT]', selectedFields.includes('extraCharges') ?
        workOrderData.extraCharges.reduce((sum: number, charge: any) => sum + charge.amount, 0).toFixed(2) : '[Extra Amount Not Included]')
      .replace('[TOTAL_AMOUNT]', selectedFields.includes('totalAmount') ?
        workOrderData.totalAmount.toFixed(2) : '[Total Amount Not Included]')
      .replace('[DESCRIPTION]', selectedFields.includes('description') ?
        workOrderData.description : '[Description Not Included]');

    setEmailBody(content);
    setPreviewContent(content);
  }, [selectedTemplate, selectedFields, workOrderData]);

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFields(prev =>
      prev.includes(fieldId)
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const handleSend = () => {
    onSend({
      template: selectedTemplate,
      selectedFields,
      recipientEmail,
      emailBody
    });
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValid = validateEmail(recipientEmail) && selectedFields.length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className={`fixed inset-0 ${overlayBg}`} onClick={onClose} />
      <div className={`relative ${modalBg} rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className={`text-xl font-semibold ${textColor}`}>Send Extra Charges Notification</h2>
          <button
            onClick={onClose}
            className={`${mutedTextColor} hover:${textColor}`}
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Template Selection */}
          <div>
            <h3 className={`text-lg font-medium ${textColor} mb-4`}>Email Template</h3>
            <div className="space-y-4">
              {templates.map(template => (
                <label
                  key={template.id}
                  className={`block p-4 rounded-lg border ${borderColor} cursor-pointer ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="template"
                      value={template.id}
                      checked={selectedTemplate === template.id}
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                      className="text-blue-500 focus:ring-blue-500"
                    />
                    <div>
                      <div className={`font-medium ${textColor}`}>{template.name}</div>
                      <div className={`text-sm ${mutedTextColor}`}>Subject: {template.subject}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Field Selection */}
          <div>
            <h3 className={`text-lg font-medium ${textColor} mb-4`}>Work Order Fields</h3>
            <div className="grid grid-cols-2 gap-4">
              {availableFields.map(field => (
                <label
                  key={field.id}
                  className="flex items-center space-x-3"
                >
                  <input
                    type="checkbox"
                    checked={selectedFields.includes(field.id)}
                    onChange={() => handleFieldToggle(field.id)}
                    className="rounded text-blue-500 focus:ring-blue-500"
                  />
                  <span className={textColor}>{field.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Recipient Email */}
          <div>
            <h3 className={`text-lg font-medium ${textColor} mb-4`}>Recipient</h3>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
              placeholder="Enter recipient email"
            />
            {!validateEmail(recipientEmail) && recipientEmail && (
              <p className="mt-2 text-sm text-red-500">Please enter a valid email address</p>
            )}
          </div>

          {/* Email Preview */}
          <div>
            <h3 className={`text-lg font-medium ${textColor} mb-4`}>Email Preview</h3>
            <div className={`${previewBg} p-4 rounded-lg`}>
              <div className={`font-medium ${textColor} mb-2`}>
                Subject: {templates.find(t => t.id === selectedTemplate)?.subject.replace('[Work Order #]', workOrderData.workOrderNumber)}
              </div>
              <div className={`whitespace-pre-wrap ${textColor}`}>
                {previewContent}
              </div>
            </div>
          </div>

          {/* Additional Message */}
          <div>
            <h3 className={`text-lg font-medium ${textColor} mb-4`}>Additional Message</h3>
            <textarea
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor} min-h-[200px]`}
              placeholder="Modify the email content or add additional message..."
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!isValid}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              isValid
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-600 text-gray-300 cursor-not-allowed'
            }`}
          >
            <Mail size={20} />
            <span>Send Email</span>
          </button>
        </div>
      </div>
    </div>
  );
}