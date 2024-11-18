import { Box, Typography } from '@mui/material';
import Logo from '../../../icons/roundedlogo.svg'
import SuggestIcon from '../../../icons/suggesticon.svg'
import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import { themeStore } from '~/lib/stores/theme';
import { useStore } from '@nanostores/react';
import useUser from '~/types/user';

interface ProcessingCardProps {
    title: string;
    subtitle: string;
    children: ReactNode;
    onClick?: () => void;
}

const ProcessingCard = ({ title, subtitle, children, onClick  }: ProcessingCardProps) => {
    return(
    <div onClick={onClick} className="relative flex-1 rounded-3xl p-6 bg-bolt-elements-background-depth-2 cursor-pointer">
        <div className="space-y-1 mb-4">
            <p className="text-xs text-zinc-500">{subtitle}</p>
            <p className="font-medium text-bolt-elements-textPrimary">{title}</p>
        </div>
        <div className="flex items-center justify-center h-40 relative mb-5">
            {children}
        </div>
        <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>time</span>
                <span>Processing 90%</span>
            </div>
        </div>
    </div>
)
};
 
interface HeaderProps{
    fileInputRef?: React.RefObject<HTMLInputElement> | undefined;
    handleFileInputChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleClickOpenWhiteBoard:()=> void;
    handleCrawlerOpen:()=> void;
    setSignInOpen: (open: boolean) => void;
}

