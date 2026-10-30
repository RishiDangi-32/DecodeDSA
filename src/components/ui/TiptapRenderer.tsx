import { Fragment, useState } from 'react';
import { Play, Youtube, ExternalLink, Lightbulb, Check, Copy } from 'lucide-react';
import { extractYouTubeId, getYouTubeThumbnail } from '../../utils/youtube';

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

export function YouTubePlayer({ videoId, src }: { videoId: string; src?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [imgSrc, setImgSrc] = useState(getYouTubeThumbnail(videoId, 'maxres'));

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <div className="my-8 w-full flex justify-center select-none">
      <div className="w-full max-w-md sm:max-w-lg rounded-2xl overflow-hidden border border-[#DDD7CD] shadow-md bg-[#1A2421] aspect-video relative group mx-auto">
        {!isPlaying ? (
          <div 
            onClick={handlePlay}
            className="w-full h-full relative cursor-pointer flex items-center justify-center overflow-hidden"
          >
            {/* Video Thumbnail */}
            <img 
              src={imgSrc} 
              onError={() => setImgSrc(getYouTubeThumbnail(videoId, 'hq'))}
              alt="YouTube Video Thumbnail" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/40 group-hover:via-black/15 transition-all" />

            {/* Top YouTube Badge */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 shadow-sm">
              <div className="w-4 h-4 rounded bg-red-600 flex items-center justify-center text-white shadow-2xs">
                <Youtube size={11} />
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-white tracking-wide">YouTube Tutorial</span>
            </div>

            {/* Center Play Button */}
            <div className="absolute flex flex-col items-center gap-2">
              <div className="w-14 h-10 sm:w-16 sm:h-11 rounded-xl bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-xl shadow-red-600/50 group-hover:scale-110 transition-all duration-300">
                <Play size={20} className="fill-white ml-0.5 text-white" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-white drop-shadow-md bg-black/60 px-2.5 py-0.5 rounded-full border border-white/10">
                Click to Watch Video
              </span>
            </div>

            {/* Bottom bar with External Link button */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <a
                href={src || `https://www.youtube.com/watch?v=${videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="px-2.5 py-1 rounded-lg bg-black/75 hover:bg-black text-[10px] sm:text-[11px] font-bold text-gray-300 hover:text-white border border-white/10 flex items-center gap-1 transition-colors"
              >
                <span>YouTube</span>
                <ExternalLink size={10} />
              </a>
            </div>
          </div>
        ) : (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
            title="YouTube Video Player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0 rounded-2xl"
          />
        )}
      </div>
    </div>
  );
}

// Lightweight syntax tokenizer for C++ code blocks with line numbers
function CppCodeBlock({ codeText }: { codeText: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = codeText.split('\n');

  // Tokenize a single line with C++ syntax highlighting
  const renderCodeLine = (line: string) => {
    if (!line) return <br />;

    // Regex matchers for C++ tokens
    const tokenRegex = /(\/\/.*$|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#[a-zA-Z_]\w*|\b(?:int|float|double|char|bool|void|auto|const|return|if|else|for|while|do|switch|case|break|continue|struct|class|public|private|protected|virtual|override|nullptr|true|false|sizeof|typedef|using|namespace|new|delete|template|typename|unsigned|long|short|signed|static|inline|explicit|friend|size_t|int8_t|int16_t|int32_t|int64_t|uint8_t|uint16_t|uint32_t|uint64_t)\b|\b(?:std|cout|cin|endl|vector|string|map|set|pair|make_pair|max|min|sort)\b|\b\d+(?:\.\d+)?(?:f|u|l|ul|ll)?\b)/g;

    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = tokenRegex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.substring(lastIndex, match.index));
      }

      const token = match[0];
      if (token.startsWith('//') || token.startsWith('/*')) {
        parts.push(<span key={match.index} className="text-[#64748B] italic">{token}</span>);
      } else if (token.startsWith('#')) {
        parts.push(<span key={match.index} className="text-[#9A3412] font-semibold">{token}</span>);
      } else if (token.startsWith('"') || token.startsWith("'")) {
        parts.push(<span key={match.index} className="text-[#166534] font-medium">{token}</span>);
      } else if (/^\d/.test(token)) {
        parts.push(<span key={match.index} className="text-[#C2410C] font-semibold">{token}</span>);
      } else if (['std', 'cout', 'cin', 'endl', 'vector', 'string', 'map', 'set', 'pair', 'max', 'min', 'sort'].includes(token)) {
        parts.push(<span key={match.index} className="text-[#0369A1] font-semibold">{token}</span>);
      } else {
        // C++ keywords and built-in primitive types
        parts.push(<span key={match.index} className="text-[#0F4C81] font-bold">{token}</span>);
      }

      lastIndex = tokenRegex.lastIndex;
    }

    if (lastIndex < line.length) {
      parts.push(line.substring(lastIndex));
    }

    return parts;
  };

  return (
    <div className="relative group my-6 overflow-hidden rounded-2xl border border-[#DDD7CD] bg-[#F4F2EC] shadow-sm transition-all hover:border-[#CDC5B7]">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#E3DDCF] bg-[#ECE9E0]/80 select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 opacity-60">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E06C75]/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#E5C07B]/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#98C379]/60" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#4A544E] ml-2 font-mono">
            C++ Code Snippet
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-[#4A544E] hover:text-[#1F2623] px-2.5 py-1 rounded-lg border border-[#DDD7CD] hover:border-[#BCB4A4] bg-white/70 hover:bg-white transition-all shadow-2xs"
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-600" />
              <span className="text-emerald-700 font-bold">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body with Line Numbers */}
      <div className="p-4 overflow-x-auto no-scrollbar font-mono text-xs sm:text-[13.5px] leading-relaxed text-[#1F2623] select-text flex">
        {/* Line numbers column */}
        <div className="select-none pr-4 mr-3 border-r border-[#E2DDD4] text-right text-[#9EA79F] font-mono text-xs leading-relaxed space-y-0.5">
          {lines.map((_, i) => (
            <div key={i} className="leading-relaxed">
              {i + 1}
            </div>
          ))}
        </div>
        {/* Code text column */}
        <div className="flex-1 min-w-0 space-y-0.5 font-mono">
          {lines.map((line, i) => (
            <div key={i} className="leading-relaxed whitespace-pre">
              {renderCodeLine(line)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TiptapRenderer({ json }: { json: any }) {
  if (!json) return null;

  const renderText = (node: TiptapNode): JSX.Element | string => {
    if (!node.text) return '';
    let result: JSX.Element | string = node.text;

    if (node.marks) {
      for (const mark of node.marks) {
        if (mark.type === 'bold') {
          result = <strong className="font-bold text-[#1B231F]">{result}</strong>;
        }
        if (mark.type === 'italic') {
          result = <em className="italic">{result}</em>;
        }
        if (mark.type === 'underline') {
          result = <span className="underline decoration-[#2D5A43]/40 underline-offset-2">{result}</span>;
        }
        if (mark.type === 'link') {
          result = (
            <a 
              href={mark.attrs?.href} 
              target={mark.attrs?.target || '_blank'} 
              rel="noopener noreferrer" 
              className="text-[#235338] underline decoration-[#235338]/40 hover:decoration-[#235338] hover:text-[#183926] cursor-pointer font-semibold inline-flex items-center gap-0.5"
            >
              {result}
            </a>
          );
        }
        if (mark.type === 'code') {
          result = (
            <code className="bg-[#EAE7DF] border border-[#DDD8CE] text-[#1E2522] rounded-md px-1.5 py-0.5 font-mono text-[13px] font-semibold">
              {result}
            </code>
          );
        }
      }
    }
    return result;
  };

  const getListItemText = (node: TiptapNode): string => {
    if (node.text) return node.text;
    if (!node.content) return '';
    return node.content.map(child => getListItemText(child)).join('');
  };

  const renderNode = (
    node: TiptapNode, 
    index: number, 
    isInsideList: boolean = false,
    stripLeadingNumber: boolean = false
  ): JSX.Element | null => {
    switch (node.type) {
      case 'doc': {
        const isNodeEmpty = (n: TiptapNode): boolean => {
          if (n.type !== 'paragraph') return false;
          if (!n.content || n.content.length === 0) return true;
          const hasNonText = n.content.some(c => c.type !== 'text');
          if (hasNonText) return false;
          const text = n.content.map(c => c.text || '').join('').trim();
          return text.length === 0;
        };

        const getNodePlainText = (n: TiptapNode): string => {
          if (!n.content) return '';
          return n.content.map(c => c.text || '').join('');
        };

        const cleanedContent: TiptapNode[] = [];

        (node.content || []).forEach((child) => {
          // Drop ALL empty paragraphs - paragraphs naturally provide standard mb-4 spacing!
          if (isNodeEmpty(child)) {
            return;
          }

          // Check if child paragraph can be healed/merged into previous paragraph
          // (fixes PDF/copy-paste line-breaks e.g. "Queue : It" -> "is...", "Graph : G" -> "raph...", "Heap :" -> "A heap...")
          if (cleanedContent.length > 0 && child.type === 'paragraph') {
            const prev = cleanedContent[cleanedContent.length - 1];
            if (prev.type === 'paragraph' && !isNodeEmpty(prev)) {
              const textA = getNodePlainText(prev).trim();
              const textB = getNodePlainText(child).trim();

              const isHyphenBroken = /-$/.test(textA) && /^[a-z]/i.test(textB);
              const isSingleLetterBroken = /\b[A-Za-z]$/.test(textA) && /^[a-z]/.test(textB);
              const isSentenceBroken = /^[a-z]/.test(textB) && !/[\.\?!]\s*$/.test(textA);
              const isColonLabel = /:\s*$/.test(textA) && textA.length < 50;

              if (isHyphenBroken || isSingleLetterBroken || isSentenceBroken || isColonLabel) {
                const prevContent = [...(prev.content || [])];
                const childContent = [...(child.content || [])];

                if (isHyphenBroken && prevContent.length > 0) {
                  const lastIdx = prevContent.length - 1;
                  const last = prevContent[lastIdx];
                  if (last.text) {
                    prevContent[lastIdx] = { ...last, text: last.text.replace(/-$/, '') };
                  }
                }

                const needsSpace = !isHyphenBroken && !isSingleLetterBroken;
                if (needsSpace && childContent.length > 0) {
                  const first = childContent[0];
                  if (first.text && !first.text.startsWith(' ')) {
                    childContent[0] = { ...first, text: ' ' + first.text };
                  }
                }

                prev.content = [...prevContent, ...childContent];
                return;
              }
            }
          }

          cleanedContent.push(child);
        });

        return (
          <div key={index} className="tiptap-content select-text">
            {cleanedContent.map((child, idx) => renderNode(child, idx))}
          </div>
        );
      }
      
      case 'paragraph': {
        const plainText = (node.content?.map(c => c.text || '').join('') || '').trim();
        const hasContent = Boolean(node.content && node.content.length > 0);
        const hasNonText = hasContent && node.content!.some(c => c.type !== 'text');

        // Drop empty paragraphs completely
        if (!hasNonText && plainText.length === 0) {
          return null;
        }

        const detectedId = plainText ? extractYouTubeId(plainText) : null;
        if (detectedId && (plainText?.startsWith('http://') || plainText?.startsWith('https://'))) {
          return <YouTubePlayer key={index} videoId={detectedId} src={plainText} />;
        }

        // Sanitize any accidental hardBreaks inside a single paragraph
        const rawContent = node.content || [];
        const sanitizedContent: TiptapNode[] = [];
        for (let i = 0; i < rawContent.length; i++) {
          const item = rawContent[i];
          if (item.type === 'hardBreak') {
            const prevItem = sanitizedContent[sanitizedContent.length - 1];
            const nextItem = rawContent[i + 1];
            const prevText = prevItem?.text?.trim() || '';
            const nextText = nextItem?.text?.trim() || '';

            const isHyphen = /-$/.test(prevText) && /^[a-z]/i.test(nextText);
            const isSingleLetter = /\b[A-Za-z]$/.test(prevText) && /^[a-z]/.test(nextText);
            const isSentence = /^[a-z]/.test(nextText) && !/[\.\?!]\s*$/.test(prevText);
            const isColon = /:\s*$/.test(prevText) && prevText.length < 50;

            if (isHyphen || isSingleLetter || isSentence || isColon) {
              if (isHyphen && prevItem && prevItem.text) {
                prevItem.text = prevItem.text.replace(/-$/, '');
              } else if ((isSentence || isColon) && prevItem && prevItem.text) {
                if (!prevItem.text.endsWith(' ') && !nextText.startsWith(' ')) {
                  prevItem.text += ' ';
                }
              }
              continue; // Drop the accidental hardBreak!
            }
          }
          sanitizedContent.push(item);
        }

        // Check if paragraph starts with note-like keywords e.g. "Note:", "Important Note:", "Tip:"
        const isNoteParagraph = /^\s*(important\s+note|note|key\s+takeaway|point\s+to\s+remember|remember|tip|warning)\s*:/i.test(plainText);
        if (isNoteParagraph && !isInsideList) {
          return (
            <div 
              key={index} 
              className="my-7 rounded-2xl border border-[#F1E0C5] bg-[#FDF8EC] p-5 sm:p-6 shadow-xs select-text relative overflow-hidden"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#B45309] flex-shrink-0 mt-0.5 shadow-2xs">
                  <Lightbulb size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                      Important Note
                    </span>
                  </div>
                  <div className="text-[15px] sm:text-base text-[#4D361B] leading-relaxed font-medium">
                    {sanitizedContent.map((child, idx) => {
                      if (child.type === 'text') {
                        return <Fragment key={idx}>{renderText(child)}</Fragment>;
                      }
                      return <Fragment key={idx}>{renderNode(child, idx)}</Fragment>;
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        }

        const alignment = node.attrs?.textAlign || 'left';
        let didStrip = false;
        return (
          <p 
            key={index} 
            className={`text-base sm:text-[17px] text-[#2C342F] leading-[1.82] font-normal ${isInsideList ? 'mb-1' : 'mb-4'} select-text`}
            style={{ textAlign: alignment }}
          >
            {sanitizedContent.map((child, idx) => {
              if (child.type === 'text') {
                if (stripLeadingNumber && !didStrip && child.text) {
                  didStrip = true;
                  const strippedText = child.text.replace(/^\s*\d+[\.\)\-:]\s*/, '');
                  return (
                    <Fragment key={idx}>
                      {renderText({ ...child, text: strippedText })}
                    </Fragment>
                  );
                }
                return (
                  <Fragment key={idx}>
                    {renderText(child)}
                  </Fragment>
                );
              }
              return (
                <Fragment key={idx}>
                  {renderNode(child, idx, isInsideList)}
                </Fragment>
              );
            })}
          </p>
        );
      }

      case 'heading': {
        const level = node.attrs?.level || 1;
        const alignment = node.attrs?.textAlign || 'left';
        
        // Stately editorial serif headings as seen in the reference image
        const classes = {
          1: 'font-serif text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#1B231F] mt-9 mb-4 border-b border-[#E8E4DA] pb-3 select-text leading-tight tracking-tight',
          2: 'font-serif text-xl sm:text-2xl lg:text-[26px] font-bold text-[#1B231F] mt-8 mb-3 select-text leading-snug tracking-tight',
          3: 'font-serif text-lg sm:text-xl font-bold text-[#1B231F] mt-6 mb-2 select-text leading-snug',
        }[level as 1 | 2 | 3] || 'font-serif text-xl font-bold text-[#1B231F] mt-5 mb-2';

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

      case 'bulletList': {
        const validChildren = node.content?.filter(child => {
          const text = getListItemText(child).trim();
          return text.length > 0;
        }) || [];

        if (validChildren.length === 0) return null;

        return (
          <ul key={index} className="list-disc pl-6 space-y-2 mb-6 text-[#2D3530] select-text marker:text-[#2D5A43]">
            {validChildren.map((child, idx) => renderNode(child, idx, true, false))}
          </ul>
        );
      }

      case 'orderedList': {
        const start = node.attrs?.start || 1;
        const validChildren = node.content?.filter(child => {
          const text = getListItemText(child).trim();
          return text.length > 0;
        }) || [];

        if (validChildren.length === 0) return null;

        const isCommentItem = (item: TiptapNode) => {
          const text = getListItemText(item).trim();
          return /^\s*(\/\/|\/\*|<!--)/.test(text);
        };

        const nonCommentChildren = validChildren.filter(c => !isCommentItem(c));
        const hasManualNumbering = nonCommentChildren.length > 0 && nonCommentChildren.every(child => {
          const text = getListItemText(child).trim();
          return /^\d+[\.\)\-:]\s*/.test(text);
        });

        return (
          <ol 
            key={index} 
            start={start}
            className={`${hasManualNumbering ? 'list-none pl-1' : 'list-decimal pl-6'} space-y-2 mb-6 text-[#2D3530] select-text marker:font-bold marker:text-[#2D5A43]`}
          >
            {validChildren.map((child, idx) => 
              renderNode(child, idx, true, !hasManualNumbering)
            )}
          </ol>
        );
      }

      case 'listItem': {
        const text = getListItemText(node).trim();
        const isComment = /^\s*(\/\/|\/\*|<!--)/.test(text);

        return (
          <li 
            key={index} 
            className={`text-base sm:text-[17px] leading-[1.8] text-[#2C342F] ${
              isComment 
                ? 'list-none -ml-6 my-4 font-bold text-[#1B231F] block' 
                : ''
            }`}
          >
            {node.content?.map((child, idx) => 
              renderNode(child, idx, isInsideList, !isComment && stripLeadingNumber && idx === 0)
            )}
          </li>
        );
      }

      case 'note':
        return (
          <div 
            key={index} 
            className="my-7 rounded-2xl border border-[#F1E0C5] bg-[#FDF8EC] p-5 sm:p-6 shadow-xs select-text relative overflow-hidden"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#B45309] flex-shrink-0 mt-0.5 shadow-2xs">
                <Lightbulb size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                    Important Note
                  </span>
                </div>
                <div className="text-[15px] sm:text-base text-[#4D361B] leading-relaxed font-medium">
                  {node.content?.map((child, idx) => renderNode(child, idx))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'blockquote': {
        const text = node.content?.map(c => getListItemText(c)).join(' ').trim() || '';
        const isNote = /^\s*(important\s+note|note|key\s+takeaway|point\s+to\s+remember|remember|tip|warning)\s*:/i.test(text);

        if (isNote) {
          return (
            <div 
              key={index} 
              className="my-7 rounded-2xl border border-[#F1E0C5] bg-[#FDF8EC] p-5 sm:p-6 shadow-xs select-text relative overflow-hidden"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#B45309] flex-shrink-0 mt-0.5 shadow-2xs">
                  <Lightbulb size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                      Important Note
                    </span>
                  </div>
                  <div className="text-[15px] sm:text-base text-[#4D361B] leading-relaxed font-medium">
                    {node.content?.map((child, idx) => renderNode(child, idx))}
                  </div>
                </div>
              </div>
            </div>
          );
        }

        return (
          <blockquote key={index} className="border-l-4 border-[#2D5A43] bg-[#F2F7F4] rounded-r-2xl px-5 py-4 my-6 italic text-[#303E36] select-text font-serif text-[16.5px] leading-relaxed">
            {node.content?.map((child, idx) => renderNode(child, idx))}
          </blockquote>
        );
      }

      case 'codeBlock': {
        const rawCode = node.content?.map(c => c.text || '').join('\n') || '';
        return <CppCodeBlock key={index} codeText={rawCode} />;
      }

      case 'horizontalRule':
        return <hr key={index} className="my-8 border-[#E5E0D5]" />;

      case 'image':
        return (
          <div key={index} className="my-8 w-full">
            <div className="w-full rounded-2xl overflow-hidden border border-black">
              <img 
                src={node.attrs?.src} 
                alt={node.attrs?.alt || 'Lesson Image'} 
                title={node.attrs?.title}
                className="w-full h-auto max-h-[85vh] object-contain mx-auto block transition-all"
                loading="lazy"
              />
            </div>
            {node.attrs?.title && (
              <p className="text-center text-xs text-[#5D6761] mt-2 font-medium italic">
                {node.attrs.title}
              </p>
            )}
          </div>
        );

      case 'youtube': {
        const videoId = node.attrs?.videoId || extractYouTubeId(node.attrs?.src);
        if (!videoId) return null;
        return <YouTubePlayer key={index} videoId={videoId} src={node.attrs?.src} />;
      }

      case 'table':
        return (
          <div key={index} className="overflow-x-auto my-7 border border-[#DDD7CD] rounded-2xl shadow-xs bg-white no-scrollbar">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              {node.content?.map((child, idx) => renderNode(child, idx))}
            </table>
          </div>
        );

      case 'tableRow':
        return (
          <tr key={index} className="border-b border-[#E8E3DA] last:border-b-0 hover:bg-[#F9FAF8] transition-colors">
            {node.content?.map((child, idx) => renderNode(child, idx))}
          </tr>
        );

      case 'tableHeader':
        return (
          <th key={index} className="p-3.5 bg-[#E2ECE5] border-r border-[#D2DDD5] last:border-r-0 font-bold text-[#1B2821] uppercase tracking-wider text-[11px] sm:text-xs">
            {node.content?.map((child, idx) => renderNode(child, idx))}
          </th>
        );

      case 'tableCell':
        return (
          <td key={index} className="p-3.5 border-r border-[#E8E3DA] last:border-r-0 font-normal text-[#2A342E] leading-relaxed">
            {node.content?.map((child, idx) => renderNode(child, idx))}
          </td>
        );

      case 'hardBreak':
        return <br key={index} />;

      default:
        return null;
    }
  };

  return (
    <div className="tiptap-rendered-content text-[#222724]">
      {renderNode(json, 0)}
    </div>
  );
}
