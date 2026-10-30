import { useEditor, EditorContent, ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import { Node, mergeAttributes } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import TextAlign from '@tiptap/extension-text-align';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { useEffect, useRef, useState } from 'react';
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  List, ListOrdered, Code, Quote, Plus, 
  Undo, Redo, Heading1, Heading2, Heading3, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link as LinkIcon, Image as ImageIcon, Grid3X3, Minus,
  Upload, RefreshCw, Cpu, Eye, X, CornerDownLeft,
  Folder, FileImage, Check, Youtube, Play, Video, Lightbulb
} from 'lucide-react';
import { api } from '../../services/api';
import { extractYouTubeId, getYouTubeThumbnail } from '../../utils/youtube';
import toast from 'react-hot-toast';

const lowlight = createLowlight(common);

// Extended CodeBlock with seamless exit shortcuts to normal paragraph text
const CustomCodeBlockLowlight = CodeBlockLowlight.extend({
  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      // Mod-Enter / Shift-Enter exits code block and inserts a normal paragraph below
      'Mod-Enter': () => {
        return this.editor.commands.exitCode();
      },
      'Shift-Enter': () => {
        return this.editor.commands.exitCode();
      },
      // Enter on an empty line at the end of the code block exits to a normal paragraph
      'Enter': ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from, empty } = selection;

        if (!empty) return false;

        // If code block is completely blank, convert it to a normal paragraph
        if ($from.parent.textContent === '') {
          return editor.chain().setParagraph().run();
        }

        // If cursor is at the end of code block and ends with a newline (i.e. double Enter)
        const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2;
        if (isAtEnd) {
          const text = $from.parent.textContent;
          if (text.endsWith('\n')) {
            return editor
              .chain()
              .command(({ tr }) => {
                tr.delete($from.pos - 1, $from.pos);
                return true;
              })
              .exitCode()
              .run();
          }
        }

        return false;
      },
      // ArrowDown at the end of a code block moves into or creates a paragraph below
      'ArrowDown': ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from, empty } = selection;

        if (!empty) return false;

        const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2;
        if (!isAtEnd) return false;

        const parentDepth = $from.depth;
        const isLastChild = $from.index(parentDepth - 1) === $from.node(parentDepth - 1).childCount - 1;

        if (isLastChild) {
          const pos = $from.after(parentDepth);
          return editor
            .chain()
            .insertContentAt(pos, { type: 'paragraph' })
            .setTextSelection(pos + 1)
            .focus()
            .run();
        }

        return false;
      },
    };
  },
});

// Extended Image extension ensuring easy escape to normal text
const CustomImage = Image.extend({
  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      // Pressing Enter on a selected image creates a normal paragraph below it
      'Enter': ({ editor }) => {
        const { state } = editor;
        const selection = state.selection as any;
        if (selection.node && selection.node.type.name === 'image') {
          const pos = selection.to;
          return editor
            .chain()
            .insertContentAt(pos, { type: 'paragraph' })
            .setTextSelection(pos + 1)
            .focus()
            .run();
        }
        return false;
      },
      // ArrowDown on a selected image at the end of the doc inserts a paragraph below
      'ArrowDown': ({ editor }) => {
        const { state } = editor;
        const selection = state.selection as any;
        if (selection.node && selection.node.type.name === 'image') {
          const isAtDocEnd = selection.to >= state.doc.content.size - 1;
          if (isAtDocEnd) {
            const pos = selection.to;
            return editor
              .chain()
              .insertContentAt(pos, { type: 'paragraph' })
              .setTextSelection(pos + 1)
              .focus()
              .run();
          }
        }
        return false;
      },
    };
  },
});

