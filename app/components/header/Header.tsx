import { useStore } from '@nanostores/react';
import { ClientOnly } from 'remix-utils/client-only';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';
import { HeaderActionButtons } from './HeaderActionButtons.client';
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';
import { Box, Typography } from '@mui/material';
import Logo from 'icons/logo.svg'
import { themeStore } from '~/lib/stores/theme';
import useAuth from '../auth/useAuth';
import useUser from '~/types/user';

interface HeaderProps{
  handleSignInOpen:()=> void;
  handleSignUpOpen:()=>void;
}
export const Header = ({ handleSignInOpen, handleSignUpOpen }: HeaderProps) => {
  const chat = useStore(chatStore);
  const theme = useStore(themeStore);
  const { authState} = useAuth();
  const { getStoredToken } = useUser();
  const tokendata = getStoredToken();
  return (
    <header
      className={classNames(
        'flex items-center bg-bolt-elements-background-depth-1 p-5 border-b h-[var(--header-height)]',
        {
          'border-transparent': !chat.started,
          'border-bolt-elements-borderColor': chat.started,
        },
      )}
    >
      <div className="flex items-center gap-2 z-logo text-bolt-elements-textPrimary cursor-pointer">
        {/* <div className="i-ph:sidebar-simple-duotone text-xl" /> */}
          <a href="/" className="text-2xl font-semibold text-accent flex items-center">
            <Box display={'flex'} gap={1} alignItems={'center'}>
              <Box component={'img'} src={Logo} width={30} height={40} />
              <Typography fontFamily={'Montserrat'} fontWeight={700}>Websparks</Typography>
            </Box>
          </a>
      </div>
      <span className="flex-1 px-4 truncate text-center text-bolt-elements-textPrimary">
        <ClientOnly>{() => <ChatDescription />}</ClientOnly>
      </span>
      {chat.started && (
        <ClientOnly>
          {() => (
            <div className="mr-1">
              <HeaderActionButtons />
            </div>
          )}
        </ClientOnly>
      )}
      {!authState.access_token && !tokendata ? (
      <Box display={{xs:'none', sm:'none', md:'flex'}} gap={1} alignItems={'center'}>
        <Box 
          onClick={() => handleSignInOpen()} 
          sx={{ 
            cursor: 'pointer' 
          }}
        >
          <Box border={'1px solid'} borderRadius={2} py={0.5} px={2} className={'border border-bolt-elements-borderColor'}>
            <Typography fontFamily={'Montserrat'} className='text-bolt-elements-textPrimary'>Login</Typography>
          </Box>
        </Box>
        <Box 
          onClick={() => handleSignUpOpen()} 
          sx={{ 
            cursor: 'pointer' 
          }}
        >
          <Box border={'1px solid'} borderRadius={2} py={0.5} px={2} className={'border border-bolt-elements-textPrimary bg-bolt-elements-textPrimary'}>
            <Typography fontFamily={'Montserrat'} className='bolt-elements-button-secondary-text' color={theme === 'light' ? '#FFF' : '#000'}>Sign Up</Typography>
          </Box>
        </Box>
      </Box>
      ):(
        <></>
      )}
    </header>
  );
}
