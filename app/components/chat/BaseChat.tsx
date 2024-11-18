//@ts-nocheck
import type { Message } from 'ai';
import React, { useEffect, useRef, useState, type Dispatch, type ReactNode, type RefCallback, type SetStateAction } from 'react';
import { ClientOnly } from 'remix-utils/client-only';
import { MenuComponent } from '~/components/sidebar/Menu.client';
import { IconButton } from '~/components/ui/IconButton';
import { Workbench } from '~/components/workbench/Workbench.client';
import { classNames } from '~/utils/classNames';
import { Messages } from './Messages.client';
import { SendButton } from './SendButton.client';
import * as Select from "@radix-ui/react-select";

import styles from './BaseChat.module.scss';
import { PopoverHover } from '~/components/ui/PopoverHover';
import { AnimatePresence, motion } from "framer-motion";
import { type ModelInfo } from '~/utils/modelConstants';
import { debounce } from '~/utils/debounce';
import { themeStore } from '~/lib/stores/theme';
import MediaFile from '../others/MediaFile';
import { useStore } from '@nanostores/react';
import { Box, Link, Menu, Typography } from '@mui/material';
import useUser from '~/types/user';
import Icon from '@mdi/react';
import { mdiImageSizeSelectActual, mdiLinkBoxVariant, mdiPencilBox } from '@mdi/js';

interface BaseChatProps {
  textareaRef?: React.RefObject<HTMLTextAreaElement> | undefined;

  isDragging?: boolean;
  onDragOver?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (event: React.DragEvent<HTMLDivElement>) => void;

  fileInputRef?: React.RefObject<HTMLInputElement> | undefined;
  fileInputs?: FileList | null;
  removeFile?: (index: number) => void;
  handleFileInputChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;

  model?: string;
  provider?: string;
  setProviderModel?: (provider: string, model: string) => void;

  messageRef?: RefCallback<HTMLDivElement> | undefined;
  scrollRef?: RefCallback<HTMLDivElement> | undefined;
  showChat?: boolean;
  chatStarted?: boolean;
  isStreaming?: boolean;
  messages?: Message[];
  enhancingPrompt?: boolean;
  promptEnhanced?: boolean;
  input?: string;
  handleStop?: () => void;
  sendMessage?: (event: React.UIEvent, messageInput?: string) => void;
  handleInputChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  enhancePrompt?: () => void;

  setSignInOpen: (open: boolean) => void;
  handleCrawlerOpen: () => void;
  handleClickOpenWhiteBoard: () => void;

  open: boolean;
  anchorE2: HTMLElement | null;
  setAnchorE2: Dispatch<SetStateAction<HTMLElement | null>>;
  handleClose: () => void;
}

const EXAMPLE_PROMPTS = [
  { text: 'Build a todo app in React using Tailwind' },
  { text: 'Create a personal daily mood tracker' },
  { text: 'Build a Personal Portfolio website' },
];
const footerLinks = [
  {
    label: 'Enterprise',
    url: 'https://www.google.com',
  },
  {
    label: 'FAQ',
    url: 'https://www.google.com'
  },
  {
    label: 'Terms',
    url: 'https://policies.google.com'
  },
  {
    label: 'Privacy',
    url: 'https://policies.google.com'
  },
  {
    label: 'Websparks',
    url: 'https://www.google.com',
    external: true
  },
];

const TEXTAREA_MIN_HEIGHT = 76;

