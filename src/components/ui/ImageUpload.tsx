import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, X, FileImage, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  value?: string; // Cloudinary URL
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label = 'Featured Image' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPEG, JPG, PNG, GIF, and WEBP image formats are allowed.');
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File size exceeds the 5MB limit.');
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading('Uploading image to Cloudinary...');

    try {
      const data = await api.uploadMedia(file);
      onChange(data.url);
      toast.success('Image uploaded successfully!', { id: toastId });
    } catch (error: any) {
      toast.error(error.message || 'Image upload failed.', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleClear = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-brand-text-muted uppercase tracking-wider">
        {label}
      </label>

      {value ? (
        // Preview Frame
        <div className="relative rounded-2xl overflow-hidden border border-brand-border/30 bg-[#0D2538]/40 aspect-video group shadow-lg">
          <img 
            src={value} 
            alt="Preview" 
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-full bg-brand-cyan/20 border border-brand-cyan text-brand-cyan hover:bg-brand-cyan hover:text-[#071A26] transition-all"
              title="Replace Image"
              disabled={isUploading}
            >
              <RefreshCw size={18} className={isUploading ? 'animate-spin' : ''} />
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="p-2.5 rounded-full bg-red-500/20 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all"
              title="Remove Image"
              disabled={isUploading}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      ) : (
        // Upload Drag & Drop Box
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 h-44 ${
            isDragOver 
              ? 'border-brand-cyan bg-brand-cyan/5 shadow-cyan-glow' 
              : 'border-brand-border/30 bg-[#0D2538]/30 hover:border-brand-cyan/50 hover:bg-brand-card/25'
          }`}
        >
          {isUploading ? (
            <div className="space-y-3 flex flex-col items-center">
              <RefreshCw size={36} className="text-brand-cyan animate-spin" />
              <p className="text-sm font-semibold text-brand-cyan">Uploading Asset...</p>
            </div>
          ) : (
            <div className="space-y-2 flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-brand-cyan/10 border border-brand-cyan/25 flex items-center justify-center text-brand-cyan mb-2 shadow-cyan-glow">
                <Upload size={20} />
              </div>
              <p className="text-sm font-semibold text-brand-text-white">
                Drag & drop or <span className="text-brand-cyan hover:underline">browse</span>
              </p>
              <p className="text-[10px] text-brand-text-muted font-medium">
                Supports JPG, JPEG, PNG, WEBP, GIF (Max 5MB)
              </p>
            </div>
          )}
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
}
