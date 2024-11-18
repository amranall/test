import { memo, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { FileMap } from '~/lib/stores/files';
import { classNames } from '~/utils/classNames';
import { createScopedLogger, renderLogger } from '~/utils/logger';

const logger = createScopedLogger('FileTree');

const NODE_PADDING_LEFT = 8;
const DEFAULT_HIDDEN_FILES = [/\/node_modules\//, /\/\.next/, /\/\.astro/];

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

interface FolderIconConfig {
  icon: string;
  color: string;
}

const getFolderIconConfig = (name: string): FolderIconConfig => {
  // Special folder names and their custom icons
  const specialFolders: { [key: string]: FolderIconConfig } = {
    'node_modules': { icon: 'mdi-npm', color: 'text-red-500' },
    'src': { icon: 'mdi-folder', color: 'text-blue-500' },
    'dist': { icon: 'mdi-folder-download', color: 'text-green-500' },
    'public': { icon: 'mdi-folder-network', color: 'text-purple-500' },
    'assets': { icon: 'mdi-folder-image', color: 'text-yellow-500' },
    'components': { icon: 'mdi-folder-table', color: 'text-cyan-500' },
    'pages': { icon: 'mdi-file-document-multiple', color: 'text-indigo-500' },
    'api': { icon: 'mdi-api', color: 'text-green-600' },
    'docs': { icon: 'mdi-folder-information', color: 'text-blue-400' },
    'tests': { icon: 'mdi-test-tube', color: 'text-green-400' },
    'config': { icon: 'mdi-cog', color: 'text-gray-500' },
    'build': { icon: 'mdi-folder-wrench', color: 'text-orange-500' },
    'scripts': { icon: 'mdi-script-text', color: 'text-purple-400' },
    'styles': { icon: 'mdi-palette', color: 'text-pink-500' },
    'translations': { icon: 'mdi-translate', color: 'text-blue-500' },
    'hooks': { icon: 'mdi-hook', color: 'text-cyan-500' },
    'utils': { icon: 'mdi-tools', color: 'text-gray-500' },
    'lib': { icon: 'mdi-bookshelf', color: 'text-yellow-600' },
    'models': { icon: 'mdi-database', color: 'text-green-500' },
    'interfaces': { icon: 'mdi-puzzle', color: 'text-purple-500' },
  };

  return specialFolders[name.toLowerCase()] || { icon: 'mdi-folder', color: 'text-yellow-400' };
};

interface Props {
  files?: FileMap;
  selectedFile?: string;
  onFileSelect?: (filePath: string) => void;
  rootFolder?: string;
  hideRoot?: boolean;
  collapsed?: boolean;
  allowFolderSelection?: boolean;
  hiddenFiles?: Array<string | RegExp>;
  unsavedFiles?: Set<string>;
  className?: string;
}

export const FileTree = memo(
  ({
    files = {},
    onFileSelect,
    selectedFile,
    rootFolder,
    hideRoot = false,
    collapsed = false,
    allowFolderSelection = false,
    hiddenFiles,
    className,
    unsavedFiles,
  }: Props) => {
    renderLogger.trace('FileTree');

    const computedHiddenFiles = useMemo(() => [...DEFAULT_HIDDEN_FILES, ...(hiddenFiles ?? [])], [hiddenFiles]);

    const fileList = useMemo(() => {
      return buildFileList(files, rootFolder, hideRoot, computedHiddenFiles);
    }, [files, rootFolder, hideRoot, computedHiddenFiles]);

    const [collapsedFolders, setCollapsedFolders] = useState(() => {
      return collapsed
        ? new Set(fileList.filter((item) => item.kind === 'folder').map((item) => item.fullPath))
        : new Set<string>();
    });

    useEffect(() => {
      if (collapsed) {
        setCollapsedFolders(new Set(fileList.filter((item) => item.kind === 'folder').map((item) => item.fullPath)));
        return;
      }

      setCollapsedFolders((prevCollapsed) => {
        const newCollapsed = new Set<string>();

        for (const folder of fileList) {
          if (folder.kind === 'folder' && prevCollapsed.has(folder.fullPath)) {
            newCollapsed.add(folder.fullPath);
          }
        }

        return newCollapsed;
      });
    }, [fileList, collapsed]);

    const filteredFileList = useMemo(() => {
      const list = [];

      let lastDepth = Number.MAX_SAFE_INTEGER;

      for (const fileOrFolder of fileList) {
        const depth = fileOrFolder.depth;

        // if the depth is equal we reached the end of the collaped group
        if (lastDepth === depth) {
          lastDepth = Number.MAX_SAFE_INTEGER;
        }

        // ignore collapsed folders
        if (collapsedFolders.has(fileOrFolder.fullPath)) {
          lastDepth = Math.min(lastDepth, depth);
        }

        // ignore files and folders below the last collapsed folder
        if (lastDepth < depth) {
          continue;
        }

        list.push(fileOrFolder);
      }

      return list;
    }, [fileList, collapsedFolders]);

    const toggleCollapseState = (fullPath: string) => {
      setCollapsedFolders((prevSet) => {
        const newSet = new Set(prevSet);

        if (newSet.has(fullPath)) {
          newSet.delete(fullPath);
        } else {
          newSet.add(fullPath);
        }

        return newSet;
      });
    };

    return (
      <div className={classNames('text-sm', className)}>
        {filteredFileList.map((fileOrFolder) => {
          switch (fileOrFolder.kind) {
            case 'file': {
              return (
                <File
                  key={fileOrFolder.id}
                  selected={selectedFile === fileOrFolder.fullPath}
                  file={fileOrFolder}
                  unsavedChanges={unsavedFiles?.has(fileOrFolder.fullPath)}
                  onClick={() => {
                    onFileSelect?.(fileOrFolder.fullPath);
                  }}
                />
              );
            }
            case 'folder': {
              return (
                <Folder
                  key={fileOrFolder.id}
                  folder={fileOrFolder}
                  selected={allowFolderSelection && selectedFile === fileOrFolder.fullPath}
                  collapsed={collapsedFolders.has(fileOrFolder.fullPath)}
                  onClick={() => {
                    toggleCollapseState(fileOrFolder.fullPath);
                  }}
                />
              );
            }
            default: {
              return undefined;
            }
          }
        })}
      </div>
    );
  },
);

export default FileTree;

interface FolderProps {
  folder: FolderNode;
  collapsed: boolean;
  selected?: boolean;
  onClick: () => void;
}


function Folder({ folder: { depth, name }, collapsed, selected = false, onClick }: FolderProps) {
  const { icon, color } = getFolderIconConfig(name);
  
  return (
    <NodeButton
      className={classNames('group', {
        'bg-transparent text-bolt-elements-item-contentDefault hover:text-bolt-elements-item-contentActive hover:bg-bolt-elements-item-backgroundActive':
          !selected,
        'bg-bolt-elements-item-backgroundAccent text-bolt-elements-item-contentAccent': selected,
      })}
      depth={depth}
      iconClasses={classNames(`mdi ${icon} scale-98`, color)}
      onClick={onClick}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <span className="truncate">{name}</span>
        </div>
        <div 
          className={classNames(color, {
            'i-ph:caret-right scale-98': collapsed,
            'i-ph:caret-down scale-98': !collapsed,
          })}
        />
      </div>
    </NodeButton>
  );
}

interface FileProps {
  file: FileNode;
  selected: boolean;
  unsavedChanges?: boolean;
  onClick: () => void;
}

function File({ file: { depth, name }, onClick, selected, unsavedChanges = false }: FileProps) {
  const extension = getFileExtension(name);
  const { icon, color } = getFileIconConfig(extension);
  // Log the file extension when the component mounts or updates
  useEffect(() => {
  }, [name, extension]);
  return (
    <NodeButton
      className={classNames('group', {
        'bg-transparent hover:bg-bolt-elements-item-backgroundActive text-bolt-elements-item-contentDefault': !selected,
        'bg-bolt-elements-item-backgroundAccent text-bolt-elements-item-contentAccent': selected,
      })}
      depth={depth}
      iconClasses={classNames(`mdi ${icon} scale-98`, color, {
        'group-hover:text-bolt-elements-item-contentActive': !selected,
      })}
      onClick={onClick}
    >
      <div
        className={classNames('flex items-center', {
          'group-hover:text-bolt-elements-item-contentActive': !selected,
        })}
      >
        <div className="flex-1 truncate pr-2">{name}</div>
        {unsavedChanges && <span className="i-ph:circle-fill scale-68 shrink-0 text-orange-500" />}
      </div>
    </NodeButton>
  );
}

interface ButtonProps {
  depth: number;
  iconClasses: string;
  folderIcon?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

function NodeButton({ depth, iconClasses, folderIcon, onClick, className, children }: ButtonProps) {
  return (
    <button
      className={classNames(
        'flex items-center gap-1.5 w-full pr-2 border-2 border-transparent text-faded py-0.5',
        className,
      )}
      style={{ paddingLeft: `${6 + depth * NODE_PADDING_LEFT}px` }}
      onClick={() => onClick?.()}
    >
      <div className="flex items-center">
        <div className={classNames('scale-120 shrink-0', iconClasses)} />
        {folderIcon && <div className={classNames('scale-120 shrink-0', folderIcon)} />}
      </div>
      <div className="truncate w-full text-left">{children}</div>
    </button>
  );
}


type Node = FileNode | FolderNode;

interface BaseNode {
  id: number;
  depth: number;
  name: string;
  fullPath: string;
}

interface FileNode extends BaseNode {
  kind: 'file';
}

interface FolderNode extends BaseNode {
  kind: 'folder';
}

function buildFileList(
  files: FileMap,
  rootFolder = '/',
  hideRoot: boolean,
  hiddenFiles: Array<string | RegExp>,
): Node[] {
  const folderPaths = new Set<string>();
  const fileList: Node[] = [];

  let defaultDepth = 0;

  if (rootFolder === '/' && !hideRoot) {
    defaultDepth = 1;
    fileList.push({ kind: 'folder', name: '/', depth: 0, id: 0, fullPath: '/' });
  }

  for (const [filePath, dirent] of Object.entries(files)) {
    const segments = filePath.split('/').filter((segment) => segment);
    const fileName = segments.at(-1);

    if (!fileName || isHiddenFile(filePath, fileName, hiddenFiles)) {
      continue;
    }

    let currentPath = '';

    let i = 0;
    let depth = 0;

    while (i < segments.length) {
      const name = segments[i];
      const fullPath = (currentPath += `/${name}`);

      if (!fullPath.startsWith(rootFolder) || (hideRoot && fullPath === rootFolder)) {
        i++;
        continue;
      }

      if (i === segments.length - 1 && dirent?.type === 'file') {
        fileList.push({
          kind: 'file',
          id: fileList.length,
          name,
          fullPath,
          depth: depth + defaultDepth,
        });
      } else if (!folderPaths.has(fullPath)) {
        folderPaths.add(fullPath);

        fileList.push({
          kind: 'folder',
          id: fileList.length,
          name,
          fullPath,
          depth: depth + defaultDepth,
        });
      }

      i++;
      depth++;
    }
  }

  return sortFileList(rootFolder, fileList, hideRoot);
}

function isHiddenFile(filePath: string, fileName: string, hiddenFiles: Array<string | RegExp>) {
  return hiddenFiles.some((pathOrRegex) => {
    if (typeof pathOrRegex === 'string') {
      return fileName === pathOrRegex;
    }

    return pathOrRegex.test(filePath);
  });
}

/**
 * Sorts the given list of nodes into a tree structure (still a flat list).
 *
 * This function organizes the nodes into a hierarchical structure based on their paths,
 * with folders appearing before files and all items sorted alphabetically within their level.
 *
 * @note This function mutates the given `nodeList` array for performance reasons.
 *
 * @param rootFolder - The path of the root folder to start the sorting from.
 * @param nodeList - The list of nodes to be sorted.
 *
 * @returns A new array of nodes sorted in depth-first order.
 */
function sortFileList(rootFolder: string, nodeList: Node[], hideRoot: boolean): Node[] {
  logger.trace('sortFileList');

  const nodeMap = new Map<string, Node>();
  const childrenMap = new Map<string, Node[]>();

  // pre-sort nodes by name and type
  nodeList.sort((a, b) => compareNodes(a, b));

  for (const node of nodeList) {
    nodeMap.set(node.fullPath, node);

    const parentPath = node.fullPath.slice(0, node.fullPath.lastIndexOf('/'));

    if (parentPath !== rootFolder.slice(0, rootFolder.lastIndexOf('/'))) {
      if (!childrenMap.has(parentPath)) {
        childrenMap.set(parentPath, []);
      }

      childrenMap.get(parentPath)?.push(node);
    }
  }

  const sortedList: Node[] = [];

  const depthFirstTraversal = (path: string): void => {
    const node = nodeMap.get(path);

    if (node) {
      sortedList.push(node);
    }

    const children = childrenMap.get(path);

    if (children) {
      for (const child of children) {
        if (child.kind === 'folder') {
          depthFirstTraversal(child.fullPath);
        } else {
          sortedList.push(child);
        }
      }
    }
  };

  if (hideRoot) {
    // if root is hidden, start traversal from its immediate children
    const rootChildren = childrenMap.get(rootFolder) || [];

    for (const child of rootChildren) {
      depthFirstTraversal(child.fullPath);
    }
  } else {
    depthFirstTraversal(rootFolder);
  }

  return sortedList;
}

function compareNodes(a: Node, b: Node): number {
  if (a.kind !== b.kind) {
    return a.kind === 'folder' ? -1 : 1;
  }

  return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
}
