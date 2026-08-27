import { useEditor, EditorContent } from '@tiptap/react';
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
import { useEffect } from 'react';
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  List, ListOrdered, Code, Quote, Plus, 
  Undo, Redo, Heading1, Heading2, Heading3, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link as LinkIcon, Image as ImageIcon, Grid3X3, Minus
} from 'lucide-react';
import toast from 'react-hot-toast';

const lowlight = createLowlight(common);

interface RichTextEditorProps {
  value?: any; // JSON representation
  onChange: (value: any) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
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
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl max-w-full my-4 border border-brand-border/20 shadow-md',
        },
      }),
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
      CodeBlockLowlight.configure({
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

  const addImage = () => {
    const url = window.prompt('Enter Image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
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
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={btnClass(editor.isActive('blockquote'))}
          title="Blockquote"
        >
          <Quote size={16} />
        </button>
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
          title="Add Image URL"
        >
          <ImageIcon size={16} />
        </button>
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
      <div className="flex-1 bg-brand-bg-primary/20 backdrop-blur-md overflow-y-auto no-scrollbar min-h-[350px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