// Custom YouTube Node View for the editor
const YoutubeNodeView = ({ node, deleteNode }: any) => {
  const { videoId, src } = node.attrs;
  const thumbUrl = videoId ? getYouTubeThumbnail(videoId, 'hq') : '';

  return (
    <NodeViewWrapper className="my-6">
      <div className="relative rounded-2xl border border-red-500/30 bg-[#071A26] overflow-hidden shadow-2xl group max-w-full">
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-brand-border/20 bg-[#0D2538]/70 text-xs select-none">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-red-600 flex items-center justify-center text-white shadow-sm">
              <Youtube size={13} />
            </div>
            <span className="font-bold text-brand-text-white">YouTube Video Tutorial</span>
          </div>
          <button
            type="button"
            onClick={deleteNode}
            className="px-2 py-0.5 text-brand-text-muted hover:text-red-400 hover:bg-red-500/10 rounded transition-colors text-xs font-semibold flex items-center gap-1 border border-brand-border/20"
            title="Remove Video"
          >
            <X size={13} />
            <span>Remove</span>
          </button>
        </div>

        {/* Thumbnail Preview */}
        <div className="relative aspect-video w-full max-h-[380px] bg-black flex items-center justify-center overflow-hidden">
          {thumbUrl ? (
            <img 
              src={thumbUrl} 
              alt="YouTube Thumbnail" 
              className="w-full h-full object-cover opacity-85" 
            />
          ) : (
            <div className="text-brand-text-muted text-xs">Video Preview</div>
          )}
          {/* Centered Play Button */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
            <div className="w-16 h-11 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/40">
              <Play size={22} className="fill-white ml-0.5 text-white" />
            </div>
          </div>
          <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-black/80 backdrop-blur-sm text-[11px] font-mono text-brand-text-muted border border-white/10 max-w-[80%] truncate">
            {src}
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
};

const CustomYoutube = Node.create({
  name: 'youtube',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      videoId: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-youtube-video]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-youtube-video': '' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(YoutubeNodeView);
  },

  addKeyboardShortcuts() {
    return {
      'Enter': ({ editor }) => {
        const { state } = editor;
        const selection = state.selection as any;
        if (selection.node && selection.node.type.name === 'youtube') {
          const pos = selection.to;
          return editor
            .chain()
            .insertContentAt(pos, { type: 'paragraph' })
            .setTextSelection(pos + 1)
            .focus()
            .run();
        }
        return false;
      },
      'ArrowDown': ({ editor }) => {
        const { state } = editor;
        const selection = state.selection as any;
        if (selection.node && selection.node.type.name === 'youtube') {
          const isAtDocEnd = selection.to >= state.doc.content.size - 1;
          if (isAtDocEnd) {
            const pos = selection.to;
            return editor
              .chain()
              .insertContentAt(pos, { type: 'paragraph' })
              .setTextSelection(pos + 1)
              .focus()
              .run();
          }
        }
        return false;
      },
    };
  },
});

// Custom Highlighted Note / Callout Node Extension
const CustomNote = Node.create({
  name: 'note',
  group: 'block',
  content: 'block+',
  defining: true,

  parseHTML() {
    return [
      {
        tag: 'div[data-type="highlighted-note"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'highlighted-note',
        class: 'highlighted-note-block',
      }),
      0,
    ];
  },

  addKeyboardShortcuts() {
    return {
      'Shift-Enter': ({ editor }) => {
        const { state } = editor;
        const depth = Math.min(state.selection.$to.depth, 1);
        const pos = state.selection.$to.after(depth);
        return editor
          .chain()
          .insertContentAt(pos, { type: 'paragraph' })
          .setTextSelection(pos + 1)
          .focus()
          .run();
      },
      'Mod-Enter': ({ editor }) => {
        const { state } = editor;
        const depth = Math.min(state.selection.$to.depth, 1);
        const pos = state.selection.$to.after(depth);
        return editor
          .chain()
          .insertContentAt(pos, { type: 'paragraph' })
          .setTextSelection(pos + 1)
          .focus()
          .run();
      },
    };
  },
});

