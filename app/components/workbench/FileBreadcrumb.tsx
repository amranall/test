import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { memo, useEffect, useRef, useState } from 'react';
import type { FileMap } from '~/lib/stores/files';
import { classNames } from '~/utils/classNames';
import { WORK_DIR } from '~/utils/constants';
import { cubicEasingFn } from '~/utils/easings';
import { renderLogger } from '~/utils/logger';
import FileTree from './FileTree';

const WORK_DIR_REGEX = new RegExp(`^${WORK_DIR.split('/').slice(0, -1).join('/').replaceAll('/', '\\/')}/`);

const getFileExtension = (filename: string): string => {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()?.toLowerCase() || '' : '';
};

interface FileIconConfig {
  icon: string;
  color: string;
}

const getFileIconConfig = (extension: string): FileIconConfig => {
  // Map of file extensions to MDI icons and their colors
  const iconMap: { [key: string]: FileIconConfig } = {
    // Web
    'html': { icon: 'mdi-language-html5', color: 'text-orange-500' },
    'htm': { icon: 'mdi-language-html5', color: 'text-orange-500' },
    'css': { icon: 'mdi-language-css3', color: 'text-blue-500' },
    'scss': { icon: 'mdi-sass', color: 'text-pink-500' },
    'less': { icon: 'mdi-less', color: 'text-indigo-500' },
    'js': { icon: 'mdi-language-javascript', color: 'text-yellow-500' },
    'jsx': { icon: 'mdi-react', color: 'text-cyan-400' },
    'ts': { icon: 'mdi-language-typescript', color: 'text-blue-600' },
    'tsx': { icon: 'mdi-react', color: 'text-cyan-400' },

    // Programming Languages
    'py': { icon: 'mdi-language-python', color: 'text-blue-500' },
    'java': { icon: 'mdi-language-java', color: 'text-red-500' },
    'kt': { icon: 'mdi-kotlin', color: 'text-purple-500' },
    'cpp': { icon: 'mdi-language-cpp', color: 'text-blue-700' },
    'c': { icon: 'mdi-language-c', color: 'text-blue-600' },
    'cs': { icon: 'mdi-language-csharp', color: 'text-green-600' },
    'go': { icon: 'mdi-language-go', color: 'text-cyan-500' },
    'rb': { icon: 'mdi-language-ruby', color: 'text-red-600' },
    'php': { icon: 'mdi-language-php', color: 'text-purple-600' },
    'swift': { icon: 'mdi-language-swift', color: 'text-orange-600' },
    'rs': { icon: 'mdi-language-rust', color: 'text-orange-700' },

    // Data & Config
    'json': { icon: 'mdi-code-json', color: 'text-yellow-600' },
    'xml': { icon: 'mdi-file-xml', color: 'text-orange-400' },
    'yaml': { icon: 'mdi-file-code', color: 'text-red-400' },
    'yml': { icon: 'mdi-file-code', color: 'text-red-400' },
    'toml': { icon: 'mdi-file-code', color: 'text-gray-600' },
    'ini': { icon: 'mdi-file-cog', color: 'text-gray-600' },
    'env': { icon: 'mdi-file-cog', color: 'text-green-500' },

    // Documents
    'md': { icon: 'mdi-language-markdown', color: 'text-blue-gray-600' },
    'txt': { icon: 'mdi-file-document', color: 'text-blue-gray-400' },
    'pdf': { icon: 'mdi-file-pdf', color: 'text-red-500' },
    'doc': { icon: 'mdi-file-word', color: 'text-blue-700' },
    'docx': { icon: 'mdi-file-word', color: 'text-blue-700' },

    // Images
    'png': { icon: 'mdi-file-image', color: 'text-purple-400' },
    'jpg': { icon: 'mdi-file-image', color: 'text-purple-400' },
    'jpeg': { icon: 'mdi-file-image', color: 'text-purple-400' },
    'gif': { icon: 'mdi-file-image', color: 'text-purple-400' },
    'svg': { icon: 'mdi-file-image', color: 'text-purple-400' },

    // Other
    'zip': { icon: 'mdi-folder-zip', color: 'text-amber-600' },
    'rar': { icon: 'mdi-folder-zip', color: 'text-amber-600' },
    'tar': { icon: 'mdi-folder-zip', color: 'text-amber-600' },
    'gz': { icon: 'mdi-folder-zip', color: 'text-amber-600' },
  };

  return iconMap[extension.toLowerCase()] || { icon: 'mdi-file-document-outline', color: 'text-gray-400' };
};


