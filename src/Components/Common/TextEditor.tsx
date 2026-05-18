import  { useState } from "react";
import { Copy, Check, Download, Trash2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

type TextEditorProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  warningLength?: number;
  warningMessage?: string;
  showCopy?: boolean;
  showDownload?: boolean;
  showClear?: boolean;
  downloadFileName?: string;
  className?: string;
  fontFamily?: "sans" | "mono";
};

export const TextEditor = ({
  label,
  value,
  onChange,
  placeholder = "Type your content here...",
  rows = 10,
  maxLength,
  warningLength,
  warningMessage = "Character limit exceeded for optimized social posting.",
  showCopy = true,
  showDownload = true,
  showClear = true,
  downloadFileName = "document.txt",
  className = "",
  fontFamily = "sans",
}: TextEditorProps) => {
  const [copied, setCopied] = useState(false);

  // Copy to clipboard helper
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Text copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy text.");
    }
  };

  // Download text file helper
  const handleDownload = () => {
    try {
      const element = document.createElement("a");
      const file = new Blob([value], { type: "text/plain;charset=utf-8" });
      element.href = URL.createObjectURL(file);
      element.download = downloadFileName;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success("File downloaded successfully!");
    } catch (err) {
      toast.error("Failed to download file.");
    }
  };

  // Clear text helper
  const handleClear = () => {
    onChange("");
    toast.success("Editor cleared!");
  };

  const isWarningActive = warningLength && value.length > warningLength;

  return (
    <div className={`w-full flex flex-col gap-2 ${className}`}>
      {/* Label and Actions Header */}
      {(label || showCopy || showDownload || showClear) && (
        <div className="flex items-center justify-between min-h-[36px] flex-wrap gap-2">
          {label && (
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">
              {label}
            </label>
          )}

          {/* Quick Action Toolbar */}
          <div className="flex items-center gap-1.5 ml-auto">
            {showClear && value && (
              <button
                type="button"
                onClick={handleClear}
                className="p-2 rounded-lg border border-slate-100 bg-white hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 text-slate-400 transition-all shadow-sm"
                title="Clear Content"
              >
                <Trash2 size={13} />
              </button>
            )}
            
            {showDownload && value && (
              <button
                type="button"
                onClick={handleDownload}
                className="p-2 rounded-lg border border-slate-100 bg-white hover:bg-slate-50 text-slate-500 hover:text-primary transition-all shadow-sm"
                title="Download Draft Text (.txt)"
              >
                <Download size={13} />
              </button>
            )}

            {showCopy && value && (
              <button
                type="button"
                onClick={handleCopy}
                className="px-3.5 py-1.5 rounded-lg border border-slate-100 bg-white text-slate-500 hover:bg-slate-50 hover:text-primary transition-all shadow-sm flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider"
              >
                {copied ? (
                  <Check size={13} className="text-emerald-500" />
                ) : (
                  <Copy size={13} />
                )}
                {copied ? "Copied" : "Copy"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Textarea Container */}
      <div className="relative w-full">
        <textarea
          value={value}
          onChange={(e) => {
            if (maxLength && e.target.value.length > maxLength) return;
            onChange(e.target.value);
          }}
          placeholder={placeholder}
          rows={rows}
          className={`w-full p-5 rounded-2xl border transition-all shadow-inner focus:outline-none focus:ring-2 focus:border-primary/50 focus:ring-primary/10
            ${fontFamily === "mono" ? "font-mono" : "font-sans"}
            ${
              isWarningActive
                ? "border-amber-200 bg-amber-50/5 text-slate-700"
                : "border-slate-100 bg-white text-slate-700"
            }
            text-sm leading-relaxed resize-none
          `}
        />

        {/* Counter Overlay */}
        <div className="absolute right-4 bottom-4 text-[9px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 select-none">
          {value.length}
          {maxLength ? ` / ${maxLength}` : ""} Characters
        </div>
      </div>

      {/* Warn alerts */}
      {isWarningActive && (
        <div className="flex items-start gap-2 p-3.5 bg-amber-50 rounded-xl border border-amber-100 text-amber-800 text-[11px] font-bold leading-normal animate-fade-in shadow-sm">
          <AlertCircle size={15} className="shrink-0 text-amber-600 mt-0.5" />
          <span>{warningMessage} (Length: {value.length} characters)</span>
        </div>
      )}
    </div>
  );
};
