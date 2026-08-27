import { Fragment } from 'react';

interface TextMark {
  type: string;
  attrs?: Record<string, any>;
}

interface TiptapNode {
  type: string;
  text?: string;
  marks?: TextMark[];
  attrs?: Record<string, any>;
  content?: TiptapNode[];
}

export default function TiptapRenderer({ json }: { json: any }) {
  if (!json) return null;

  const renderText = (node: TiptapNode): JSX.Element | string => {
    if (!node.text) return '';
    let result: JSX.Element | string = node.text;

    if (node.marks) {
      for (const mark of node.marks) {
        if (mark.type === 'bold') {
          result = <strong className="font-extrabold text-brand-text-white">{result}</strong>;
        }
        if (mark.type === 'italic') {
          result = <em className="italic">{result}</em>;
        }
        if (mark.type === 'underline') {
          result = <span className="underline">{result}</span>;
        }
        if (mark.type === 'link') {
          result = (
            <a 
              href={mark.attrs?.href} 
              target={mark.attrs?.target || '_blank'} 
              rel="noopener noreferrer" 
              className="text-brand-cyan hover:underline cursor-pointer font-bold inline-flex items-center gap-0.5"
            >
              {result}
            </a>
          );
        }
        if (mark.type === 'code') {
          result = <code className="bg-[#071A26] border border-brand-border/30 rounded px-1.5 py-0.5 font-mono text-xs text-brand-cyan">{result}</code>;
        }
      }
    }
    return result;
  };

  const renderNode = (node: TiptapNode, index: number): JSX.Element | null => {
    switch (node.type) {
      case 'doc':
        return (
          <div key={index} className="space-y-4">
            {node.content?.map((child, idx) => renderNode(child, idx))}
          </div>
        );
      
      case 'paragraph': {
        const alignment = node.attrs?.textAlign || 'left';
        return (
          <p 
            key={index} 
            className="text-sm sm:text-base text-brand-text-muted leading-relaxed font-medium mb-4 select-text"
            style={{ textAlign: alignment }}
          >
            {node.content?.map((child, idx) => (
              <Fragment key={idx}>
                {child.type === 'text' ? renderText(child) : renderNode(child, idx)}
              </Fragment>
            )) || <br />}
          </p>
        );
      }

      case 'heading': {
        const level = node.attrs?.level || 1;
        const alignment = node.attrs?.textAlign || 'left';
        const classes = {
          1: 'text-2xl sm:text-3xl font-black text-brand-text-white mt-8 mb-4 border-b border-brand-border/10 pb-2 select-text leading-tight',
          2: 'text-xl sm:text-2xl font-black text-brand-text-white mt-6 mb-3 select-text leading-tight',
          3: 'text-lg sm:text-xl font-extrabold text-brand-text-white mt-4 mb-2 select-text leading-tight',
        }[level as 1 | 2 | 3] || 'text-xl font-bold';

        return (
          <div key={index} style={{ textAlign: alignment }} className={classes}>
            {node.content?.map((child, idx) => (
              <Fragment key={idx}>
                {child.type === 'text' ? renderText(child) : renderNode(child, idx)}
              </Fragment>
            ))}
          </div>
        );
      }

      case 'bulletList':
        return (
          <ul key={index} className="list-disc pl-6 space-y-2 mb-6 text-brand-text-muted select-text">
            {node.content?.map((child, idx) => renderNode(child, idx))}
          </ul>
        );

      case 'orderedList':
        return (
          <ol key={index} className="list-decimal pl-6 space-y-2 mb-6 text-brand-text-muted select-text">
            {node.content?.map((child, idx) => renderNode(child, idx))}
          </ol>
        );

      case 'listItem':
        return (
          <li key={index} className="text-sm sm:text-base leading-relaxed">
            {node.content?.map((child, idx) => renderNode(child, idx))}
          </li>
        );

      case 'blockquote':
        return (
          <blockquote key={index} className="border-l-4 border-brand-cyan/80 bg-brand-cyan/5 rounded-r-xl px-5 py-4 my-6 italic text-brand-text-muted select-text">
            {node.content?.map((child, idx) => renderNode(child, idx))}
          </blockquote>
        );

      case 'codeBlock':
        return (
          <div key={index} className="relative group my-6 overflow-hidden border border-brand-border/30 rounded-2xl shadow-inner bg-[#071A26]">
            {/* Top tab panel bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-brand-border/20 bg-[#0D2538]/70 select-none">
              <span className="text-[10px] font-bold text-brand-cyan tracking-wider uppercase">C++ Code Output</span>
              <button 
                onClick={() => {
                  const text = node.content?.map(c => c.text || '').join('\n') || '';
                  navigator.clipboard.writeText(text);
                  alert('Code copied to clipboard!');
                }}
                className="text-[9px] font-bold text-brand-text-muted hover:text-white px-2 py-0.5 border border-brand-border/30 hover:border-brand-cyan rounded transition-colors"
              >
                Copy
              </button>
            </div>
            
            <pre className="p-4 overflow-x-auto no-scrollbar font-mono text-xs sm:text-sm text-[#38BDF8] select-text leading-relaxed">
              <code>
                {node.content?.map((child, idx) => child.text || '').join('\n')}
              </code>
            </pre>
          </div>
        );

      case 'horizontalRule':
        return <hr key={index} className="my-8 border-brand-border/20" />;

      case 'image':
        return (
          <div key={index} className="my-6 flex justify-center">
            <div className="rounded-2xl overflow-hidden border border-brand-border/20 shadow-xl max-w-full">
              <img 
                src={node.attrs?.src} 
                alt={node.attrs?.alt || 'Lesson Image'} 
                title={node.attrs?.title}
                className="max-h-[380px] object-cover"
              />
            </div>
          </div>
        );

      case 'table':
        return (
          <div key={index} className="overflow-x-auto my-6 border border-brand-border/20 rounded-2xl shadow-lg bg-[#0D2538]/20 no-scrollbar">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              {node.content?.map((child, idx) => renderNode(child, idx))}
            </table>
          </div>
        );

      case 'tableRow':
        return (
          <tr key={index} className="border-b border-brand-border/10 last:border-b-0 hover:bg-brand-card/10 transition-colors">
            {node.content?.map((child, idx) => renderNode(child, idx))}
          </tr>
        );

      case 'tableHeader':
        return (
          <th key={index} className="p-3 bg-[#0D2538] border-r border-brand-border/10 last:border-r-0 font-extrabold text-brand-text-white uppercase tracking-wider text-xs">
            {node.content?.map((child, idx) => renderNode(child, idx))}
          </th>
        );

      case 'tableCell':
        return (
          <td key={index} className="p-3 border-r border-brand-border/10 last:border-r-0 font-medium text-brand-text-muted">
            {node.content?.map((child, idx) => renderNode(child, idx))}
          </td>
        );

      default:
        return null;
    }
  };

  return (
    <div className="tiptap-rendered-content">
      {renderNode(json, 0)}
    </div>
  );
}
