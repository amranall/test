//@ts-nocheck
import { useStore } from '@nanostores/react';
import { AnimatePresence, motion } from 'framer-motion';
import JSZip from 'jszip';
import { computed } from 'nanostores';
import React from 'react';
import { memo, useEffect, useRef, useState } from 'react';
import { createHighlighter, type BundledLanguage, type BundledTheme, type HighlighterGeneric } from 'shiki';
import type { ActionState } from '~/lib/runtime/action-runner';
import { workbenchStore } from '~/lib/stores/workbench';
import useUser from '~/types/user';
import { classNames } from '~/utils/classNames';
import { cubicEasingFn } from '~/utils/easings';

const highlighterOptions = {
  langs: ['shell'],
  themes: ['light-plus', 'dark-plus'],
};

const shellHighlighter: HighlighterGeneric<BundledLanguage, BundledTheme> =
  import.meta.hot?.data.shellHighlighter ?? (await createHighlighter(highlighterOptions));

if (import.meta.hot) {
  import.meta.hot.data.shellHighlighter = shellHighlighter;
}

interface ArtifactProps {
  messageId: string;
}

export const Artifact = memo(({ messageId }: ArtifactProps) => {
  const userToggledActions = useRef(false);
  const [showActions, setShowActions] = useState(false);

  const artifacts = useStore(workbenchStore.artifacts);
  const artifact = artifacts[messageId];

  const actions = useStore(
    computed(artifact.runner.actions, (actions) => {
      return Object.values(actions);
    }),
  );

  const toggleActions = () => {
    userToggledActions.current = true;
    setShowActions(!showActions);
  };

  useEffect(() => {
    if (actions.length && !showActions && !userToggledActions.current) {
      setShowActions(true);
    }
  }, [actions]);

  return (
    <div className="artifact border border-bolt-elements-borderColor flex flex-col overflow-hidden rounded-lg w-full transition-border duration-150">
      <div className="flex">
        <button
          className="flex items-stretch bg-bolt-elements-artifacts-background hover:bg-bolt-elements-artifacts-backgroundHover w-full overflow-hidden"
          onClick={() => {
            const showWorkbench = workbenchStore.showWorkbench.get();
            workbenchStore.showWorkbench.set(!showWorkbench);
          }}
        >
          <div className="px-5 p-3.5 w-full text-left">
            <div className="w-full text-bolt-elements-textPrimary font-medium leading-5 text-sm">{artifact?.title}</div>
            <div className="w-full w-full text-bolt-elements-textSecondary text-xs mt-0.5">Click to open Code Editor</div>
          </div>
        </button>
        <div className="bg-bolt-elements-artifacts-borderColor w-[1px]" />
        <AnimatePresence>
          {actions.length && (
            <motion.button
              initial={{ width: 0 }}
              animate={{ width: 'auto' }}
              exit={{ width: 0 }}
              transition={{ duration: 0.15, ease: cubicEasingFn }}
              className="bg-bolt-elements-artifacts-background hover:bg-bolt-elements-artifacts-backgroundHover"
              onClick={toggleActions}
            >
              <div className="p-4">
                <div className={showActions ? 'i-ph:caret-up-bold' : 'i-ph:caret-down-bold'}></div>
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {showActions && actions.length > 0 && (
          <motion.div
            className="actions"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: '0px' }}
            transition={{ duration: 0.15 }}
          >
            <div className="bg-bolt-elements-artifacts-borderColor h-[1px]" />
            <div className="p-5 text-left bg-bolt-elements-actions-background">
              <ActionList actions={actions} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

interface ShellCodeBlockProps {
  classsName?: string;
  code: string;
}

function ShellCodeBlock({ classsName, code }: ShellCodeBlockProps) {
  return (
    <div
      className={classNames('text-xs', classsName)}
      dangerouslySetInnerHTML={{
        __html: shellHighlighter.codeToHtml(code, {
          lang: 'shell',
          theme: 'dark-plus',
        }),
      }}
    ></div>
  );
}

interface ActionListProps {
  actions: ActionState[];
}

const actionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface FileContent {
  type: 'file' | 'folder';
  content?: string;
  isBinary?: boolean;
}

interface FileStructure {
  [key: string]: FileContent;
}

interface ValueStructure {
  [key: string]: FileContent;
}


const ActionList = memo(({ actions }: ActionListProps) => {
  const createZipFromDist = async (fileStructure: FileStructure): Promise<Blob> => {
    const zip = new JSZip();

    Object.entries(fileStructure).forEach(([path, details]) => {
      if (details.type === 'file' && details.content) {
        const folders = path.split('/');
        let currentFolder = zip;

        if (folders.length > 1) {
          folders.slice(0, -1).forEach(folder => {
            if (folder) {
              currentFolder = currentFolder.folder(folder) || currentFolder;
            }
          });
        }

        const fileName = folders[folders.length - 1];
        if (details.isBinary) {
          currentFolder.file(fileName, details.content, { binary: true });
        } else {
          currentFolder.file(fileName, details.content);
        }
      }
    });

    return await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: {
        level: 9
      }
    });
  };

  const parseDistFolder = (value: ValueStructure): FileStructure => {
    const distFiles: FileStructure = {};

    Object.entries(value).forEach(([path, content]) => {
      if (path.startsWith('/home/project/dist')) {
        const relativePath = path.replace('/home/project/dist', '');

        if (relativePath === '') {
          return;
        }

        distFiles[relativePath] = {
          type: content.type,
          ...(content.type === 'file' && {
            content: content.content,
            isBinary: content.isBinary
          })
        };
      }
    });
    return distFiles;
  };

  const { getStoredToken } = useUser();
  const token = getStoredToken();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
      <ul className="list-none space-y-2.5">
        {actions.map((action, index) => {
          const { status, type, content } = action;
          const isLast = index === actions.length - 1;

          return (
            <motion.li
              key={index}
              variants={actionVariants}
              initial="hidden"
              animate="visible"
              transition={{
                duration: 0.2,
                ease: cubicEasingFn,
              }}
            >
              <div className="flex items-center gap-1.5 text-sm">
                <div className={classNames('text-lg', getIconColor(action.status))}>
                  {status === 'running' ? (
                    <div className="i-svg-spinners:90-ring-with-bg"></div>
                  ) : status === 'pending' ? (
                    <div className="i-ph:circle-duotone"></div>
                  ) : status === 'complete' ? (
                    <div className="i-ph:check"></div>
                  ) : status === 'failed' || status === 'aborted' ? (
                    <div className="i-ph:x"></div>
                  ) : null}
                </div>
                {type === 'file' ? (
                  <div>
                    Create{' '}
                    <code className="bg-bolt-elements-artifacts-inlineCode-background text-bolt-elements-artifacts-inlineCode-text px-1.5 py-1 rounded-md">
                      {action.filePath}
                    </code>
                  </div>
                ) : type === 'shell' ? (
                  <div className="flex items-center w-full min-h-[28px]">
                    <span className="flex-1">Run command</span>
                  </div>
                ) : null}
              </div>
              {type === 'shell' &&
                (
                  <>
                    <ShellCodeBlock
                      classsName={classNames('mt-1', {
                        'mb-3.5': !isLast,
                      })}
                      code={content}
                    />
                    {action.content === 'npx netlify deploy --prod' && action.status === 'complete' && (
                      <div key="deploy">
                        {(() => {
                          let displayValue = 'Deploying...';
                          let component: React.Component | null = null;

                          const updateDisplay = (value: string) => {
                            displayValue = value;
                            if (component) {
                              component.forceUpdate();
                            }
                          };

                          (async () => {
                            try {
                              const files = workbenchStore.files;
                              const fileStructure = parseDistFolder(files.value);
                              const zipBlob = await createZipFromDist(fileStructure);
                              const formData = new FormData();
                              formData.append('file', new File([zipBlob], 'dist.zip', {
                                type: 'application/x-zip-compressed'
                              }));
                            } catch (error) {
                              updateDisplay('Deployment failed: ' + (error as Error).message);
                            }
                          })();

                          class DisplayComponent extends React.Component {
                            constructor(props: {}) {
                              super(props);
                              component = this;
                            }

                            render() {
                              return (
                                <div className='my-2 flex items-center gap-1.5 text-sm'>
                                  {displayValue === 'Deploying...' ? (
                                    <>
                                      <div className="text-lg i-svg-spinners:90-ring-with-bg text-bolt-elements-loader-progress"></div>
                                      <span>Click to open your application</span>
                                    </>
                                  ):(
                                    <>
                                      <div className="text-lg i-ph:check text-bolt-elements-icon-success"></div>
                                      <a href={displayValue} target='_blank'>Click to open your application</a>
                                    </>
                                  )}
                                </div>
                              );
                            }
                          }
                          return <DisplayComponent />;
                        })()}
                      </div>
                    )}
                  </>
                )}
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
});

function getIconColor(status: ActionState['status']) {
  switch (status) {
    case 'pending': {
      return 'text-bolt-elements-textTertiary';
    }
    case 'running': {
      return 'text-bolt-elements-loader-progress';
    }
    case 'complete': {
      return 'text-bolt-elements-icon-success';
    }
    case 'aborted': {
      return 'text-bolt-elements-textSecondary';
    }
    case 'failed': {
      return 'text-bolt-elements-icon-error';
    }
    default: {
      return undefined;
    }
  }
}