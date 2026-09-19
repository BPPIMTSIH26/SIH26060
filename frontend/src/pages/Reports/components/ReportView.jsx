import { useState } from 'react';
import { Eye, FileSpreadsheet, FileJson, FileDown, X } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import ReportPDF from './ReportPDF'; 
import VisualSummaryTab from './Tabs/VisualSummaryTab';
import DataTableTab from './Tabs/DataTableTab';
import JsonTreeTab from './Tabs/JsonTreeTab';

// Utility to limit floating points in the CSV export
const formatVal = (val) => {
  if (val === null || val === undefined) return 0;
  const num = Number(val);
  return isNaN(num) ? val : Number(num.toFixed(2));
};

export default function ReportView({ isOpen, onClose, reportData, reportType, reportCategory = 'overall', activeStation, user }) {
  const [activeTab, setActiveTab] = useState('visual');
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  if (!isOpen || !reportData) return null;

  const downloadCSV = () => {
    let csvString = `Report ID,${reportData.report_id}\nStation,${reportData.station_name}\nPeriod,${reportData.report_metadata?.report_type?.toUpperCase()}\nScope,${reportCategory.toUpperCase()}\n\n`;
    
    if (reportCategory === 'overall' || reportCategory === 'energy') {
      csvString += `--- ENERGY METRICS ---\nGeneration (kW),Load (kW),Deficit (kW),Battery (%)\n`;
      csvString += `${formatVal(reportData.energy_analysis?.metrics?.average_generation_kw)},${formatVal(reportData.energy_analysis?.metrics?.average_load_kw)},${formatVal(reportData.energy_analysis?.metrics?.net_deficit_kw)},${formatVal(reportData.energy_analysis?.metrics?.battery_charge_percent)}\n\n`;
    }
    if (reportCategory === 'overall' || reportCategory === 'environment') {
      csvString += `--- ENVIRONMENT METRICS ---\nOutside Temp (C),Wind (km/h),Visibility (m),Blizzard Active\n`;
      csvString += `${formatVal(reportData.environment_analysis?.metrics?.outside_temp_c)},${formatVal(reportData.environment_analysis?.metrics?.wind_speed_kmh)},${formatVal(reportData.environment_analysis?.metrics?.visibility_meters)},${reportData.environment_analysis?.metrics?.blizzard_active || false}\n\n`;
    }
    if (reportCategory === 'overall' || reportCategory === 'logistics') {
      csvString += `--- LOGISTICS METRICS ---\nFood Stock (Days),Medical Stock (%)\n`;
      csvString += `${formatVal(reportData.logistics_analysis?.supplies?.food?.current_stock_days)},${formatVal(reportData.logistics_analysis?.supplies?.medical?.current_stock_percent)}\n\n`;
    }
    if (reportCategory === 'overall' || reportCategory === 'infrastructure') {
      csvString += `--- INFRASTRUCTURE METRICS ---\nInfra Score,Status,Lab Temp (C)\n`;
      csvString += `${formatVal(reportData.system_health_breakdown?.infrastructure_score)},${reportData.system_health_breakdown?.infrastructure_status || 'N/A'},${formatVal(reportData.infrastructure_analysis?.modules?.main_lab?.average_temperature_c)}\n\n`;
    }

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${activeStation}_${reportCategory}_${reportType}_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = async () => {
    if (isPdfGenerating) return;
    setIsPdfGenerating(true);
    try {
      const blob = await pdf(
        <ReportPDF 
          reportData={reportData} 
          reportType={reportType} 
          reportCategory={reportCategory} 
          activeStation={activeStation} 
          user={user} 
        />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${activeStation}_${reportCategory}_${reportType}_Report.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-0 sm:p-4 md:p-6 animate-in fade-in duration-200">
      
      {/* 
        MODAL CONTAINER 
        Mobile: Full height (100dvh), no rounding, no border
        Desktop: 92vh, 2xl rounding, border
      */}
      <div className="bg-slate-50 dark:bg-slate-950 w-full max-w-6xl h-[100dvh] sm:h-[92vh] rounded-none sm:rounded-2xl shadow-2xl flex flex-col border-0 sm:border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* HEADER */}
        <div className="flex justify-between items-start sm:items-center px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 gap-2">
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase truncate">
                {activeStation} Report
              </h2>
              <span className="self-start sm:self-auto px-2 py-0.5 sm:px-2.5 sm:py-1 rounded bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest flex items-center gap-1 whitespace-nowrap">
                {reportType} • {reportCategory}
              </span>
            </div>
            <p className="text-[10px] sm:text-xs font-mono text-slate-500 mt-1 sm:mt-1 truncate">{reportData.report_id}</p>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-3 shrink-0 mt-1 sm:mt-0">
            {/* Export CSV: Icon on mobile, Full text on sm+ */}
            <button onClick={downloadCSV} title="Export CSV" className="flex items-center justify-center gap-2 p-2 sm:px-4 sm:py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-lg transition-colors sm:shadow-sm">
              <FileSpreadsheet className="w-5 h-5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400" /> 
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            {/* Print PDF: Icon on mobile, Full text on sm+ */}
            <button onClick={downloadPDF} disabled={isPdfGenerating} title="Print PDF" className="flex items-center justify-center gap-2 p-2 sm:px-4 sm:py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-600/50 text-white text-sm font-bold rounded-lg transition-colors sm:shadow-md">
              {isPdfGenerating ? (
                <span className="w-5 h-5 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <FileDown className="w-5 h-5 sm:w-4 sm:h-4" />
              )}
              <span className="hidden sm:inline">{isPdfGenerating ? 'Generating...' : 'Print PDF'}</span>
            </button>

            <div className="hidden sm:block w-px h-8 bg-slate-200 dark:bg-slate-700 mx-1"></div>
            
            <button onClick={onClose} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/40 text-slate-400 hover:text-red-600 transition-colors rounded-full ml-1 sm:ml-0">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS (Swipeable on Mobile) */}
        <div className="flex px-2 sm:px-6 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 overflow-x-auto no-scrollbar scroll-smooth">
          {[
            { id: 'visual', icon: Eye, label: 'Visual Summary' },
            { id: 'table', icon: FileSpreadsheet, label: 'Data Tables' },
            { id: 'json', icon: FileJson, label: 'Raw Payload' }
          ].map(tab => (
            <button 
              key={tab.id} onClick={() => setActiveTab(tab.id)} 
              className={`flex items-center whitespace-nowrap gap-2 px-4 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                activeTab === tab.id ? "border-cyan-500 text-cyan-600 dark:text-cyan-400 bg-cyan-50/50 dark:bg-cyan-900/20" : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <tab.icon className="w-4 h-4 sm:w-4 sm:h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENT ROUTER */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/50 dark:bg-[#0a0f1a]">
          {activeTab === 'visual' && <VisualSummaryTab reportData={reportData} reportCategory={reportCategory} />}
          {activeTab === 'table' && <DataTableTab reportData={reportData} reportCategory={reportCategory} />}
          {activeTab === 'json' && <JsonTreeTab reportData={reportData} reportCategory={reportCategory} />}
        </div>
      </div>
    </div>
  );
}