import React, { useState } from 'react';
import { Upload, FileImage, CheckCircle2, AlertCircle } from 'lucide-react';
import { syntheticCases } from '../data/syntheticCases';

export default function ImageUploadDropzone({ onFileSelected, onCaseSelect, selectedCaseId }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      onFileSelected(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onFileSelected(file);
    }
  };

  return (
    <div className="clinical-card p-6 bg-white text-slate-900 border-slate-200 space-y-6 shadow-sm">
      
      {/* Central Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center space-y-3 group ${
          isDragging
            ? 'border-sky-500 bg-sky-50 shadow-lg shadow-sky-100'
            : 'border-slate-300 bg-slate-50 hover:bg-white hover:border-sky-400'
        }`}
        onClick={() => document.getElementById('dropzone-file-input')?.click()}
      >
        <input
          id="dropzone-file-input"
          type="file"
          accept="image/*,.dcm,.dicom"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="w-16 h-16 rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shadow-sm group-hover:bg-sky-100 group-hover:border-sky-300 transition-colors">
          <Upload className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Drag & Drop Knee Radiograph / DICOM Image Here
          </h3>
          <p className="text-xs text-slate-500 font-mono">
            Or <span className="text-sky-600 font-semibold underline">click to browse local files</span> on your computer
          </p>
        </div>

        <div className="flex items-center space-x-3 text-[11px] text-slate-500 font-mono pt-1">
          <span>Supported: DICOM (.dcm), PNG, JPG, WEBP</span>
          <span>•</span>
          <span>Max File Size: 50MB</span>
        </div>
      </div>

    </div>
  );
}