interface FileBreadcrumbProps {
  files?: FileMap;
  pathSegments?: string[];
  onFileSelect?: (filePath: string) => void;
}

const contextMenuVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.15,
      ease: cubicEasingFn,
    },
  },
  close: {
    y: 6,
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: cubicEasingFn,
    },
  },
} satisfies Variants;

export const FileBreadcrumb = memo<FileBreadcrumbProps>(({ files, pathSegments = [], onFileSelect }) => {
  renderLogger.trace('FileBreadcrumb');

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const contextMenuRef = useRef<HTMLDivElement | null>(null);
  const segmentRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const handleSegmentClick = (index: number) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        activeIndex !== null &&
        !contextMenuRef.current?.contains(event.target as Node) &&
        !segmentRefs.current.some((ref) => ref?.contains(event.target as Node))
      ) {
        setActiveIndex(null);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [activeIndex]);

  if (files === undefined || pathSegments.length === 0) {
    return null;
  }

  return (
    <div className="flex">
      {pathSegments.map((segment, index) => {
        const isLast = index === pathSegments.length - 1;

        const path = pathSegments.slice(0, index).join('/');

        if (!WORK_DIR_REGEX.test(path)) {
          return null;
        }

        const extension = getFileExtension(segment);
        const { icon, color } = getFileIconConfig(extension);
        const isActive = activeIndex === index;

        return (
          <div key={index} className="relative flex items-center">
            <DropdownMenu.Root open={isActive} modal={false}>
              <DropdownMenu.Trigger asChild>
                <span
                  ref={(ref) => (segmentRefs.current[index] = ref)}
                  className={classNames('flex items-center gap-1.5 cursor-pointer shrink-0', {
                    'text-bolt-elements-textTertiary hover:text-bolt-elements-textPrimary': !isActive,
                    'text-bolt-elements-textPrimary underline': isActive,
                    'pr-4': isLast,
                  })}
                  onClick={() => handleSegmentClick(index)}
                >
                  {isLast && <div className={`mdi ${icon} ${color}`} />}
                  {segment}
                </span>
              </DropdownMenu.Trigger>
              {index > 0 && !isLast && <span className="i-ph:caret-right inline-block mx-1" />}
              <AnimatePresence>
                {isActive && (
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      className="z-file-tree-breadcrumb"
                      asChild
                      align="start"
                      side="bottom"
                      avoidCollisions={false}
                    >
                      <motion.div
                        ref={contextMenuRef}
                        initial="close"
                        animate="open"
                        exit="close"
                        variants={contextMenuVariants}
                      >
                        <div className="rounded-lg overflow-hidden">
                          <div className="max-h-[50vh] min-w-[300px] overflow-scroll bg-bolt-elements-background-depth-1 border border-bolt-elements-borderColor shadow-sm rounded-lg">
                            <FileTree
                              files={files}
                              hideRoot
                              rootFolder={path}
                              collapsed
                              allowFolderSelection
                              selectedFile={`${path}/${segment}`}
                              onFileSelect={(filePath) => {
                                setActiveIndex(null);
                                onFileSelect?.(filePath);
                              }}
                            />
                          </div>
                        </div>
                        <DropdownMenu.Arrow className="fill-bolt-elements-borderColor" />
                      </motion.div>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                )}
              </AnimatePresence>
            </DropdownMenu.Root>
          </div>
        );
      })}
    </div>
  );
});