interface RichTextEditorProps {
  value?: any; // JSON representation
  onChange: (value: any) => void;
  simulationHtml?: string;
  onSimulationChange?: (html: string) => void;
  folder?: string;
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  simulationHtml = '', 
  onSimulationChange, 
  folder 
}: RichTextEditorProps) {
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showSimulationModal, setShowSimulationModal] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [showYoutubeModal, setShowYoutubeModal] = useState(false);
  const [youtubeInputUrl, setYoutubeInputUrl] = useState('');
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [simCode, setSimCode] = useState(simulationHtml || '');
  const [previewTab, setPreviewTab] = useState<'editor' | 'preview'>('editor');
  const imageInputRef = useRef<HTMLInputElement>(null);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // disable default to use lowlight
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-brand-cyan hover:underline cursor-pointer',
        },
      }),
      CustomImage.configure({
        HTMLAttributes: {
          class: 'rounded-2xl w-full max-h-[85vh] object-contain mx-auto my-6 border border-brand-border/25 shadow-xl block',
        },
      }),
      CustomYoutube,
      CustomNote,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse w-full my-6 text-sm text-brand-text-white border border-brand-border/30 rounded-lg overflow-hidden',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'bg-[#0D2538] border border-brand-border/30 font-bold p-3 text-left',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-brand-border/20 p-3 bg-brand-card/40',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      CustomCodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'bg-[#071A26] border border-brand-border/30 rounded-xl p-4 my-6 font-mono text-xs text-brand-cyan overflow-x-auto shadow-inner select-text',
        },
      }),
    ],
    content: value || { type: 'doc', content: [] },
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-cyan max-w-none focus:outline-none min-h-[350px] p-6 text-brand-text-white select-text text-sm leading-relaxed',
      },
      transformPastedText(text) {
        let cleaned = text.replace(/\r\n/g, '\n');
        
        // Fix line-broken words across newlines e.g. "G\nraph" -> "Graph", "inter-\nactive" -> "interactive"
        cleaned = cleaned.replace(/-\n+([a-z])/g, '$1');
        cleaned = cleaned.replace(/\b([A-Za-z])\n+([a-z])/g, '$1$2');

        // Fix line-broken sentences e.g. "Queue : It\n\nis" -> "Queue : It is"
        cleaned = cleaned.replace(/([^\.\?!:\n])\n+([a-z])/g, '$1 $2');

        // Fix short labels ending in colon followed by newline e.g. "Heap :\n\nA heap" -> "Heap : A heap"
        cleaned = cleaned.replace(/([A-Za-z0-9\s]{2,40}:)\n+([A-Za-z])/g, '$1 $2');

        // Collapse any remaining 3+ consecutive newlines to 2 (standard paragraph break)
        cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

        return cleaned;
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  });

  // Keep editor content in sync when value changes from outside (e.g. on reset/loaded)
  useEffect(() => {
    if (editor && value && JSON.stringify(editor.getJSON()) !== JSON.stringify(value)) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  // Keep simulation code in sync with prop changes
  useEffect(() => {
    setSimCode(simulationHtml || '');
  }, [simulationHtml]);

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  // Safely insert image, keeping it visible and ensuring a new paragraph is below for continued typing
  const insertImageSafely = (imageUrl: string) => {
    if (!editor || !imageUrl) return;

    // If currently inside a code block, exit it first to prevent schema rejection
    if (editor.isActive('codeBlock')) {
      editor.chain().exitCode().run();
    }

    // 1. Insert image node and commit transaction
    editor
      .chain()
      .focus()
      .setImage({ src: imageUrl })
      .run();

    // 2. Insert a clean paragraph right below the image and set cursor inside it
    try {
      const pos = editor.state.selection.to;
      editor
        .chain()
        .insertContentAt(pos, { type: 'paragraph' })
        .setTextSelection(pos + 1)
        .focus()
        .run();
    } catch {
      editor.chain().focus('end').run();
    }
  };

  const addImage = () => {
    const url = window.prompt('Enter Image URL');
    if (url && url.trim()) {
      insertImageSafely(url.trim());
      toast.success('Image inserted with text line below!');
    }
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only image formats (PNG, JPG, WEBP, GIF) are allowed.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size exceeds the 5MB limit.');
        return;
      }

      setIsUploadingImage(true);
      const toastId = toast.loading('Uploading image to Cloudinary...');
      try {
        const data = await api.uploadMedia(file, folder);
        if (!data || !data.url) {
          throw new Error('Upload succeeded but no image URL was returned.');
        }
        insertImageSafely(data.url);
        toast.success('Image uploaded and inserted successfully!', { id: toastId });
      } catch (err: any) {
        toast.error(err.message || 'Image upload failed.', { id: toastId });
      } finally {
        setIsUploadingImage(false);
        if (imageInputRef.current) imageInputRef.current.value = '';
      }
    }
  };

  const openMediaModal = async () => {
    setShowMediaModal(true);
    setLoadingMedia(true);
    try {
      const res = await api.getMedia(1, 36, folder && folder !== 'all' ? folder : undefined);
      setMediaList(res.media || []);
    } catch (err: any) {
      toast.error('Could not fetch media library.');
    } finally {
      setLoadingMedia(false);
    }
  };

  const handleAddYoutube = () => {
    if (!editor || !youtubeInputUrl.trim()) return;
    const url = youtubeInputUrl.trim();
    const videoId = extractYouTubeId(url);
    if (!videoId) {
      toast.error('Invalid YouTube link. Please paste a valid YouTube URL.');
      return;
    }

    if (editor.isActive('codeBlock')) {
      editor.chain().exitCode().run();
    }

    editor
      .chain()
      .focus()
      .insertContent({
        type: 'youtube',
        attrs: {
          src: url,
          videoId: videoId
        }
      })
      .run();

    try {
      const pos = editor.state.selection.to;
      editor
        .chain()
        .insertContentAt(pos, { type: 'paragraph' })
        .setTextSelection(pos + 1)
        .focus()
        .run();
    } catch {
      editor.chain().focus('end').run();
    }

    setShowYoutubeModal(false);
    setYoutubeInputUrl('');
    toast.success('YouTube video added with thumbnail preview!');
  };

  const insertNoteBlock = () => {
    if (!editor) return;

    if (editor.isActive('note')) {
      editor.chain().focus().lift('note').run();
      return;
    }

    if (editor.isActive('codeBlock')) {
      editor.chain().exitCode().run();
    }

    editor
      .chain()
      .focus()
      .insertContent({
        type: 'note',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Important Note: Type your key takeaway or tip here...'
              }
            ]
          }
        ]
      })
      .focus()
      .run();
  };

  // Helper to immediately insert and focus a normal paragraph below the current block or image
  const insertParagraphBelow = () => {
    if (!editor) return;
    const { state } = editor;
    const selection = state.selection as any;

    if (selection.node && selection.node.type.name === 'image') {
      editor
        .chain()
        .insertContentAt(selection.to, { type: 'paragraph' })
        .setTextSelection(selection.to + 1)
        .focus()
        .run();
      return;
    }

    if (editor.isActive('codeBlock')) {
      editor.chain().exitCode().run();
      return;
    }

    if (editor.isActive('note')) {
      const depth = Math.min(selection.$to.depth, 1);
      const pos = selection.$to.after(depth);
      editor
        .chain()
        .insertContentAt(pos, { type: 'paragraph' })
        .setTextSelection(pos + 1)
        .focus()
        .run();
      return;
    }

    const depth = Math.min(selection.$to.depth, 1);
    const pos = selection.$to.after(depth);
    editor
      .chain()
      .insertContentAt(pos, { type: 'paragraph' })
      .setTextSelection(pos + 1)
      .focus()
      .run();
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    toast.success('Inserted a 3x3 Table');
  };

  // Helper styles for buttons
  const btnClass = (active: boolean) => 
    `p-2.5 rounded-lg border transition-all text-sm flex items-center justify-center font-medium ${
      active 
        ? 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan shadow-[0_0_10px_rgba(0,229,255,0.1)]' 
        : 'bg-transparent border-transparent text-brand-text-muted hover:text-white hover:bg-brand-card/60'
    }`;

  return (
    <div className="border border-brand-border/20 rounded-2xl bg-[#0D2538]/50 backdrop-blur-xl overflow-hidden shadow-2xl flex flex-col">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 p-3 bg-[#0D2538]/90 border-b border-brand-border/20">
        
        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={btnClass(editor.isActive('heading', { level: 1 }))}
          title="Heading 1"
        >
          <Heading1 size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={btnClass(editor.isActive('heading', { level: 2 }))}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={btnClass(editor.isActive('heading', { level: 3 }))}
          title="Heading 3"
        >
          <Heading3 size={16} />
        </button>
        
        <div className="h-6 w-px bg-brand-border/30 mx-1" />

        {/* Inline styles */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btnClass(editor.isActive('bold'))}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btnClass(editor.isActive('italic'))}
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={btnClass(editor.isActive('underline'))}
          title="Underline"
        >
          <UnderlineIcon size={16} />
        </button>

        <div className="h-6 w-px bg-brand-border/30 mx-1" />

        {/* Alignments */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={btnClass(editor.isActive({ textAlign: 'left' }))}
          title="Align Left"
        >
          <AlignLeft size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={btnClass(editor.isActive({ textAlign: 'center' }))}
          title="Align Center"
        >
          <AlignCenter size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={btnClass(editor.isActive({ textAlign: 'right' }))}
          title="Align Right"
        >
          <AlignRight size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={btnClass(editor.isActive({ textAlign: 'justify' }))}
          title="Align Justify"
        >
          <AlignJustify size={16} />
        </button>

        <div className="h-6 w-px bg-brand-border/30 mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btnClass(editor.isActive('bulletList'))}
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btnClass(editor.isActive('orderedList'))}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>

        <div className="h-6 w-px bg-brand-border/30 mx-1" />

        {/* Code & Blocks */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={btnClass(editor.isActive('codeBlock'))}
          title="Code Block"
        >
          <Code size={16} />
        </button>
        {editor.isActive('codeBlock') && (
          <button
            type="button"
            onClick={insertParagraphBelow}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border border-brand-cyan/40 bg-brand-cyan/15 text-brand-cyan hover:bg-brand-cyan/25 transition-all shadow-sm"
            title="Exit Code Block and write normal text below (or press Shift+Enter)"
          >
            <CornerDownLeft size={13} />
            <span>+ Text Below</span>
          </button>
        )}
        {(editor.state.selection as any).node?.type?.name === 'image' && (
          <button
            type="button"
            onClick={insertParagraphBelow}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border border-brand-cyan/40 bg-brand-cyan/15 text-brand-cyan hover:bg-brand-cyan/25 transition-all shadow-sm"
            title="Insert normal text below this image (or press Enter)"
          >
            <CornerDownLeft size={13} />
            <span>+ Text Below Image</span>
          </button>
        )}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={btnClass(editor.isActive('blockquote'))}
          title="Blockquote"
        >
          <Quote size={16} />
        </button>

        {/* Highlighted Note Callout Button */}
        <button
          type="button"
          onClick={insertNoteBlock}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold transition-all ${
            editor.isActive('note')
              ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.3)]'
              : 'bg-transparent border-amber-400/30 text-amber-400 hover:text-amber-300 hover:border-amber-400/60 hover:bg-amber-400/10'
          }`}
          title="Add Highlighted Note Line / Callout Box"
        >
          <Lightbulb size={14} className="text-amber-400" />
          <span>+ Note</span>
        </button>

        {editor.isActive('note') && (
          <button
            type="button"
            onClick={insertParagraphBelow}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border border-amber-400/40 bg-amber-400/15 text-amber-300 hover:bg-amber-400/25 transition-all shadow-sm"
            title="Exit Note block and continue writing normal text below (or press Shift+Enter)"
          >
            <CornerDownLeft size={13} />
            <span>+ Text Below Note</span>
          </button>
        )}
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={btnClass(false)}
          title="Horizontal Rule"
        >
          <Minus size={16} />
        </button>

        <div className="h-6 w-px bg-brand-border/30 mx-1" />

        {/* Link / Image / Table */}
        <button
          type="button"
          onClick={setLink}
          className={btnClass(editor.isActive('link'))}
          title="Add Link"
        >
          <LinkIcon size={16} />
        </button>
        <button
          type="button"
          onClick={addImage}
          className={btnClass(false)}
          title="Insert Image by URL"
        >
          <ImageIcon size={16} />
        </button>
        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          className={btnClass(false)}
          title="Upload & Insert Image from Computer"
          disabled={isUploadingImage}
        >
          {isUploadingImage ? <RefreshCw size={16} className="animate-spin text-brand-cyan" /> : <Upload size={16} />}
        </button>
        <button
          type="button"
          onClick={openMediaModal}
          className={btnClass(showMediaModal)}
          title="Browse & Insert from Media Library"
        >
          <Folder size={16} />
        </button>
        <button
          type="button"
          onClick={() => setShowYoutubeModal(true)}
          className={btnClass(showYoutubeModal)}
          title="Add YouTube Video Tutorial"
        >
          <Youtube size={16} className="text-red-400" />
        </button>
        <input 
          type="file" 
          ref={imageInputRef} 
          onChange={handleImageFileChange} 
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp" 
          className="hidden" 
          disabled={isUploadingImage} 
        />
        <button
          type="button"
          onClick={insertTable}
          className={btnClass(editor.isActive('table'))}
          title="Insert Table"
        >
          <Grid3X3 size={16} />
        </button>

        {/* Table modifications inside toolbar */}
        {editor.isActive('table') && (
          <>
            <button
              type="button"
              onClick={() => editor.chain().focus().addColumnBefore().run()}
              className="px-2 py-1 text-xs border border-brand-border/20 text-brand-text-muted hover:text-white rounded"
            >
              +Col L
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              className="px-2 py-1 text-xs border border-brand-border/20 text-brand-text-muted hover:text-white rounded"
            >
              +Col R
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().addRowBefore().run()}
              className="px-2 py-1 text-xs border border-brand-border/20 text-brand-text-muted hover:text-white rounded"
            >
              +Row A
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().addRowAfter().run()}
              className="px-2 py-1 text-xs border border-brand-border/20 text-brand-text-muted hover:text-white rounded"
            >
              +Row B
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteTable().run()}
              className="px-2 py-1 text-xs border border-red-500/20 text-red-400 hover:bg-red-500/10 rounded"
            >
              Delete Tab
            </button>
          </>
        )}

        <div className="h-6 w-px bg-brand-border/30 mx-1" />

        {/* Simulation Code Option */}
        <button
          type="button"
          onClick={() => {
            setSimCode(simulationHtml || '');
            setShowSimulationModal(true);
          }}
          className={`px-2.5 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 font-bold transition-all ${
            simulationHtml 
              ? 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan shadow-[0_0_12px_rgba(0,229,255,0.25)]' 
              : 'bg-transparent border-brand-border/30 text-brand-text-muted hover:text-white hover:border-brand-cyan/50 hover:bg-brand-card/60'
          }`}
          title="Embed Lesson Simulation HTML"
        >
          <Cpu size={15} className={simulationHtml ? 'text-brand-cyan' : ''} />
          <span>Simulation</span>
          {simulationHtml ? (
            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
          ) : null}
        </button>

        <div className="h-6 w-px bg-brand-border/30 mx-auto lg:mr-1 lg:ml-auto" />

        {/* Undo / Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className={btnClass(false)}
          title="Undo"
          disabled={!editor.can().undo()}
        >
          <Undo size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className={btnClass(false)}
          title="Redo"
          disabled={!editor.can().redo()}
        >
          <Redo size={16} />
        </button>

      </div>

      {/* Editor Content Area */}
      <div 
        className="flex-1 bg-brand-bg-primary/20 backdrop-blur-md overflow-y-auto no-scrollbar min-h-[350px] cursor-text"
        onClick={(e) => {
          if (e.target === e.currentTarget && editor) {
            const { doc } = editor.state;
            const lastChild = doc.lastChild;
            if (!lastChild || lastChild.type.name !== 'paragraph' || lastChild.textContent !== '') {
              editor.chain().focus('end').insertContent({ type: 'paragraph' }).focus().run();
            } else {
              editor.chain().focus('end').run();
            }
          }
        }}
      >
        <EditorContent editor={editor} />
      </div>

      {/* Simulation Code Modal */}
      {showSimulationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setShowSimulationModal(false)} 
            className="fixed inset-0 bg-black/75 backdrop-blur-sm" 
          />
          <div className="relative bg-[#071A26] border border-brand-border/30 rounded-3xl p-6 w-full max-w-4xl h-[85vh] flex flex-col justify-between shadow-2xl z-10">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-brand-border/15 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-cyan/15 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan">
                  <Cpu size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-brand-text-white flex items-center gap-2">
                    Lesson Simulation Code (HTML)
                    {simCode.trim() ? (
                      <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Configured
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400 border border-slate-500/30">
                        Empty
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-brand-text-muted">
                    Paste your simulation HTML, CSS & JavaScript code. It will render in an interactive iframe on the student side below the lesson text.
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowSimulationModal(false)} 
                className="p-1.5 text-brand-text-muted hover:text-white rounded-lg hover:bg-brand-card/40 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* View Tabs */}
            <div className="flex items-center gap-2 mt-3 mb-2">
              <button
                type="button"
                onClick={() => setPreviewTab('editor')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  previewTab === 'editor'
                    ? 'bg-brand-cyan text-[#071A26]'
                    : 'bg-brand-card/50 text-brand-text-muted hover:text-white border border-brand-border/20'
                }`}
              >
                <Code size={14} />
                <span>HTML Code</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab('preview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  previewTab === 'preview'
                    ? 'bg-brand-cyan text-[#071A26]'
                    : 'bg-brand-card/50 text-brand-text-muted hover:text-white border border-brand-border/20'
                }`}
              >
                <Eye size={14} />
                <span>Live Preview (Iframe)</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 min-h-0 bg-[#0D2538]/40 border border-brand-border/25 rounded-2xl overflow-hidden flex flex-col">
              {previewTab === 'editor' ? (
                <div className="flex-1 flex flex-col p-3">
                  <textarea
                    value={simCode}
                    onChange={(e) => setSimCode(e.target.value)}
                    placeholder={`<!-- Paste your interactive simulation HTML/CSS/JS here -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: sans-serif; background: #071A26; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
    button { background: #00E5FF; color: #071A26; border: none; padding: 10px 20px; font-weight: bold; border-radius: 8px; cursor: pointer; }
  </style>
</head>
<body>
  <h2>Interactive Simulation</h2>
  <button onclick="alert('Simulation is interactive!')">Run Simulation</button>
</body>
</html>`}
                    className="w-full h-full bg-transparent font-mono text-xs text-brand-cyan placeholder:text-brand-text-muted/40 focus:outline-none resize-none select-text p-2"
                  />
                </div>
              ) : (
                <div className="w-full h-full bg-white flex flex-col">
                  {simCode.trim() ? (
                    <iframe
                      srcDoc={simCode}
                      title="Simulation Preview"
                      sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
                      className="w-full h-full border-0"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-[#071A26]">
                      <Cpu size={36} className="text-slate-600 mb-2" />
                      <p className="text-sm font-semibold text-slate-300">No simulation code entered yet</p>
                      <p className="text-xs text-slate-500 mt-1">Switch to the HTML Code tab to paste your simulation code.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-brand-border/15 pt-4 mt-4">
              <div>
                {simCode.trim() && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to remove the simulation code from this lesson?')) {
                        setSimCode('');
                        if (onSimulationChange) onSimulationChange('');
                        toast.success('Simulation code removed.');
                      }
                    }}
                    className="px-3.5 py-2 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 rounded-xl transition-colors"
                  >
                    Clear Simulation
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowSimulationModal(false)}
                  className="px-4 py-2 border border-brand-border/20 text-brand-text-muted hover:text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onSimulationChange) {
                      onSimulationChange(simCode);
                    }
                    setShowSimulationModal(false);
                    toast.success(simCode.trim() ? 'Simulation code applied to lesson!' : 'Simulation code saved (empty).');
                  }}
                  className="px-5 py-2 bg-brand-cyan text-[#071A26] hover:bg-brand-cyan/90 font-bold text-xs rounded-xl shadow-md shadow-brand-cyan/20 transition-all"
                >
                  Apply Simulation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Media Library Picker Modal */}
      {showMediaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setShowMediaModal(false)} 
            className="fixed inset-0 bg-black/75 backdrop-blur-sm" 
          />
          <div className="relative bg-[#071A26] border border-brand-border/30 rounded-3xl p-6 w-full max-w-4xl h-[80vh] flex flex-col justify-between shadow-2xl z-10">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-brand-border/15 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-cyan/15 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan">
                  <Folder size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-brand-text-white flex items-center gap-2">
                    Media Library Assets
                    <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30">
                      {folder || 'general'}
                    </span>
                  </h3>
                  <p className="text-xs text-brand-text-muted">
                    Click any previously uploaded image to insert it directly into this lesson.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl border border-brand-cyan/40 bg-brand-cyan/15 text-brand-cyan hover:bg-brand-cyan/25 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Upload size={14} />
                  <span>Upload New</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setShowMediaModal(false)} 
                  className="p-1.5 text-brand-text-muted hover:text-white rounded-lg hover:bg-brand-card/40 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body / Media Grid */}
            <div className="flex-1 overflow-y-auto no-scrollbar py-4">
              {loadingMedia ? (
                <div className="h-64 flex flex-col items-center justify-center gap-2 text-brand-text-muted">
                  <RefreshCw size={24} className="animate-spin text-brand-cyan" />
                  <span className="text-xs">Loading media assets...</span>
                </div>
              ) : mediaList.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center gap-3 text-center p-6 border border-dashed border-brand-border/20 rounded-2xl">
                  <FileImage size={36} className="text-brand-text-muted/40" />
                  <div>
                    <p className="text-sm font-bold text-brand-text-white">No images found in this folder</p>
                    <p className="text-xs text-brand-text-muted mt-1">Upload images using the "Upload New" button above.</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {mediaList.map((item) => (
                    <div
                      key={item._id || item.publicId}
                      onClick={() => {
                        insertImageSafely(item.url);
                        setShowMediaModal(false);
                        toast.success('Image inserted into lesson!');
                      }}
                      className="group cursor-pointer rounded-2xl border border-brand-border/20 hover:border-brand-cyan bg-[#0D2538]/60 overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-brand-cyan/10 flex flex-col"
                    >
                      <div className="aspect-video w-full bg-[#05131D] flex items-center justify-center overflow-hidden border-b border-brand-border/10 relative">
                        <img 
                          src={item.url} 
                          alt={item.filename || 'Media Asset'} 
                          className="w-full h-full object-contain p-1"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-brand-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="px-2.5 py-1 rounded-lg bg-[#071A26]/90 border border-brand-cyan/40 text-[10px] font-bold text-brand-cyan">
                            Click to Insert
                          </span>
                        </div>
                      </div>
                      <div className="p-2.5 flex flex-col justify-between flex-1">
                        <p className="text-xs font-semibold text-brand-text-white truncate" title={item.filename}>
                          {item.filename || 'Untitled Image'}
                        </p>
                        <p className="text-[10px] text-brand-text-muted mt-1">
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end border-t border-brand-border/15 pt-4">
              <button
                type="button"
                onClick={() => setShowMediaModal(false)}
                className="px-4 py-2 border border-brand-border/20 text-brand-text-muted hover:text-white rounded-xl text-xs font-bold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* YouTube Video Modal */}
      {showYoutubeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setShowYoutubeModal(false)} 
            className="fixed inset-0 bg-black/75 backdrop-blur-sm" 
          />
          <div className="relative bg-[#071A26] border border-red-500/30 rounded-3xl p-6 w-full max-w-lg shadow-2xl z-10 space-y-5">
            <div className="flex items-center justify-between border-b border-brand-border/15 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-600/15 border border-red-600/30 flex items-center justify-center text-red-400">
                  <Youtube size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-brand-text-white">
                    Add YouTube Video
                  </h3>
                  <p className="text-xs text-brand-text-muted">
                    Paste any YouTube video link. Its thumbnail and interactive player will appear in the lesson.
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowYoutubeModal(false)} 
                className="p-1.5 text-brand-text-muted hover:text-white rounded-lg hover:bg-brand-card/40 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-brand-text-muted uppercase tracking-wider block">
                YouTube Video URL *
              </label>
              <input
                type="url"
                autoFocus
                value={youtubeInputUrl}
                onChange={(e) => setYoutubeInputUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                className="w-full bg-[#0D2538]/60 border border-brand-border/30 rounded-xl px-4 py-2.5 text-xs text-brand-text-white placeholder-brand-text-muted/40 focus:outline-none focus:border-red-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddYoutube();
                  }
                }}
              />

              {/* Live Preview if valid URL */}
              {extractYouTubeId(youtubeInputUrl) && (
                <div className="rounded-2xl border border-red-500/20 bg-[#05131D] overflow-hidden p-3 flex items-center gap-3 animate-fadeIn">
                  <img 
                    src={getYouTubeThumbnail(extractYouTubeId(youtubeInputUrl)!, 'hq')} 
                    alt="Preview" 
                    className="w-24 h-16 object-cover rounded-lg border border-brand-border/20 shadow-md"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                      Valid Video
                    </span>
                    <p className="text-xs font-mono text-brand-text-muted mt-1 truncate">
                      ID: {extractYouTubeId(youtubeInputUrl)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-brand-border/15">
              <button
                type="button"
                onClick={() => {
                  setShowYoutubeModal(false);
                  setYoutubeInputUrl('');
                }}
                className="px-4 py-2 border border-brand-border/20 text-brand-text-muted hover:text-white rounded-xl text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddYoutube}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center gap-1.5"
              >
                <Youtube size={15} />
                <span>Insert Video</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
