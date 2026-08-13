import React, { useState, useEffect } from 'react';
import { removeImageBackground, BgRemovalOptions } from '../utils/bgRemover';
import { 
  Upload, 
  Wand2, 
  Sliders, 
  Check, 
  RefreshCw, 
  Image as ImageIcon, 
  ZoomIn, 
  Move,
  Palette,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';

interface PhotoCutoutEditorProps {
  currentPhotoUrl: string;
  currentColor: string;
  onApplyPhoto: (processedDataUrl: string, bgColor: string, originalUrl?: string) => void;
  onClose?: () => void;
}

export const PhotoCutoutEditor: React.FC<PhotoCutoutEditorProps> = ({
  currentPhotoUrl,
  currentColor,
  onApplyPhoto,
  onClose,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string>(currentPhotoUrl || '');
  const [originalPhoto, setOriginalPhoto] = useState<string>(currentPhotoUrl || '');
  const [processedPhoto, setProcessedPhoto] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Controls state
  const [threshold, setThreshold] = useState<number>(38);
  const [bgColor, setBgColor] = useState<string>(currentColor || '#C81E45');
  const [scale, setScale] = useState<number>(1.05);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);

  // Preset background colors
  const BG_COLOR_PRESETS = [
    { label: 'Signature Crimson', hex: '#C81E45', badge: 'Reference Design' },
    { label: 'Forest Emerald', hex: '#0A3825', badge: 'VIP Pass' },
    { label: 'Bubblegum Pink', hex: '#FF85A2', badge: 'Staff' },
    { label: 'Obsidian Black', hex: '#000000', badge: 'Executive' },
    { label: 'Royal Blue', hex: '#1E3A8A', badge: 'Press' },
    { label: 'Transparent', hex: 'transparent', badge: 'Cutout' },
  ];

  // Process image whenever controls change
  useEffect(() => {
    let active = true;

    async function process() {
      if (!selectedPhoto) return;
      setIsProcessing(true);
      try {
        const result = await removeImageBackground(selectedPhoto, {
          threshold,
          outputBgColor: bgColor,
          isCircularCrop: true,
          scale,
          offsetX,
          offsetY,
        });
        if (active) {
          setProcessedPhoto(result);
        }
      } catch (err) {
        console.error('Background removal failed', err);
      } finally {
        if (active) setIsProcessing(false);
      }
    }

    const timer = setTimeout(process, 180);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [selectedPhoto, threshold, bgColor, scale, offsetX, offsetY]);

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setSelectedPhoto(url);
        setOriginalPhoto(url);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApply = () => {
    onApplyPhoto(processedPhoto || selectedPhoto, bgColor, originalPhoto);
    if (onClose) onClose();
  };

  return (
    <div className="bg-white text-[#1E293B] rounded-3xl p-6 shadow-sm border border-[#E2E8F0] max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D9F99D] text-[#0F172A] flex items-center justify-center font-bold shadow-sm">
            <Wand2 className="w-5 h-5 text-[#0F172A]" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#0F172A] flex items-center gap-2">
              Automatic Background Removal
              <span className="text-[10px] bg-[#0F172A] text-white px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Canvas Engine
              </span>
            </h2>
            <p className="text-xs text-[#64748B]">
              Isolate subject photo, remove original background, and apply signature circular framing.
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-[#64748B] hover:text-[#0F172A] text-xs font-bold px-3 py-1.5 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] transition-all"
          >
            Close
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
        {/* LEFT COLUMN: PREVIEW & SOURCE SELECTOR (5 cols) */}
        <div className="md:col-span-5 flex flex-col gap-4">
          {/* Main Cutout Preview */}
          <div className="relative bg-[#0F172A] text-white rounded-2xl p-6 border border-white/10 flex flex-col items-center justify-center min-h-[300px]">
            <p className="text-[11px] font-bold text-[#D9F99D] mb-3 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D9F99D]" />
              RESULTING BADGE PORTRAIT
            </p>

            {/* Circular Frame Preview */}
            <div className="relative w-48 h-48 rounded-full border-4 border-white/30 shadow-2xl overflow-hidden flex items-center justify-center bg-[#1E293B]">
              {isProcessing && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-20 flex flex-col items-center justify-center text-xs font-mono gap-2 text-[#D9F99D]">
                  <RefreshCw className="w-6 h-6 animate-spin text-[#D9F99D]" />
                  <span>Isolating Subject...</span>
                </div>
              )}

              {processedPhoto ? (
                <img
                  src={processedPhoto}
                  alt="Processed cutout"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={selectedPhoto}
                  alt="Selected photo"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span className="text-[11px] text-[#94A3B8]">Backdrop:</span>
              <span
                className="w-4 h-4 rounded-full border border-white/40 shadow-xs"
                style={{ backgroundColor: bgColor }}
              ></span>
              <span className="text-xs font-bold text-white uppercase">
                {BG_COLOR_PRESETS.find((p) => p.hex === bgColor)?.label || bgColor}
              </span>
            </div>
          </div>

          {/* Quick Preset Photos / Upload Trigger */}
          <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-[#E2E8F0]">
            <p className="text-xs font-bold text-[#0F172A] mb-2 flex items-center justify-between">
              <span>Upload Photo for ID Badge:</span>
              <span className="text-[10px] text-[#64748B]">JPG, PNG, WebP</span>
            </p>

            {/* Upload Button */}
            <label className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-xs cursor-pointer shadow-sm transition-all active:scale-95">
              <Upload className="w-4 h-4 text-[#D9F99D]" />
              <span>Upload Custom Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* RIGHT COLUMN: BACKGROUND & CUTOUT CONTROLS (7 cols) */}
        <div className="md:col-span-7 flex flex-col justify-between gap-5">
          {/* Backdrop Color Preset Picker */}
          <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-[#E2E8F0]">
            <h3 className="text-sm font-bold text-[#0F172A] mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#0F172A]" />
              Choose ID Badge Circle Frame Color
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {BG_COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.hex}
                  onClick={() => setBgColor(preset.hex)}
                  className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all text-left ${
                    bgColor === preset.hex
                      ? 'border-[#0F172A] bg-[#F1F5F9] ring-2 ring-[#0F172A]'
                      : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1]'
                  }`}
                >
                  <span
                    className="w-6 h-6 rounded-full border border-[#CBD5E1] shadow-xs flex-shrink-0"
                    style={{ backgroundColor: preset.hex === 'transparent' ? '#18181B' : preset.hex }}
                  ></span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#0F172A] truncate">{preset.label}</p>
                    <span className="text-[9px] text-[#64748B] font-semibold">{preset.badge}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-[#64748B]">
              <Info className="w-4 h-4 text-[#0F172A]" />
              <span>Applies background removal with high-res circular framing</span>
            </div>

            <button
              onClick={handleApply}
              disabled={isProcessing}
              className="px-6 py-3 rounded-full bg-[#D9F99D] hover:bg-[#bef264] text-[#0F172A] font-bold text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              <Check className="w-4 h-4 text-[#0F172A]" />
              <span>Apply Photo to Badge</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
