import React, { useState } from 'react';
import { Button, Badge, Modal } from '../../components/ui';
import { MOCK_REPORTS } from '../../constants';

export const MyReports = () => {
  const [selectedReport, setSelectedReport] = useState<any>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'APPROVED': return 'info';
      case 'REJECTED': return 'danger';
      default: return 'warning';
    }
  };

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Submission History</h2>
        
        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Zone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {MOCK_REPORTS.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{report.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{report.zoneName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(report.timestamp).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatusColor(report.status) as any}>{report.status}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => setSelectedReport(report)}
                      className="text-green-600 hover:text-green-900"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {MOCK_REPORTS.map((report) => (
            <div 
              key={report.id} 
              className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center"
              onClick={() => setSelectedReport(report)}
            >
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-bold text-slate-800">{report.id}</span>
                  <Badge variant={getStatusColor(report.status) as any}>{report.status}</Badge>
                </div>
                <p className="text-sm text-slate-600">{report.zoneName}</p>
                <p className="text-xs text-slate-400">{new Date(report.timestamp).toLocaleDateString()}</p>
              </div>
              <img src={report.imageUrl} alt="" className="h-16 w-16 rounded-lg object-cover bg-slate-100" />
            </div>
          ))}
        </div>
      </div>

      <Modal 
        isOpen={!!selectedReport} 
        onClose={() => setSelectedReport(null)}
        title={`Report Details: ${selectedReport?.id}`}
        footer={
          <Button onClick={() => setSelectedReport(null)}>Close</Button>
        }
      >
        {selectedReport && (
          <div className="space-y-4">
            <img src={selectedReport.imageUrl} alt="Evidence" className="w-full rounded-lg shadow-sm" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Zone</p>
                <p className="font-medium">{selectedReport.zoneName}</p>
              </div>
              <div>
                <p className="text-slate-500">Date</p>
                <p className="font-medium">{new Date(selectedReport.timestamp).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-500">Severity</p>
                <p className="font-medium">{selectedReport.severity}</p>
              </div>
              <div>
                <p className="text-slate-500">Status</p>
                <Badge variant={getStatusColor(selectedReport.status) as any}>{selectedReport.status}</Badge>
              </div>
            </div>
            <div>
              <p className="text-slate-500 text-sm mb-1">Description</p>
              <p className="text-slate-800 bg-slate-50 p-3 rounded-lg text-sm">{selectedReport.description}</p>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};