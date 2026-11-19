import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Building2,
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Upload,
  AlertCircle,
  HelpCircle,
  Save,
  Send,
  ShieldCheck,
  Flame,
  Zap,
  Layers,
  Scale,
  RefreshCw,
  ExternalLink,
  Info,
} from 'lucide-react';
import { ApiService, PublicSupplierFormResponse } from '../services/api';

export const SupplierRequestPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<PublicSupplierFormResponse | null>(null);

  // Form Fields State
  const [productionRoute, setProductionRoute] = useState<string>('BF-BOF');
  const [directFuelType, setDirectFuelType] = useState<string>('Coking Coal & Natural Gas');
  const [directFuelGj, setDirectFuelGj] = useState<string>('14.2');
  const [electricityMwh, setElectricityMwh] = useState<string>('0.48');
  const [electricitySource, setElectricitySource] = useState<string>('CEA Central Regional Grid');
  const [scrapContentPct, setScrapContentPct] = useState<string>('12.5');
  const [totalOutputTonnes, setTotalOutputTonnes] = useState<string>('45000');
  const [precursorSee, setPrecursorSee] = useState<string>('1.825');
  const [notes, setNotes] = useState<string>('');

  // Submitter Info
  const [respondentName, setRespondentName] = useState<string>('');
  const [respondentDesignation, setRespondentDesignation] = useState<string>('');
  const [respondentEmail, setRespondentEmail] = useState<string>('');
  const [respondentPhone, setRespondentPhone] = useState<string>('');

  // Evidence File
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [evidenceFileInfo, setEvidenceFileInfo] = useState<{ filename: string; sha256: string } | null>(null);
  const [uploadingFile, setUploadingFile] = useState<boolean>(false);

  // Submission Status
  const [isSavingDraft, setIsSavingDraft] = useState<boolean>(false);
  const [draftSavedMsg, setDraftSavedMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (token) {
      loadRequestData(token);
    }
  }, [token]);

  const loadRequestData = async (reqToken: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await ApiService.getPublicSupplierForm(reqToken);
      if (data && data.valid) {
        setFormData(data);

        // Prepopulate from existing submission or draft if present
        const prev = data.draft || data.existing_submission;
        if (prev) {
          if (prev.production_route) setProductionRoute(prev.production_route);
          if (prev.direct_fuel_type) setDirectFuelType(prev.direct_fuel_type);
          if (prev.direct_fuel_consumption_gj_per_t != null) setDirectFuelGj(String(prev.direct_fuel_consumption_gj_per_t));
          if (prev.electricity_consumption_mwh_per_t != null) setElectricityMwh(String(prev.electricity_consumption_mwh_per_t));
          if (prev.electricity_source) setElectricitySource(prev.electricity_source);
          if (prev.scrap_content_pct != null) setScrapContentPct(String(prev.scrap_content_pct));
          if (prev.total_output_tonnes != null) setTotalOutputTonnes(String(prev.total_output_tonnes));
          if (prev.precursor_emissions_tco2_per_t != null) setPrecursorSee(String(prev.precursor_emissions_tco2_per_t));
          if (prev.notes) setNotes(prev.notes);

          if (prev.submitter_name) setRespondentName(prev.submitter_name);
          if (prev.submitter_designation) setRespondentDesignation(prev.submitter_designation);
          if (prev.submitter_email) setRespondentEmail(prev.submitter_email);
          if (prev.submitter_phone) setRespondentPhone(prev.submitter_phone);

          if (prev.evidence_file_name) {
            setEvidenceFileInfo({
              filename: prev.evidence_file_name,
              sha256: prev.evidence_file_sha256 || 'Calculated on upload',
            });
          }
        }
      } else {
        setError(data?.error || 'Invalid or expired supplier data request link.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load supplier request form.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!token || !e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setEvidenceFile(file);
    setUploadingFile(true);
    try {
      const res = await ApiService.uploadSupplierEvidence(token, file);
      if (res && res.sha256) {
        setEvidenceFileInfo({
          filename: res.filename,
          sha256: res.sha256,
        });
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to process evidence file.');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!token) return;
    setIsSavingDraft(true);
    setDraftSavedMsg(null);
    try {
      const draftPayload = {
        production_route: productionRoute,
        direct_fuel_type: directFuelType,
        direct_fuel_consumption_gj_per_t: parseFloat(directFuelGj) || 0,
        electricity_consumption_mwh_per_t: parseFloat(electricityMwh) || 0,
        electricity_source: electricitySource,
        scrap_content_pct: parseFloat(scrapContentPct) || 0,
        total_output_tonnes: parseFloat(totalOutputTonnes) || 0,
        precursor_emissions_tco2_per_t: parseFloat(precursorSee) || 0,
        evidence_file_name: evidenceFileInfo?.filename,
        evidence_file_sha256: evidenceFileInfo?.sha256,
        notes,
        respondent_name: respondentName,
        respondent_designation: respondentDesignation,
        respondent_email: respondentEmail,
        respondent_phone: respondentPhone,
      };

      await ApiService.savePublicSupplierDraft(token, draftPayload);
      setDraftSavedMsg('Draft auto-saved successfully at ' + new Date().toLocaleTimeString());
      setTimeout(() => setDraftSavedMsg(null), 3500);
    } catch (err: any) {
      alert(err?.message || 'Failed to save draft.');
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!respondentName.trim() || !respondentEmail.trim()) {
      alert('Please provide your name and professional work email.');
      return;
    }

    if (!precursorSee || parseFloat(precursorSee) <= 0) {
      alert('Please enter a valid Specific Embedded Emissions (SEE) value.');
      return;
    }

    setIsSubmitting(true);
    try {
      const submitPayload = {
        respondent_name: respondentName.trim(),
        respondent_designation: respondentDesignation.trim() || 'Quality Desk',
        respondent_email: respondentEmail.trim(),
        respondent_phone: respondentPhone.trim() || undefined,
        submission: {
          production_route: productionRoute,
          direct_fuel_type: directFuelType,
          direct_fuel_consumption_gj_per_t: parseFloat(directFuelGj) || 0,
          electricity_consumption_mwh_per_t: parseFloat(electricityMwh) || 0,
          electricity_source: electricitySource,
          scrap_content_pct: parseFloat(scrapContentPct) || 0,
          total_output_tonnes: parseFloat(totalOutputTonnes) || 0,
          precursor_emissions_tco2_per_t: parseFloat(precursorSee),
          evidence_file_name: evidenceFileInfo?.filename,
          evidence_file_sha256: evidenceFileInfo?.sha256,
          notes,
        },
        evidence_files: evidenceFileInfo ? [evidenceFileInfo] : undefined,
      };

      await ApiService.submitPublicSupplierData(token, submitPayload);
      setSubmittedSuccess(true);
    } catch (err: any) {
      alert(err?.message || 'Failed to submit precursor declaration. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-black">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                HEATLEDGER <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">SUPPLIER PORTAL</span>
              </div>
              <div className="text-[10px] text-slate-400">EU CBAM Regulation (EU) 2023/956 Precursor Data Intake</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>No Login Required</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
        {/* Loading State */}
        {loading && (
          <div className="py-24 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-spin">
              <RefreshCw className="w-6 h-6" />
            </div>
            <p className="text-xs font-mono text-slate-400">Loading supplier data request parameters...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="max-w-md mx-auto my-12 bg-slate-900 border border-rose-500/30 rounded-2xl p-6 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-white">Request Link Unavailable</h2>
            <p className="text-xs text-slate-300 leading-relaxed">{error}</p>
          </div>
        )}

        {/* Success Confirmation State */}
        {!loading && submittedSuccess && (
          <div className="max-w-lg mx-auto my-12 bg-slate-900 border border-emerald-500/30 rounded-2xl p-8 text-center space-y-4 shadow-2xl animate-scaleUp">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white">Precursor Declaration Received</h2>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Thank you, <strong className="text-white">{respondentName}</strong>. Your actual precursor emissions data for{' '}
              <strong className="text-emerald-400">{formData?.product_name}</strong> ({formData?.reporting_period}) has been securely submitted to the Metallurgical Quality team at Howrah Precision Forgings Pvt. Ltd.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-left space-y-1">
              <div className="text-slate-400">SUBMISSION RECEIPT:</div>
              <div className="text-white font-bold">SEE: {precursorSee} tCO₂e / t (Verified Supplier Precursor)</div>
              <div className="text-emerald-400 text-[11px]">Production Route: {productionRoute} · Scrap: {scrapContentPct}%</div>
            </div>
            <p className="text-[11px] text-slate-400">
              A confirmation email has been logged for <span className="text-white">{respondentEmail}</span>. You may close this window.
            </p>
          </div>
        )}

        {/* Active Form */}
        {!loading && !submittedSuccess && formData && (
          <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[11px] font-mono font-bold text-emerald-400 block mb-1">
                    CBAM PRECURSOR EMISSIONS INTAKE
                  </span>
                  <h1 className="text-xl font-extrabold text-white">
                    {formData.product_name}
                  </h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Supplier: <strong className="text-white">{formData.supplier_name}</strong>
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-xs font-mono text-slate-400">REPORTING PERIOD</div>
                  <div className="text-base font-bold text-emerald-400 font-mono">{formData.reporting_period}</div>
                  <div className="text-[10px] text-slate-400">Target Due Date: {formData.due_date}</div>
                </div>
              </div>

              {/* Revision note banner if returned */}
              {formData.status === 'RETURNED' && formData.review_notes && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-300">Action Required - Reviewer Notes: </span>
                    <span>{formData.review_notes}</span>
                  </div>
                </div>
              )}

              {/* Custom Note from Exporter if provided */}
              {formData.custom_note && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                  <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-200">Note from Exporter: </span>
                    <span>{formData.custom_note}</span>
                  </div>
                </div>
              )}

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Under European Union Regulation (EU) 2023/956 Annex III Section 3.1, downstream steel exporters must report actual verified embedded emissions of upstream precursor goods. Please provide actual operational data for the specified product and period.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section 1: Metallurgy & Route */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Flame className="w-4 h-4 text-emerald-400" />
                  <span>1. Production Route &amp; Primary Fuel</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Production Route *
                    </label>
                    <select
                      value={productionRoute}
                      onChange={(e) => setProductionRoute(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                    >
                      <option value="BF-BOF">BF-BOF (Blast Furnace - Basic Oxygen Furnace)</option>
                      <option value="DRI-EAF">DRI-EAF (Direct Reduced Iron - Electric Arc Furnace)</option>
                      <option value="Scrap-EAF">Scrap-EAF (100% Scrap Electric Arc Furnace)</option>
                      <option value="Corex / BOF-CC">Corex / BOF-CC (Smelting Reduction / Converter)</option>
                    </select>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Primary crude steel casting route at mill
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Direct Fuel Types Consumed *
                    </label>
                    <input
                      type="text"
                      value={directFuelType}
                      onChange={(e) => setDirectFuelType(e.target.value)}
                      placeholder="e.g. Coking Coal, Coke Oven Gas, Natural Gas"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Direct Fuel Energy (GJ / metric tonne) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={directFuelGj}
                      onChange={(e) => setDirectFuelGj(e.target.value)}
                      placeholder="e.g. 14.2"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Net calorific consumption per tonne of precursor
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Scrap Charge Content (% Weight) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={scrapContentPct}
                      onChange={(e) => setScrapContentPct(e.target.value)}
                      placeholder="e.g. 12.5"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Percent of scrap consumed in furnace charges
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 2: Electricity & Embedded Emissions */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>2. Electricity &amp; Specific Embedded Emissions</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Electricity Consumption (MWh / tonne) *
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      required
                      value={electricityMwh}
                      onChange={(e) => setElectricityMwh(e.target.value)}
                      placeholder="e.g. 0.480"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Electricity Source &amp; Grid Factor *
                    </label>
                    <input
                      type="text"
                      value={electricitySource}
                      onChange={(e) => setElectricitySource(e.target.value)}
                      placeholder="e.g. CEA Central Regional Grid (0.71 tCO2/MWh)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Total Period Output Tonnes (MT) *
                    </label>
                    <input
                      type="number"
                      step="1"
                      required
                      value={totalOutputTonnes}
                      onChange={(e) => setTotalOutputTonnes(e.target.value)}
                      placeholder="e.g. 45000"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-emerald-400 font-bold mb-1">
                      Specific Embedded Emissions (tCO₂e / t) *
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      required
                      value={precursorSee}
                      onChange={(e) => setPrecursorSee(e.target.value)}
                      placeholder="e.g. 1.825"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-emerald-500 text-emerald-300 font-bold text-sm font-mono focus:outline-none focus:border-emerald-400"
                    />
                    <span className="text-[10px] text-emerald-400/80 mt-1 block">
                      Specific Embedded Emissions for this precursor batch
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 3: Evidence Upload */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <FileSpreadsheet className="w-4 h-4 text-purple-400" />
                  <span>3. Supporting Evidence Document (Excel or PDF)</span>
                </h2>

                <div className="p-4 rounded-xl bg-slate-950 border border-dashed border-slate-700 hover:border-slate-500 transition-colors text-center space-y-3">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                  <div className="text-xs text-slate-300">
                    <label className="cursor-pointer text-emerald-400 hover:underline font-bold">
                      <span>Click to upload evidence file</span>
                      <input
                        type="file"
                        accept=".xlsx,.xls,.csv,.pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>{' '}
                    <span>or drag and drop</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Supports Excel (.xlsx, .xls, .csv) production summaries or third-party GHG audit statement (.pdf) up to 15MB.
                  </p>

                  {uploadingFile && (
                    <div className="text-xs text-emerald-400 font-mono flex items-center justify-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying document and calculating SHA-256...</span>
                    </div>
                  )}

                  {evidenceFileInfo && !uploadingFile && (
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-left text-xs font-mono">
                      <div className="text-emerald-300 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>{evidenceFileInfo.filename}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        SHA-256: {evidenceFileInfo.sha256}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Metallurgical Notes &amp; Verification Methodology
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Certified under ISO 14064 GHG audit for primary melting works."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Section 4: Submitter Sign-off */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>4. Respondent Sign-off &amp; Identification</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={respondentName}
                      onChange={(e) => setRespondentName(e.target.value)}
                      placeholder="e.g. Dr. P. Sen"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Designation / Department *
                    </label>
                    <input
                      type="text"
                      required
                      value={respondentDesignation}
                      onChange={(e) => setRespondentDesignation(e.target.value)}
                      placeholder="e.g. Head of Decarbonization & Energy"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Professional Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={respondentEmail}
                      onChange={(e) => setRespondentEmail(e.target.value)}
                      placeholder="e.g. p.sen@tatasteel.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Contact Phone (WhatsApp / Mobile)
                    </label>
                    <input
                      type="tel"
                      value={respondentPhone}
                      onChange={(e) => setRespondentPhone(e.target.value)}
                      placeholder="e.g. +91 98301 12233"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="text-xs text-slate-400">
                  {draftSavedMsg && (
                    <span className="text-emerald-400 font-mono flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{draftSavedMsg}</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={isSavingDraft}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSavingDraft ? 'Saving...' : 'Save Draft'}</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Precursor Declaration</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-400">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Prepared with HeatLedger AI · EU CBAM Precursor Verification</span>
          <span className="text-emerald-400 font-mono">Regulation (EU) 2023/956 Compliant</span>
        </div>
      </footer>
    </div>
  );
};

export default SupplierRequestPage;
