import { useEffect, useState } from 'react';
import { 
  Upload, X, Link as LinkIcon, Trash2, RefreshCw, 
  ChevronLeft, ChevronRight, FileImage, Image as ImageIcon, Copy
} from 'lucide-react';
import { api } from '../../services/api';
import { Media } from '../../types';
import toast from 'react-hot-toast';

export default function MediaLibraryPage() {
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await api.getMedia(page, 12);
      setMediaList(res.media);
      setTotalPages(res.pagination.pages);
      setTotalItems(res.pagination.total);
    } catch (error) {
      // toast shown in api helper
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [page]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Limit to 5MB
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size exceeds the 5MB limit.');
        return;
      }

      setIsUploading(true);
      const toastId = toast.loading('Uploading asset to Cloudinary...');
      try {
        await api.uploadMedia(file);
        toast.success('Asset uploaded successfully!', { id: toastId });
        setPage(1);
        fetchMedia();
      } catch (error: any) {
        toast.error(error.message || 'Upload failed.', { id: toastId });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to permanently delete the image "${name}" from Cloudinary?`)) {
      try {
        await api.deleteMedia(id);
        toast.success('Asset deleted successfully.');
        fetchMedia();
      } catch (error) {
        // toast shown in api helper
      }
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Image link copied to clipboard!');
  };

  // Convert size to human readable
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6 sm:p-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text-white tracking-tight">
            Media Library
          </h1>
          <p className="text-sm text-brand-text-muted font-medium mt-1">
            Upload and copy links for images stored in Cloudinary.
          </p>
        </div>

        {/* Upload Button wrapper */}
        <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-cyan bg-brand-cyan/10 text-brand-cyan font-bold text-sm shadow-cyan-glow hover:bg-brand-cyan hover:text-[#071A26] transition-all cursor-pointer self-start sm:self-center">
          {isUploading ? (
            <RefreshCw size={16} className="animate-spin" />
          ) : (
            <Upload size={16} />
          )}
          <span>Upload Image</span>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileUpload}
            disabled={isUploading}
          />
        </label>
      </div>

      {/* Grid view of media assets */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="animate-spin text-brand-cyan" size={28} />
          <span className="text-xs font-semibold text-brand-text-muted">Loading assets...</span>
        </div>
      ) : mediaList.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {mediaList.map((media) => (
              <div 
                key={media._id}
                className="group relative border border-brand-border/10 rounded-2xl bg-[#0D2538]/20 overflow-hidden shadow-md flex flex-col hover:border-brand-cyan/20 transition-all duration-300 h-56"
              >
                {/* Image Frame */}
                <div className="flex-1 bg-[#071A26]/50 overflow-hidden relative">
                  <img 
                    src={media.url} 
                    alt={media.filename} 
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
                  />
                  
                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleCopyLink(media.url)}
                      className="p-2.5 rounded-xl bg-brand-cyan/20 border border-brand-cyan text-brand-cyan hover:bg-brand-cyan hover:text-[#071A26] transition-all"
                      title="Copy URL"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(media._id, media.filename)}
                      className="p-2.5 rounded-xl bg-red-500/20 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                      title="Delete Image"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Footer details inside card */}
                <div className="p-3 bg-[#0D2538]/70 border-t border-brand-border/10 space-y-0.5">
                  <p className="text-[11px] font-bold text-brand-text-white truncate" title={media.filename}>
                    {media.filename}
                  </p>
                  <div className="flex justify-between items-center text-[9px] text-brand-text-muted font-bold">
                    <span>{formatBytes(media.size)}</span>
                    <span className="uppercase">{media.mimeType.split('/')[1]}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Paging */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-brand-border/10 pt-4">
              <span className="text-xs font-bold text-brand-text-muted">
                Showing {mediaList.length} of {totalItems} assets
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="p-2 border border-brand-border/20 text-brand-text-muted hover:text-brand-cyan bg-[#071A26]/40 rounded-xl transition-colors disabled:opacity-30"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="p-2 border border-brand-border/20 text-brand-text-muted hover:text-brand-cyan bg-[#071A26]/40 rounded-xl transition-colors disabled:opacity-30"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#0D2538]/20 border border-brand-border/10 rounded-2xl">
          <ImageIcon size={40} className="text-brand-text-muted mx-auto mb-3" />
          <p className="text-sm font-semibold text-brand-text-white">Media Library is empty</p>
          <p className="text-xs text-brand-text-muted mt-1">Upload files to Cloudinary for your lesson templates.</p>
        </div>
      )}

    </div>
  );
}
