import { useState } from 'react';
import { FileText, Loader2, DownloadCloud, Info } from 'lucide-react';
import { useToast } from "../../components/context/ToastContext";
import { reportAPI } from "../../services/reportAPI";
import CustomDropdown from "../../components/context/CustomDropdown";
import ReportView from "./components/ReportView";

export default function Reports({ activeStation = "Maitri" }) {
  const [reportType, setReportType] = useState('daily');
  const [reportCategory, setReportCategory] = useState('overall');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const showToast = useToast();

  const storedUser = localStorage.getItem("polar_twin_user");
  const user = storedUser && storedUser !== "undefined" 
    ? JSON.parse(storedUser) 
    : { fullName: "Operator", role: "operator" };

  const reportTypeOptions = [
    { label: "Daily Operations (Last 24h)", value: "daily" },
    { label: "Weekly Analysis (7 Days)", value: "weekly" },
    { label: "Monthly Rollup (30 Days)", value: "monthly" }
  ];

  const reportCategoryOptions = [
    { label: "Comprehensive (All Systems)", value: "overall" },
    { label: "Energy & Power Grid", value: "energy" },
    { label: "Environmental Telemetry", value: "environment" },
    { label: "Logistics & Supply Chain", value: "logistics" },
    { label: "Infrastructure & Health", value: "infrastructure" }
  ];

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const response = await reportAPI.getStationReport(activeStation, reportType, reportCategory);
      setReportData(response.data);
      setShowModal(true);
      showToast(`${reportCategory.charAt(0).toUpperCase() + reportCategory.slice(1)} report compiled successfully.`, "success");
    } catch (error) {
      console.error("Report Error:", error);
      showToast(error.message || "Failed to generate report. Check connection.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 font-sans transition-colors duration-300 bg-transparent">
      
      <div className="max-w-7xl mx-auto space-y-8 print-hide">
        
        {/* PAGE HEADER */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <DownloadCloud className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
            Data Export & Reports
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">
            Configure and compile historical operational data for <strong className="text-cyan-600 dark:text-cyan-400">{activeStation}</strong>.
          </p>
        </div>

        {/* PAGE GRID LAYOUT */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          
          {/* LEFT COLUMN: EXPORT CONFIGURATOR (Spans 2 columns on large screens) */}
          <div className="xl:col-span-2 rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-slate-800/80 dark:bg-slate-950/60">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-500" />
              Report Configuration Matrix
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Domain Scope */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wider">
                    Domain Scope
                  </label>
                  <CustomDropdown 
                      name="reportCategory"
                      value={reportCategory}
                      onChange={(e) => setReportCategory(e.target.value)}
                      options={reportCategoryOptions}
                  />
                  <p className="text-[11px] text-slate-500 mt-2 font-medium">Select specific subsystem or full station overview.</p>
                </div>

                {/* Time Window */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wider">
                    Time Window
                  </label>
                  <CustomDropdown 
                      name="reportType"
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                      options={reportTypeOptions}
                  />
                  <p className="text-[11px] text-slate-500 mt-2 font-medium">Determines the historical look-back period.</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60">
                <button 
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider text-white shadow-sm shadow-cyan-500/20 transition-all active:scale-[0.98] bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-600/50 flex justify-center items-center gap-2"
                >
                  {isGenerating ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Compile & Preview Report"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: INFORMATION/GUIDELINES */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 backdrop-blur-md p-6 sm:p-8 dark:border-slate-800/80 dark:bg-slate-900/40">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight mb-4 flex items-center gap-2 uppercase">
              <Info className="w-4 h-4 text-amber-500" /> Export Guidelines
            </h3>
            
            <div className="space-y-4">
              <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                <strong className="text-slate-900 dark:text-slate-200 block mb-1">Confidentiality Notice</strong>
                Generated reports contain sensitive telemetry. Distribute only over secured NCPOR channels.
              </div>
              
              <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                <strong className="text-slate-900 dark:text-slate-200 block mb-1">Export Formats</strong>
                Once compiled, you can preview the data visually, download structured <strong className="text-cyan-600 dark:text-cyan-400">CSV</strong> tables for local database ingestion, or export a formal <strong className="text-cyan-600 dark:text-cyan-400">PDF</strong> for executive briefing.
              </div>

              <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                <strong className="text-slate-900 dark:text-slate-200 block mb-1">Domain Filtering</strong>
                Selecting specific domains (e.g., Energy, Logistics) will isolate those metrics in the final CSV/JSON payloads, reducing file size.
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Reusable View Component */}
      <ReportView 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        reportData={reportData} 
        reportType={reportType}
        reportCategory={reportCategory}
        activeStation={activeStation} 
        user={user} 
      />
    </div>
  );
}