const MediaFile:React.FC <HeaderProps> = ({fileInputRef, handleFileInputChange, handleClickOpenWhiteBoard, handleCrawlerOpen, setSignInOpen = () => {}}) => {
    const theme = useStore(themeStore);
    const { getStoredToken } = useUser();
    const token = getStoredToken();

    useEffect(() => {
    }, [theme]);

    const checkAuthAndExecute = useCallback((action: () => void) => {
        if (!token) {
            try {
                if (typeof setSignInOpen === 'function') {
                    setSignInOpen(true);
                } else {
                    console.error('setSignInOpen is not a function');
                }
            } catch (error) {
                console.error('Error calling setSignInOpen:', error);
            }
            return;
        }
        action();
    }, [token, setSignInOpen]);

    const fileClick =()=>{
        fileInputRef?.current?.click()
    }

    return (
        <>
            <div id="intro" className="mt-[3vh] mb-[2vh] w-full flex justify-center">
                <div className='max-w-chat' style={{ minWidth: 900 }}>
                    <Box width={'100%'} display={'flex'} mb={2}>
                        <Box
                            component={'img'}
                            src={Logo}
                            height={60}
                            width={'auto'}
                        />
                    </Box>
                    <h1 className="text-3xl text-bolt-elements-textPrimary mb-2">
                        Welcome To <span className={'font-bold'}>Websparks AI</span>
                    </h1>
                    <p className="text-2xl mb-4 text-bolt-elements-textSecondary">
                        What you want to Build?
                    </p>
                </div>
            </div>
            <div className="justify-center w-full flex mb-[1vh]">
                <div className='flex flex-wrap gap-1 items-center' style={{ minWidth: 900 }}>
                    <Box
                        component={'img'}
                        src={SuggestIcon}
                        height={20}
                        width={'auto'}
                    />
                    <Typography fontFamily={'Montserrat'} className={'text-bolt-elements-textSecondary'}>Suggested</Typography>
                </div>
            </div>
            <div className="justify-center w-full flex">
                <div className='flex flex-wrap gap-4 justify-center' style={{ minWidth: 900 }}>
                    <ProcessingCard title="From Figma/Image" subtitle="From Figma/Image" onClick={() => token ? fileClick() : setSignInOpen(true)}>
                        {theme === 'light' ? (
                            <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 40 54" fill="none" style={{position:'absolute', opacity:0.1}}>
                                <path d="M20.5003 27C20.5003 22.3539 24.7026 18.5 30.0002 18.5C35.2975 18.5 39.5 22.3539 39.5 27C39.5 31.6462 35.2975 35.5 30.0002 35.5C24.7026 35.5 20.5003 31.6462 20.5003 27Z" stroke="black"/>
                                <path d="M0.5 45C0.5 40.3539 4.70238 36.5 9.99985 36.5H19.4997V45C19.4997 49.6462 15.2974 53.5 9.99985 53.5C4.70237 53.5 0.5 49.6462 0.5 45Z" stroke="black"/>
                                <path d="M30.0002 17.5H20.5003V0.5H30.0002C35.2977 0.5 39.5 4.35383 39.5 9.00001C39.5 13.6462 35.2977 17.5 30.0002 17.5Z" stroke="black"/>
                                <path d="M9.99985 17.5C4.70237 17.5 0.5 13.6462 0.5 9.00002C0.5 4.35383 4.70237 0.5 9.99985 0.5H19.4997V17.5H9.99985Z" stroke="black"/>
                                <path d="M9.99985 35.5C4.70237 35.5 0.5 31.6462 0.5 27C0.5 22.3539 4.70238 18.5 9.99985 18.5H19.4997V35.5H9.99985Z" stroke="black"/>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="54" viewBox="0 0 40 54" fill="none" className='text-bolt-elements-textPrimary'>
                                <path d="M20.5003 27C20.5003 22.3539 24.7026 18.5 30.0002 18.5C35.2975 18.5 39.5 22.3539 39.5 27C39.5 31.6462 35.2975 35.5 30.0002 35.5C24.7026 35.5 20.5003 31.6462 20.5003 27Z" stroke="black"/>
                                <path d="M0.5 45C0.5 40.3539 4.70238 36.5 9.99985 36.5H19.4997V45C19.4997 49.6462 15.2974 53.5 9.99985 53.5C4.70237 53.5 0.5 49.6462 0.5 45Z" stroke="black"/>
                                <path d="M30.0002 17.5H20.5003V0.5H30.0002C35.2977 0.5 39.5 4.35383 39.5 9.00001C39.5 13.6462 35.2977 17.5 30.0002 17.5Z" stroke="black"/>
                                <path d="M9.99985 17.5C4.70237 17.5 0.5 13.6462 0.5 9.00002C0.5 4.35383 4.70237 0.5 9.99985 0.5H19.4997V17.5H9.99985Z" stroke="black"/>
                                <path d="M9.99985 35.5C4.70237 35.5 0.5 31.6462 0.5 27C0.5 22.3539 4.70238 18.5 9.99985 18.5H19.4997V35.5H9.99985Z" stroke="black"/>
                            </svg>
                            
                            </>
                        ):(
                            <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 40 54" fill="none" style={{position:'absolute', opacity:0.1}}>
                                <path d="M20.5003 27C20.5003 22.3539 24.7026 18.5 30.0002 18.5C35.2975 18.5 39.5 22.3539 39.5 27C39.5 31.6462 35.2975 35.5 30.0002 35.5C24.7026 35.5 20.5003 31.6462 20.5003 27Z" stroke="white"/>
                                <path d="M0.5 45C0.5 40.3539 4.70238 36.5 9.99985 36.5H19.4997V45C19.4997 49.6462 15.2974 53.5 9.99985 53.5C4.70237 53.5 0.5 49.6462 0.5 45Z" stroke="white"/>
                                <path d="M30.0002 17.5H20.5003V0.5H30.0002C35.2977 0.5 39.5 4.35383 39.5 9.00001C39.5 13.6462 35.2977 17.5 30.0002 17.5Z" stroke="white"/>
                                <path d="M9.99985 17.5C4.70237 17.5 0.5 13.6462 0.5 9.00002C0.5 4.35383 4.70237 0.5 9.99985 0.5H19.4997V17.5H9.99985Z" stroke="white"/>
                                <path d="M9.99985 35.5C4.70237 35.5 0.5 31.6462 0.5 27C0.5 22.3539 4.70238 18.5 9.99985 18.5H19.4997V35.5H9.99985Z" stroke="white"/>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="54" viewBox="0 0 40 54" fill="none" className='text-bolt-elements-textPrimary'>
                                <path d="M20.5003 27C20.5003 22.3539 24.7026 18.5 30.0002 18.5C35.2975 18.5 39.5 22.3539 39.5 27C39.5 31.6462 35.2975 35.5 30.0002 35.5C24.7026 35.5 20.5003 31.6462 20.5003 27Z" stroke="white"/>
                                <path d="M0.5 45C0.5 40.3539 4.70238 36.5 9.99985 36.5H19.4997V45C19.4997 49.6462 15.2974 53.5 9.99985 53.5C4.70237 53.5 0.5 49.6462 0.5 45Z" stroke="white"/>
                                <path d="M30.0002 17.5H20.5003V0.5H30.0002C35.2977 0.5 39.5 4.35383 39.5 9.00001C39.5 13.6462 35.2977 17.5 30.0002 17.5Z" stroke="white"/>
                                <path d="M9.99985 17.5C4.70237 17.5 0.5 13.6462 0.5 9.00002C0.5 4.35383 4.70237 0.5 9.99985 0.5H19.4997V17.5H9.99985Z" stroke="white"/>
                                <path d="M9.99985 35.5C4.70237 35.5 0.5 31.6462 0.5 27C0.5 22.3539 4.70238 18.5 9.99985 18.5H19.4997V35.5H9.99985Z" stroke="white"/>
                            </svg>
                            </>
                        )}
                        <input type="file"
                            ref={fileInputRef}
                            aria-hidden="true"
                            accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.pdf,.txt,.doc,.docx,.py,.ipynb,.js,.mjs,.cjs,.jsx,.html,.css,.scss,.sass,.ts,.tsx,.java,.cs,.php,.c,.cc,.cpp,.cxx,.h,.hh,.hpp,.rs,.swift,.go,.rb,.kt,.kts,.scala,.sh,.bash,.zsh,.bat,.csv,.log,.ini,.cfg,.config,.json,.yaml,.yml,.toml,.lua,.sql,.md,.tex,.latex,.asm,.ino,.s"
                            multiple
                            style={{display: 'none', visibility: 'hidden'}}
                            onChange={handleFileInputChange}
                        />
                    </ProcessingCard>

                    <ProcessingCard title="From Sketch" subtitle="From Sketch" onClick={() => checkAuthAndExecute(handleClickOpenWhiteBoard)}>
                        {theme === 'light' ? (
                            <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 77 73" fill="none" style={{position:'absolute', opacity:0.1}}>
                                <path d="M64.4875 24.9417L61.6 27.6792L47.8042 14.6L50.6917 11.8625C54.5417 8.2125 60.6375 8.2125 64.4875 11.8625C68.3375 15.5125 68.3375 21.2917 64.4875 24.9417Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M61.6 27.6788L28.5542 59.0079C25.3458 62.0496 20.8542 63.8746 16.0417 63.8746H12.8333C10.9083 63.8746 9.625 62.3538 9.625 60.8329V57.7913C9.625 53.5329 11.55 49.2746 14.7583 45.9288L47.8042 14.5996L61.6 27.6788Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="77" height="73" viewBox="0 0 77 73" fill="none"  className='text-bolt-elements-textPrimary'>
                                <path d="M64.4875 24.9417L61.6 27.6792L47.8042 14.6L50.6917 11.8625C54.5417 8.2125 60.6375 8.2125 64.4875 11.8625C68.3375 15.5125 68.3375 21.2917 64.4875 24.9417Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M61.6 27.6788L28.5542 59.0079C25.3458 62.0496 20.8542 63.8746 16.0417 63.8746H12.8333C10.9083 63.8746 9.625 62.3538 9.625 60.8329V57.7913C9.625 53.5329 11.55 49.2746 14.7583 45.9288L47.8042 14.5996L61.6 27.6788Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            </>
                        ):(
                            <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 77 73" fill="none" style={{position:'absolute', opacity:0.1}}>
                                <path d="M64.4875 24.9417L61.6 27.6792L47.8042 14.6L50.6917 11.8625C54.5417 8.2125 60.6375 8.2125 64.4875 11.8625C68.3375 15.5125 68.3375 21.2917 64.4875 24.9417Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M61.6 27.6788L28.5542 59.0079C25.3458 62.0496 20.8542 63.8746 16.0417 63.8746H12.8333C10.9083 63.8746 9.625 62.3538 9.625 60.8329V57.7913C9.625 53.5329 11.55 49.2746 14.7583 45.9288L47.8042 14.5996L61.6 27.6788Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="77" height="73" viewBox="0 0 77 73" fill="none"  className='text-bolt-elements-textPrimary'>
                                <path d="M64.4875 24.9417L61.6 27.6792L47.8042 14.6L50.6917 11.8625C54.5417 8.2125 60.6375 8.2125 64.4875 11.8625C68.3375 15.5125 68.3375 21.2917 64.4875 24.9417Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M61.6 27.6788L28.5542 59.0079C25.3458 62.0496 20.8542 63.8746 16.0417 63.8746H12.8333C10.9083 63.8746 9.625 62.3538 9.625 60.8329V57.7913C9.625 53.5329 11.55 49.2746 14.7583 45.9288L47.8042 14.5996L61.6 27.6788Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            </>
                        )}
                    </ProcessingCard>

                    <ProcessingCard title="From Crawler" subtitle="From Crawler" onClick={() => checkAuthAndExecute(handleCrawlerOpen)}>
                        {theme === 'light' ? (
                            <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 103 102" fill="none" style={{position:'absolute', opacity:0.1}}>
                                <path d="M51.5 89.25C72.832 89.25 90.125 72.1249 90.125 51C90.125 29.8751 72.832 12.75 51.5 12.75C30.168 12.75 12.875 29.8751 12.875 51C12.875 72.1249 30.168 89.25 51.5 89.25Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M51.5 89.25C58.6107 89.25 64.375 72.1249 64.375 51C64.375 29.8751 58.6107 12.75 51.5 12.75C44.3893 12.75 38.625 29.8751 38.625 51C38.625 72.1249 44.3893 89.25 51.5 89.25Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M51.5 63.75C72.832 63.75 90.125 58.0416 90.125 51C90.125 43.9584 72.832 38.25 51.5 38.25C30.168 38.25 12.875 43.9584 12.875 51C12.875 58.0416 30.168 63.75 51.5 63.75Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="103" height="102" viewBox="0 0 103 102" fill="none" className='text-bolt-elements-textPrimary'>
                                <path d="M51.5 89.25C72.832 89.25 90.125 72.1249 90.125 51C90.125 29.8751 72.832 12.75 51.5 12.75C30.168 12.75 12.875 29.8751 12.875 51C12.875 72.1249 30.168 89.25 51.5 89.25Z" stroke = "black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M51.5 89.25C58.6107 89.25 64.375 72.1249 64.375 51C64.375 29.8751 58.6107 12.75 51.5 12.75C44.3893 12.75 38.625 29.8751 38.625 51C38.625 72.1249 44.3893 89.25 51.5 89.25Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M51.5 63.75C72.832 63.75 90.125 58.0416 90.125 51C90.125 43.9584 72.832 38.25 51.5 38.25C30.168 38.25 12.875 43.9584 12.875 51C12.875 58.0416 30.168 63.75 51.5 63.75Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            </>
                        ):(
                            <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 103 102" fill="none" style={{position:'absolute', opacity:0.1}}>
                                <path d="M51.5 89.25C72.832 89.25 90.125 72.1249 90.125 51C90.125 29.8751 72.832 12.75 51.5 12.75C30.168 12.75 12.875 29.8751 12.875 51C12.875 72.1249 30.168 89.25 51.5 89.25Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M51.5 89.25C58.6107 89.25 64.375 72.1249 64.375 51C64.375 29.8751 58.6107 12.75 51.5 12.75C44.3893 12.75 38.625 29.8751 38.625 51C38.625 72.1249 44.3893 89.25 51.5 89.25Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M51.5 63.75C72.832 63.75 90.125 58.0416 90.125 51C90.125 43.9584 72.832 38.25 51.5 38.25C30.168 38.25 12.875 43.9584 12.875 51C12.875 58.0416 30.168 63.75 51.5 63.75Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="103" height="102" viewBox="0 0 103 102" fill="none" className='text-bolt-elements-textPrimary'>
                                <path d="M51.5 89.25C72.832 89.25 90.125 72.1249 90.125 51C90.125 29.8751 72.832 12.75 51.5 12.75C30.168 12.75 12.875 29.8751 12.875 51C12.875 72.1249 30.168 89.25 51.5 89.25Z" stroke = "white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M51.5 89.25C58.6107 89.25 64.375 72.1249 64.375 51C64.375 29.8751 58.6107 12.75 51.5 12.75C44.3893 12.75 38.625 29.8751 38.625 51C38.625 72.1249 44.3893 89.25 51.5 89.25Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M51.5 63.75C72.832 63.75 90.125 58.0416 90.125 51C90.125 43.9584 72.832 38.25 51.5 38.25C30.168 38.25 12.875 43.9584 12.875 51C12.875 58.0416 30.168 63.75 51.5 63.75Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            </>
                            
                        )}
                    </ProcessingCard>
                </div>
            </div>
        </>
    )
}

export default MediaFile;