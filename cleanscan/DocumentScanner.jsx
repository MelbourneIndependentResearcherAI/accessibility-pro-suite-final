import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, Sparkles, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { AIService } from '@/components/ai/AIService';

export default function DocumentScanner({ onScanComplete }) {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedDoc, setScannedDoc] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setImageUrl(file_url);

      // Extract text using OCR
      const ocrResult = await base44.integrations.Core.InvokeLLM({
        prompt: 'Extract all text from this document image. Include handwritten text if present. Preserve the structure and formatting as much as possible.',
        file_urls: [file_url]
      });

      // Analyze document
      const analysis = await AIService.analyzeDocument(ocrResult, file_url);

      const docData = {
        file_url,
        extracted_text: ocrResult,
        document_type: analysis.document_type,
        key_info: analysis.key_info,
        summary: analysis.summary,
        tags: analysis.tags,
        suggested_folder: analysis.suggested_folder
      };

      setScannedDoc(docData);

      if (onScanComplete) {
        onScanComplete(docData);
      }
    } catch (error) {
      console.error('Error scanning document:', error);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />

      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
        {imageUrl ? (
          <div className="mb-4">
            <img src={imageUrl} alt="Scanned document" className="w-full rounded-2xl" />
          </div>
        ) : (
          <div className="aspect-[4/3] bg-blue-900/50 rounded-2xl flex items-center justify-center mb-4">
            <FileText className="w-24 h-24 text-white/40" />
          </div>
        )}

        {isScanning && (
          <div className="text-center py-6">
            <Sparkles className="w-12 h-12 text-white animate-pulse mx-auto mb-4" />
            <p className="text-white font-medium">Scanning & analyzing document...</p>
            <p className="text-white/70 text-sm mt-2">Using AI OCR with handwriting recognition</p>
          </div>
        )}

        {scannedDoc && !isScanning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-white rounded-xl p-4 text-slate-900">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg">Document Analysis</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-sm font-medium">
                  {scannedDoc.document_type}
                </span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Summary</p>
                  <p className="text-sm">{scannedDoc.summary}</p>
                </div>

                {scannedDoc.key_info && (
                  <>
                    {scannedDoc.key_info.dates?.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-slate-600 mb-1">Dates</p>
                        <p className="text-sm">{scannedDoc.key_info.dates.join(', ')}</p>
                      </div>
                    )}
                    {scannedDoc.key_info.amounts?.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-slate-600 mb-1">Amounts</p>
                        <p className="text-sm">{scannedDoc.key_info.amounts.join(', ')}</p>
                      </div>
                    )}
                  </>
                )}

                {scannedDoc.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {scannedDoc.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-slate-100 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Button className="w-full bg-white text-blue-600 hover:bg-slate-100">
              <Download className="w-4 h-4 mr-2" />
              Save to {scannedDoc.suggested_folder}
            </Button>
          </motion.div>
        )}

        {!scannedDoc && !isScanning && (
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-white text-blue-600 hover:bg-slate-100"
            >
              <Camera className="w-5 h-5 mr-2" />
              Scan Document
            </Button>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}