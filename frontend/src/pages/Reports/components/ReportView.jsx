import { useState } from 'react';
import { Eye, FileSpreadsheet, FileJson, FileDown, X } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import ReportPDF from './ReportPDF'; 
import VisualSummaryTab from './Tabs/VisualSummaryTab';
import DataTableTab from './Tabs/DataTableTab';
import JsonTreeTab from './Tabs/JsonTreeTab';

export default function ReportView({ isOpen, onClose, reportData, reportType, reportCategory = 'overall', activeStation, user }) {
  const [activeTab, setActiveTab] = useState('visual');
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  if (!isOpen || !reportData) return null;

  const downloadCSV = () => {
    let csvString = `Report ID,${reportData.report_id}\nStation,${reportData.station_name}\nPeriod,${reportData.report_metadata?.report_type?.toUpperCase()}\nScope,${reportCategory.toUpperCase()}\n\n`;
    
    if (reportCategory === 'overall' || reportCategory === 'energy') {
      csvString += `--- ENERGY METRICS ---\nGeneration (kW),Load (kW),Deficit (kW),Battery (%)\n`;
      csvString += `${reportData.energy_analysis?.metrics?.average_generation_kw || 0},${reportData.energy_analysis?.metrics?.average_load_kw || 0},${reportData.energy_analysis?.metrics?.net_deficit_kw || 0},${reportData.energy_analysis?.metrics?.battery_charge_percent || 0}\n\n`;
    }
    if (reportCategory === 'overall' || reportCategory === 'environment') {
      csvString += `--- ENVIRONMENT METRICS ---\nOutside Temp (C),Wind (km/h),Visibility (m),Blizzard Active\n`;
      csvString += `${reportData.environment_analysis?.metrics?.outside_temp_c || 0},${reportData.environment_analysis?.metrics?.wind_speed_kmh || 0},${reportData.environment_analysis?.metrics?.visibility_meters || 0},${reportData.environment_analysis?.metrics?.blizzard_active || false}\n\n`;
    }
    if (reportCategory === 'overall' || reportCategory === 'logistics') {
      csvString += `--- LOGISTICS METRICS ---\nFood Stock (Days),Medical Stock (%)\n`;
      csvString += `${reportData.logistics_analysis?.supplies?.food?.current_stock_days || 0},${reportData.logistics_analysis?.supplies?.medical?.current_stock_percent || 0}\n\n`;
    }
    if (reportCategory === 'overall' || reportCategory === 'infrastructure') {
      csvString += `--- INFRASTRUCTURE METRICS ---\nInfra Score,Status,Lab Temp (C)\n`;
      csvString += `${reportData.system_health_breakdown?.infrastructure_score || 0},${reportData.system_health_breakdown?.infrastructure_status || 'N/A'},${reportData.infrastructure_analysis?.modules?.main_lab?.average_temperature_c || 0}\n\n`;
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
          reportCategory={reportCategory} // <-- FIX: Passing category down to PDF 
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-50 dark:bg-slate-950 w-full max-w-6xl h-[92vh] rounded-2xl shadow-2xl flex flex-col border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                {activeStation} Operations Report
              </h2>
              <span className="px-2.5 py-1 rounded bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                {reportType} • {reportCategory}
              </span>
            </div>
            <p className="text-xs font-mono text-slate-500 mt-1">{reportData.report_id}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={downloadCSV} className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-lg transition-colors shadow-sm">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Export CSV
            </button>
            <button onClick={downloadPDF} disabled={isPdfGenerating} className="hidden sm:flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-600/50 text-white text-sm font-bold rounded-lg transition-colors shadow-md">
              {isPdfGenerating ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : <FileDown className="w-4 h-4" />}
              {isPdfGenerating ? 'Generating...' : 'Print PDF'}
            </button>
            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <button onClick={onClose} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/40 text-slate-400 hover:text-red-600 transition-colors rounded-full">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex px-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 overflow-x-auto no-scrollbar">
          {[
            { id: 'visual', icon: Eye, label: 'Visual Summary' },
            { id: 'table', icon: FileSpreadsheet, label: 'Data Tables' },
            { id: 'json', icon: FileJson, label: 'Raw Payload' }
          ].map(tab => (
            <button 
              key={tab.id} onClick={() => setActiveTab(tab.id)} 
              className={`flex items-center gap-2 px-6 py-3.5 text-sm font-bold border-b-2 transition-all ${
                activeTab === tab.id ? "border-cyan-500 text-cyan-600 dark:text-cyan-400 bg-cyan-50/50 dark:bg-cyan-900/20" : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENT ROUTER */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100/50 dark:bg-[#0a0f1a]">
          {activeTab === 'visual' && <VisualSummaryTab reportData={reportData} reportCategory={reportCategory} />}
          {activeTab === 'table' && <DataTableTab reportData={reportData} reportCategory={reportCategory} />}
          {activeTab === 'json' && <JsonTreeTab reportData={reportData} reportCategory={reportCategory} />}
        </div>
      </div>
    </div>
  );
}