interface ModelSelectProps {
  chatStarted: boolean;
  model?: string;
  provider?: string;
  setProviderModel?: (provider: string, model: string) => void;
}
const ModelSelect = ({ chatStarted, model, provider, setProviderModel }: ModelSelectProps) => {
  const [search, setSearch] = React.useState("");
  const [filteredModels, setFilteredModels] = React.useState<ModelInfo[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchModels = React.useCallback(
    debounce(async (searchTerm: string) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({ search: searchTerm });
        const response = await fetch(`/api/models?${params}`);
        const data: ModelInfo[] = await response.json();
        setFilteredModels(data);
      } catch (error) {
        console.error('Model arama hatası:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  React.useEffect(() => {
    fetchModels(search);
  }, [search, fetchModels]);

  const providers = Array.from(new Set(filteredModels.map((model: any) => model.provider)));
  const currentModel: ModelInfo | undefined = filteredModels.find((m: any) => m.name === model && m.provider === provider);

  return (
    <Select.Root
      value={model ? `${provider}-${model}` : undefined}
      onValueChange={(value) => {
        const [provider, ...rest] = value.split('-');
        const model = rest.join('-');
        setProviderModel?.(provider, model)
      }}
    >
      <Select.Trigger className="inline-flex items-center justify-center gap-1 px-2 py-1 text-sm rounded bg-bolt-elements-background-depth-3 hover:bg-bolt-elements-background-depth-1 text-bolt-elements-textPrimary">
        <Select.Value>
          {isLoading && <div className="i-svg-spinners:90-ring-with-bg text-bolt-elements-loader-progress text-sm" />}
          {!isLoading && currentModel && (
            <div className="flex items-center gap-1">
              <div className="i-ph:gear text-sm" />
              <span className="truncate">{currentModel.label} (In: ${currentModel.inputPrice}, Out: ${currentModel.outputPrice})</span>
            </div>
          )}
          {!isLoading && !currentModel && <span>Select model</span>}
        </Select.Value>
        <div className="i-ph:caret-down text-sm opacity-50" />
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position={"popper"}
          side={"top"}
          sideOffset={5}
          className="overflow-hidden bg-bolt-elements-background-depth-1 rounded-md border border-bolt-elements-borderColor shadow-md z-50 w-[var(--radix-select-trigger-width)] min-w-[220px] max-h-50vh"
        >
          <div className="p-2 border-b border-bolt-elements-borderColor" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <input
                className="w-full px-2 py-1 text-sm bg-bolt-elements-background-depth-2 rounded border border-bolt-elements-borderColor focus:outline-none"
                placeholder="Search models..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
              />
              {isLoading && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <div className="i-svg-spinners:90-ring-with-bg text-bolt-elements-loader-progress text-sm" />
                </div>
              )}
            </div>
          </div>
          <Select.ScrollUpButton />
          <Select.Viewport className="p-2">
            {providers.map((providerName) => {
              const providerModels = filteredModels.filter(
                (model: any) => model.provider === providerName
              );

              if (providerModels.length === 0) return null;

              return (
                <Select.Group key={providerName}>
                  <Select.Label className="px-6 py-2 text-xs font-medium text-bolt-elements-textTertiary">
                    {providerName}
                  </Select.Label>
                  {providerModels.map((modelItem: any) => (
                    <Select.Item
                      key={`${modelItem.provider}-${modelItem.name}`}
                      value={`${modelItem.provider}-${modelItem.name}`}
                      className="relative flex items-center px-6 py-2 text-sm text-bolt-elements-textPrimary rounded select-none
                        hover:bg-bolt-elements-item-backgroundAccent
                        data-[disabled]:opacity-50
                        data-[disabled]:pointer-events-none
                        data-[highlighted]:bg-bolt-elements-item-backgroundAccent
                        data-[highlighted]:outline-none
                        cursor-default
                        focus:outline-none"
                    >
                      <Select.ItemText>{modelItem.label} (In: ${modelItem.inputPrice}, Out: ${modelItem.outputPrice})</Select.ItemText>
                      <Select.ItemIndicator className="absolute left-2">
                        <div className="i-ph:check text-sm" />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Group>
              );
            })}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}

type PlacementType = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  children: ReactNode;
  title: string | ReactNode;
  placement?: PlacementType;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  title,
  placement = 'top',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const getPlacementClasses = (): string => {
    const placements: Record<PlacementType, string> = {
      top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
      bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
      left: 'right-full top-1/2 -translate-y-1/2 mr-2',
      right: 'left-full top-1/2 -translate-y-1/2 ml-2'
    };
    return placements[placement];
  };

  const getArrowClasses = (): string => {
    const arrows: Record<PlacementType, string> = {
      top: 'bottom-[-4px] left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent',
      bottom: 'top-[-4px] left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent',
      left: 'right-[-4px] top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent',
      right: 'left-[-4px] top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent'
    };
    return arrows[placement];
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {isVisible && (
        <div
          className={`absolute z-50 pointer-events-none ${getPlacementClasses()}`}
          role="tooltip"
        >
          <div className="relative">
            <div className="bg-gray-900 text-white text-sm rounded-md py-1 px-2 whitespace-nowrap">
              {title}
              <div
                className={`absolute w-2 h-2 border-4 border-gray-900 ${getArrowClasses()}`}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export const BaseChat = React.forwardRef<HTMLDivElement, BaseChatProps>(
  (
    {
      textareaRef,

      isDragging,
      onDragOver,
      onDragLeave,
      onDrop,


      fileInputRef,
      fileInputs,
      removeFile,
      handleFileInputChange,

      messageRef,
      scrollRef,
      showChat = true,
      chatStarted = false,
      isStreaming = false,
      enhancingPrompt = false,
      promptEnhanced = false,
      messages,
      input = '',
      sendMessage,
      handleInputChange,
      enhancePrompt,
      handleStop,

      setSignInOpen,
      handleCrawlerOpen,
      handleClickOpenWhiteBoard,

      open,
      anchorE2,
      handleClose,
      setAnchorE2,
    },
    ref,
  ) => {
    const TEXTAREA_MAX_HEIGHT = chatStarted ? 400 : 100;
    const theme = useStore(themeStore);
    const { getStoredToken } = useUser();
    const tokenData = getStoredToken();

    const [micon, setMikeon] = useState(false);
    const [stopListening, setstoplistening] = useState(false);
    const recognition = useRef<globalThis.SpeechRecognition | null>(null);
    const vst = useRef(false);
    const trns = useRef<string>('');
    const trnsindx = useRef(0);
    const [isListening, setIsListening] = useState(false);
    const [startmicListening, setStartmicListening] = useState(false);
    const [speechRecognition, setSpeechRecognition] = useState(null);
    const mikeof = false;

    const handleSelectClick = (event: React.MouseEvent<HTMLElement>) => {
      if (tokenData) {
        setAnchorE2(event.currentTarget);
      }
      else {
        setSignInOpen(true)
      }
    };

    useEffect(() => {
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const sp = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (recognition.current === null) {
          recognition.current = new sp();
        }
      }

      return () => {
        if (recognition.current) {
          recognition.current.stop();
        }
      };
    }, []);

    const startListeningwk = () => {
      if (recognition.current == null) {
        return;
      }
      if (recognition.current && vst.current) {
        return;
      }
      recognition.current.onstart = function () {
        console.log("We are listening. Try speaking into the microphone.");
      };

      recognition.current.onspeechend = function () {
        if (recognition.current !== null) {
          recognition.current.stop();
          vst.current = false;
          trns.current = '';
          trnsindx.current = 0;
        }
      }
      recognition.current.onresult = function (event) {
        const speechResult = event.results[event.results.length - 1][0].transcript;

        // Create a synthetic event to match the textarea change event structure
        const syntheticEvent = {
          target: {
            value: trns.current + speechResult
          }
        } as React.ChangeEvent<HTMLTextAreaElement>;

        // Update the input through the provided handler
        handleInputChange(syntheticEvent);

        if (event.results[event.results.length - 1].isFinal) {
          // Update the accumulated transcript
          trns.current = trns.current + speechResult;

          // Update the input one final time with the complete transcript
          const finalEvent = {
            target: {
              value: trns.current
            }
          } as React.ChangeEvent<HTMLTextAreaElement>;

          handleInputChange(finalEvent);
        }
      };
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = 'en';
      recognition.current.start();
      trnsindx.current = 0;
      vst.current = true;
    };
    const stopListeningwk = () => {
      if (recognition.current !== null) {
        recognition.current.stop();
        // vst.current = false;
        // trns.current = '';
        // trnsindx.current = 0;
      }
    };

    const startlist = startListeningwk
    const stoplist = stopListeningwk

    useEffect(() => {
      if (mikeof) {
        stoplist();
        setstoplistening(false);
        setMikeon(false);
      }
    }, [mikeof]);

    useEffect(() => {
      if (micon && startmicListening) {
        startlist();
        setStartmicListening(false);
      }
    }, [micon]);

    useEffect(() => {
      if (stopListening) {
        stoplist();
        setstoplistening(false);

      }
    }, [stopListening])

    const handleMicClick = () => {
      if (tokenData) {
        if (!speechRecognition) {
          startListeningwk();
          setIsListening(!isListening);
        }

        if (isListening) {
          stopListeningwk();
        } else {
          startListeningwk()
          setIsListening(!isListening);
        }
      }
      else {
        setSignInOpen(true)
      }
    };

    return (
      <div
        ref={ref}
        className={classNames(
          styles.BaseChat,
          'relative flex h-full w-full overflow-hidden bg-bolt-elements-background-depth-1',
        )}
        data-chat-visible={showChat}

        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <AnimatePresence>
          {isDragging && (
            <motion.div
              className="fixed pointer-events-none top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-bolt-elements-background-depth-1 z-50 backdrop-filter backdrop-blur-[32px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
            >
              <div className="i-ph:file text-4xl text-bolt-elements-textPrimary"></div>
              <div className="text-bolt-elements-textPrimary">Drop files here</div>
            </motion.div>
          )}
        </AnimatePresence>
        <ClientOnly>{() => <MenuComponent chatStarted={chatStarted} />}</ClientOnly>
        <div ref={scrollRef} className="flex overflow-y-auto w-full h-full">
          <div className={classNames(styles.Chat, 'flex flex-col flex-grow min-w-[var(--chat-min-width)] h-full')}>
            {!chatStarted && (
              <MediaFile fileInputRef={fileInputRef} handleFileInputChange={handleFileInputChange} setSignInOpen={setSignInOpen} handleCrawlerOpen={handleCrawlerOpen} handleClickOpenWhiteBoard={handleClickOpenWhiteBoard} />
            )}
            <div
              className={classNames('pt-6 px-6', {
                'h-full flex flex-col': chatStarted,
              })}
            >
              <ClientOnly>
                {() => {
                  return chatStarted ? (
                    <Messages
                      ref={messageRef}
                      className="flex flex-col w-full flex-1 max-w-chat px-4 pb-6 mx-auto z-1"
                      messages={messages}
                      isStreaming={isStreaming}
                    />
                  ) : null;
                }}
              </ClientOnly>
              {!chatStarted && (
                <div id="examples" style={{ maxWidth: 900 }} className="relative w-full mx-auto mt-2 mb-6 flex justify-center">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {EXAMPLE_PROMPTS.map((examplePrompt, index) => {
                      return (
                        <button
                          key={index}
                          onClick={(event) => {
                            sendMessage?.(event, examplePrompt.text);
                          }}
                          className="group border border-bolt-elements-textTertiary hover:border-bolt-elements-textPrimary flex items-center gap-2 px-3 rounded-full justify-center bg-transparent text-bolt-elements-textTertiary hover:text-bolt-elements-textPrimary transition-theme"
                        >
                          {examplePrompt.text}
                          <div className="i-ph:arrow-bend-down-left" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              <div
                className={classNames('relative w-full mx-auto z-prompt', {
                  'sticky bottom-0': chatStarted,
                })}
                style={{
                  maxWidth: 900
                }}
              >
                <div
                  className={classNames(
                    'shadow-sm border border-bolt-elements-borderColor bg-bolt-elements-prompt-background backdrop-filter backdrop-blur-[8px] rounded-lg overflow-hidden',
                  )}
                >
                  {fileInputs && (
                    <div className="flex flex-col gap-5 bg-bolt-elements-background-depth-1 p-4">
                      <div className="px-5 flex gap-5">
                        {Array.from(fileInputs).map((file, index) => {
                          return (
                            <div className="relative" key={index}>
                              <div
                                className="relative flex rounded-lg border border-bolt-elements-borderColor overflow-hidden">
                                <PopoverHover>
                                  <PopoverHover.Trigger>
                                    <button className="h-20 w-20 bg-transparent outline-none">
                                      {file.type.includes('image') ? (
                                        <img
                                          className="object-cover w-full h-full"
                                          src={URL.createObjectURL(file)}
                                          alt={file.name}
                                        />
                                      ) : (
                                        <div className="flex items-center justify-center w-full h-full text-bolt-elements-textTertiary">
                                          <div className="i-ph:file" />
                                        </div>
                                      )}
                                    </button>
                                  </PopoverHover.Trigger>
                                  <PopoverHover.Content>
                                    <span className="text-xs text-bolt-elements-textTertiary">
                                      {file.name}
                                    </span>
                                  </PopoverHover.Content>
                                </PopoverHover>
                              </div>
                              <button
                                className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 rounded-full w-[18px] h-[18px] flex items-center justify-center z-1 bg-bolt-elements-background-depth-1 hover:bg-bolt-elements-background-depth-3 border border-bolt-elements-borderColor text-bolt-elements-button-secondary-text"
                                onClick={() => removeFile?.(index)}
                              >
                                <div className="i-ph:x scale-70"></div>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <div className='relative'>
                    <textarea
                      ref={textareaRef}
                      className={`w-full pl-4 pt-4 pr-16 focus:outline-none resize-none text-md text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary bg-transparent`}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          if (event.shiftKey) {
                            return;
                          }

                          event.preventDefault();

                          sendMessage?.(event);
                          if(isListening){
                            stopListeningwk();
                            setIsListening(!isListening);
                          }
                        }
                      }}
                      value={input}
                      onChange={(event) => {
                        handleInputChange?.(event);
                      }}
                      style={{
                        minHeight: TEXTAREA_MIN_HEIGHT,
                        maxHeight: TEXTAREA_MAX_HEIGHT,
                      }}
                      placeholder="Hey! What you want to Build?"
                      translate="no"
                    />
                    <ClientOnly>
                      {() => (
                        <SendButton
                          show={input.length > 0 || isStreaming}
                          isStreaming={isStreaming}
                          onClick={(event) => {
                            if (isStreaming) {
                              handleStop?.();
                              return;
                            }
                            sendMessage?.(event);
                            if(isListening){
                              stopListeningwk();
                              setIsListening(!isListening);
                            }
                          }}
                        />
                      )}
                    </ClientOnly>
                  </div>
                  <div className="flex justify-between text-sm p-4 pt-2">
                    <div className="flex gap-1 items-center">
                      <div className="pr-1.5">
                        <Tooltip title="Attachment" placement="top">
                          <button
                            disabled={isStreaming}
                            className="flex items-center text-bolt-elements-item-contentDefault bg-transparent enabled:hover:text-bolt-elements-item-contentActive rounded-md enabled:hover:bg-bolt-elements-item-backgroundActive disabled:cursor-not-allowed p-1"
                            onClick={handleSelectClick}
                          >
                            <div className="i-ph:link text-xl" />
                          </button>
                        </Tooltip>
                      </div>
                      <div className="pr-1.5">
                        <Tooltip title="Mic" placement="top">
                          <button
                            className="flex items-center text-bolt-elements-item-contentDefault bg-transparent enabled:hover:text-bolt-elements-item-contentActive rounded-md enabled:hover:bg-bolt-elements-item-backgroundActive disabled:cursor-not-allowed p-1"
                            onClick={() => handleMicClick()}
                            disabled={isStreaming}
                          >
                            <i
                              className={`bi ${isListening ? 'bi-pause' : 'bi-mic'}`}
                              style={{ fontSize: 20 }}
                            />
                          </button>
                        </Tooltip>
                      </div>


                      <Tooltip title="AI Magic" placement="top">
                        <IconButton
                          disabled={input.length === 0 || enhancingPrompt}
                          className={classNames({
                            'opacity-100': enhancingPrompt,
                            'text-bolt-elements-item-contentAccent pr-1.5 enabled:hover:bg-bolt-elements-item-backgroundAccent':
                              promptEnhanced
                          })}
                          onClick={() => enhancePrompt?.()}
                        >
                          {enhancingPrompt ? (
                            <>
                              <div className="i-svg-spinners:90-ring-with-bg text-bolt-elements-loader-progress text-xl" />
                              <div className="ml-1.5">Enhancing prompt...</div>
                            </>
                          ) : (
                            <>
                              <div className="bi bi-stars text-xl" />
                              {promptEnhanced && <div className="ml-1.5">AI Magic</div>}
                            </>
                          )}
                        </IconButton>
                      </Tooltip>
                      {/* <ModelSelect
                        chatStarted={chatStarted}
                        model={model}
                        provider={provider}
                        setProviderModel={setProviderModel}
                      /> */}
                    </div>
                    {input.length > 3 ? (
                      <div className="text-xs text-bolt-elements-textTertiary">
                        Use <kbd className="kdb">Shift</kbd> + <kbd className="kdb">Return</kbd> for a new line
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="bg-bolt-elements-background-depth-1 pb-6">{/* Ghost Element */}</div>
              </div>
              <Menu
                anchorEl={anchorE2}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
                transformOrigin={{ horizontal: 'center', vertical: 'top' }}
              >
                <Box px={2} py={1} display={'flex'} alignItems={'center'} gap={1}>
                  <Box onClick={() => tokenData ? fileInputRef?.current?.click() : setSignInOpen(true)} border={`1px solid #d3d3d3`} borderRadius={2} p={2} sx={{ cursor: 'pointer' }}>
                    <Box display={'flex'} justifyContent={'center'}>
                      <Icon path={mdiImageSizeSelectActual} size={2} />
                    </Box>
                    <p>From Image</p>
                    <input type="file"
                      ref={fileInputRef}
                      aria-hidden="true"
                      accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.pdf,.txt,.doc,.docx,.py,.ipynb,.js,.mjs,.cjs,.jsx,.html,.css,.scss,.sass,.ts,.tsx,.java,.cs,.php,.c,.cc,.cpp,.cxx,.h,.hh,.hpp,.rs,.swift,.go,.rb,.kt,.kts,.scala,.sh,.bash,.zsh,.bat,.csv,.log,.ini,.cfg,.config,.json,.yaml,.yml,.toml,.lua,.sql,.md,.tex,.latex,.asm,.ino,.s"
                      multiple
                      style={{ display: 'none', visibility: 'hidden' }}
                      onChange={handleFileInputChange}
                    />
                  </Box>
                  <Box
                    onClick={handleClickOpenWhiteBoard}
                    border={`1px solid #d3d3d3`} borderRadius={2} p={2} sx={{ cursor: 'pointer' }}>
                    <Box display={'flex'} justifyContent={'center'}>
                      <Icon path={mdiPencilBox} size={2} />
                    </Box>
                    <p>From Whiteboard</p>
                  </Box>
                  <Box
                    onClick={handleCrawlerOpen}
                    border={`1px solid #d3d3d3`} borderRadius={2} p={2} sx={{ cursor: 'pointer' }}>
                    <Box display={'flex'} justifyContent={'center'}>
                      <Icon path={mdiLinkBoxVariant} size={2} />
                    </Box>
                    <p>From Crawler</p>
                  </Box>
                </Box>
              </Menu>
            </div>
          </div>
          <ClientOnly>{() => <Workbench sendMessage={sendMessage} chatStarted={chatStarted} isStreaming={isStreaming} />}</ClientOnly>
        </div>
        <Box position={'absolute'} bottom={0} width={'100%'} zIndex={9999} display={'flex'} justifyContent={'center'}>
          <Box display={{ xs: 'none', sm: 'flex' }} gap={1} alignItems="center">
            {footerLinks.map((link, index) => (
              <Box key={link.label} display="flex" alignItems="center">
                <Link href={link.url} underline="hover" color="inherit">
                  <Typography className={'text-bolt-elements-textPrimary'} fontSize={{ xs: 7, sm: 12 }} fontFamily={`"Montserrat", serif;`}>
                    {link.label}
                  </Typography>
                </Link>
                {link.external && <i className="bi bi-box-arrow-up-right" style={{ fontSize: 12, marginLeft: 5 }}></i>}
                {index < footerLinks.length - 1 && (
                  <Typography mx={1} className={'text-bolt-elements-borderColor'} fontFamily={`"Montserrat", serif;`}>
                    |
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </div>
    );
  },
);
