import React, { useState, useEffect } from 'react';
import { implantDatabase } from '../data/implantDatabase';
import { Search, CheckCircle2, Filter, ChevronLeft, ChevronRight, Info } from 'lucide-react';

export default function ImplantTable({ activeMatch, activeCase }) {
  const [search, setSearch] = useState('');
  const [manufacturerFilter, setManufacturerFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 10;
  const manufacturers = ['All', 'Stryker', 'Zimmer Biomet', 'DePuy Synthes', 'Smith & Nephew'];

  const patientBone = activeCase?.measurements?.bone;

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, manufacturerFilter]);

  // Sort and filter implants, ensuring active matched item is prioritized at top of list
  const filteredImplants = implantDatabase.filter((imp) => {
    const matchesSearch =
      imp.manufacturer.toLowerCase().includes(search.toLowerCase()) ||
      imp.model.toLowerCase().includes(search.toLowerCase()) ||
      imp.femoralSize.toLowerCase().includes(search.toLowerCase());
    const matchesMfr = manufacturerFilter === 'All' || imp.manufacturer === manufacturerFilter;
    return matchesSearch && matchesMfr;
  }).sort((a, b) => {
    if (!activeMatch) return 0;
    const isAMatch = activeMatch.implant?.manufacturer === a.manufacturer && activeMatch.implant?.femoralSize === a.femoralSize;
    const isBMatch = activeMatch.implant?.manufacturer === b.manufacturer && activeMatch.implant?.femoralSize === b.femoralSize;
    if (isAMatch && !isBMatch) return -1;
    if (!isAMatch && isBMatch) return 1;
    return 0;
  });

  const totalPages = Math.ceil(filteredImplants.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedImplants = filteredImplants.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="clinical-card overflow-hidden space-y-3">
      
      {/* Table Header Controls */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-slate-900 text-xs tracking-tight">
              Standardized TKA Implant Dimension Catalog & Sizing Deltas
            </h3>
            {patientBone && (
              <span className="text-[10px] font-mono font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                Patient Target: Femur {patientBone.femoralCondyleWidthMm} mm / Tibia {patientBone.tibialPlateauWidthMm} mm
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 pt-0.5">
            Compares patient native bone dimensions against physical manufacturer implant sizes (10 items per page).
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
            <input
              type="text"
              placeholder="Search model or size..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800 w-44 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          {/* Manufacturer Filter */}
          <div className="flex items-center space-x-1 bg-white border border-slate-300 rounded px-2 py-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={manufacturerFilter}
              onChange={(e) => setManufacturerFilter(e.target.value)}
              className="bg-transparent text-slate-800 focus:outline-none text-xs"
            >
              {manufacturers.map((mfr) => (
                <option key={mfr} value={mfr}>
                  {mfr}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[10px] tracking-wider font-mono">
              <th className="py-2.5 px-4">Manufacturer</th>
              <th className="py-2.5 px-4">Model System</th>
              <th className="py-2.5 px-4">Implant Size</th>
              <th className="py-2.5 px-4">Brand Femur Width</th>
              <th className="py-2.5 px-4">Femur Δ vs Knee</th>
              <th className="py-2.5 px-4">Brand Tibia Width</th>
              <th className="py-2.5 px-4">Tibia Δ vs Knee</th>
              <th className="py-2.5 px-4">Total Fit Deviation</th>
              <th className="py-2.5 px-4 text-right">Match Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
            {displayedImplants.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-6 text-center text-slate-400 font-sans text-xs">
                  No matching implant components found for current search/filter criteria.
                </td>
              </tr>
            ) : (
              displayedImplants.map((imp) => {
                const isMatched =
                  activeMatch &&
                  activeMatch.implant?.manufacturer === imp.manufacturer &&
                  activeMatch.implant?.femoralSize === imp.femoralSize;

                // Calculate exact dimensional differences vs patient's uploaded knee radiograph
                let femDiff = 0;
                let tibDiff = 0;
                let fitDevMm = 0;

                if (patientBone) {
                  femDiff = parseFloat((imp.femoralWidthMm - patientBone.femoralCondyleWidthMm).toFixed(1));
                  tibDiff = parseFloat((imp.tibialWidthMm - patientBone.tibialPlateauWidthMm).toFixed(1));
                  
                  const dFW = Math.pow(imp.femoralWidthMm - patientBone.femoralCondyleWidthMm, 2);
                  const dTW = Math.pow(imp.tibialWidthMm - patientBone.tibialPlateauWidthMm, 2);
                  const dFA = Math.pow(imp.femoralApMm - patientBone.femoralApMm, 2);
                  const dTA = Math.pow(imp.tibialApMm - patientBone.tibialApMm, 2);
                  fitDevMm = parseFloat(Math.sqrt(dFW + dTW + dFA + dTA).toFixed(2));
                }

                return (
                  <tr
                    key={imp.id}
                    className={`transition-colors ${
                      isMatched ? 'bg-teal-50/80 font-semibold border-l-4 border-l-teal-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Manufacturer */}
                    <td className="py-2.5 px-4 font-sans font-medium text-slate-900">{imp.manufacturer}</td>
                    
                    {/* Model */}
                    <td className="py-2.5 px-4 font-sans text-slate-700">{imp.model}</td>
                    
                    {/* Size */}
                    <td className="py-2.5 px-4 font-bold text-sky-900">
                      Femoral {imp.femoralSize} / Tibial {imp.tibialSize}
                    </td>
                    
                    {/* Brand Femur Component Width */}
                    <td className="py-2.5 px-4 text-slate-700 font-bold">
                      {imp.femoralWidthMm} mm
                    </td>

                    {/* Femur Size Diff vs Knee Target */}
                    <td className="py-2.5 px-4">
                      {patientBone ? (
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                          Math.abs(femDiff) <= 1.0
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : femDiff > 1.0
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-sky-50 text-sky-800 border-sky-200'
                        }`}>
                          {femDiff > 0 ? `+${femDiff} mm (Wider)` : femDiff < 0 ? `${femDiff} mm (Narrower)` : '0.0 mm (Exact)'}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">—</span>
                      )}
                    </td>

                    {/* Brand Tibia Component Width */}
                    <td className="py-2.5 px-4 text-slate-700 font-bold">
                      {imp.tibialWidthMm} mm
                    </td>

                    {/* Tibia Size Diff vs Knee Target */}
                    <td className="py-2.5 px-4">
                      {patientBone ? (
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                          Math.abs(tibDiff) <= 1.0
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : tibDiff > 1.0
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-sky-50 text-sky-800 border-sky-200'
                        }`}>
                          {tibDiff > 0 ? `+${tibDiff} mm (Wider)` : tibDiff < 0 ? `${tibDiff} mm (Narrower)` : '0.0 mm (Exact)'}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">—</span>
                      )}
                    </td>

                    {/* Total Fit Deviation */}
                    <td className="py-2.5 px-4 font-bold text-slate-800">
                      {patientBone ? (
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          isMatched ? 'text-teal-900 bg-teal-100 border border-teal-300 font-extrabold' : 'text-slate-700'
                        }`}>
                          {fitDevMm} mm
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">—</span>
                      )}
                    </td>

                    {/* Match Status */}
                    <td className="py-2.5 px-4 text-right">
                      {isMatched ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-teal-600 text-white font-sans font-semibold shadow-xs">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          NEAREST MATCH
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">Reference</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-sans">
        <span className="text-[11px] font-mono text-slate-500">
          Showing {filteredImplants.length === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredImplants.length)} of {filteredImplants.length} items
        </span>

        {totalPages > 1 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded border border-slate-300 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-slate-700" />
            </button>

            <span className="text-[11px] font-mono font-semibold px-2 text-slate-700">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded border border-slate-300 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
