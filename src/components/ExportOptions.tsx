import React from 'react';
import { FileDown } from 'lucide-react';
import { unparse } from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ExportOptionsProps {
  theme: 'dark' | 'light';
  data: any[];
  columns: { header: string; accessor: string }[];
  filename: string;
  isVisible: boolean;
}

export function ExportOptions({ theme, data, columns, filename, isVisible }: ExportOptionsProps) {
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const cardBg = theme === 'dark' ? 'bg-[#1F2230]' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';

  React.useEffect(() => {
    if (isVisible) {
      setStartDate('');
      setEndDate('');
    }
  }, [isVisible]);

  const filterDataByDateRange = () => {
    if (!startDate && !endDate) return data;

    return data.filter(item => {
      const itemDate = new Date(item.scheduledDate || item.date);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date(8640000000000000);
      return itemDate >= start && itemDate <= end;
    });
  };

  const exportToCSV = () => {
    const filteredData = filterDataByDateRange();
    const csv = unparse(filteredData.map(item => 
      columns.reduce((acc, col) => ({
        ...acc,
        [col.header]: item[col.accessor]
      }), {})
    ));

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${startDate || 'all'}_${endDate || 'all'}.csv`;
    link.click();
  };

  const exportToPDF = () => {
    const filteredData = filterDataByDateRange();
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(filename, 14, 15);

    if (startDate || endDate) {
      doc.setFontSize(10);
      doc.text(`Date Range: ${startDate || 'Start'} to ${endDate || 'End'}`, 14, 25);
    }

    autoTable(doc, {
      head: [columns.map(col => col.header)],
      body: filteredData.map(item => 
        columns.map(col => item[col.accessor])
      ),
      startY: startDate || endDate ? 30 : 20,
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold'
      }
    });

    doc.save(`${filename}_${startDate || 'all'}_${endDate || 'all'}.pdf`);
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`${cardBg} p-6 rounded-lg border ${borderColor} space-y-6 mt-6`}
    >
      <div>
        <h3 className={`text-lg font-medium ${textColor} mb-4`}>Export Options</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${textColor}`}>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
              autoFocus
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${textColor}`}>End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={`w-full p-2.5 rounded-lg border ${inputBg} ${borderColor} ${textColor}`}
            />
          </div>
        </div>
        <p className={`mt-2 text-sm ${mutedTextColor}`}>
          Leave dates empty to export all records
        </p>
      </div>

      <div>
        <h3 className={`text-lg font-medium ${textColor} mb-4`}>Export Format</h3>
        <div className="flex items-center space-x-4">
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <FileDown size={20} />
            <span>Export as CSV</span>
          </button>
          <button
            onClick={exportToPDF}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <FileDown size={20} />
            <span>Export as PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
