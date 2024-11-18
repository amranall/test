import { Box } from '@mui/material';
import { json, type MetaFunction } from '@remix-run/cloudflare';
import { useState } from 'react';
import { ClientOnly } from 'remix-utils/client-only';
import EnterEmail from '~/components/auth/ForgotPass/EnterEmail';
import ForgetVerficationCode from '~/components/auth/ForgotPass/ForgetVerficationCode';
import PasswordSet from '~/components/auth/ForgotPass/PasswordSet';
import Login from '~/components/auth/Login';
import SignUp from '~/components/auth/SignUp';
import VerificationCode from '~/components/auth/VerificationCode';
import { BaseChat } from '~/components/chat/BaseChat';
import { Chat } from '~/components/chat/Chat.client';
import { Header } from '~/components/header/Header';

export const meta: MetaFunction = () => {
  return [{ title: 'Websparks AI Agent' }, { name: 'description', content: 'Talk with Websparks AI Agent, an AI assistant from Websparks Corporations' }];
};

export const loader = () => json({});

export default function Index() {
  const [forgotVerificationEmail, setForgotVerificationEmail] = useState<string | null>(null);
  const [forgotPassCode, setForgotPassCode] = useState<string | null>(null);
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);
  const [signinOpen, setSignInOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [verficationOpen, setVerificationOpen] = useState(false);
  const [enterEmailOpen, setEnterEmailOpen] = useState(false);
  const [forgotVerificationOpen, setForgotVerificationOpen] = useState(false);
  const [passwordSetOpen, setPasswordSetOpen] = useState(false);

  const [crawlerOpen, setCrawlerOpen] = useState<boolean>(false);
  const [isCrawlerLoading, setIsCrawlerLoading] = useState<boolean>(false);

  const [openWhiteBoard, setOpenWhiteBoard] = useState<boolean>(false);

  //For Attachment Popup Menu
  const [anchorE2, setAnchorE2] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorE2);
  
  const handleSignInOpen = () => {
    setSignInOpen(true);
  }

  const handleSignInClose = () => {
    setSignUpOpen(false);
    setSignInOpen(false);
  };
  const handleSignUpOpen = () => {
    setSignUpOpen(true);
    setSignInOpen(false);
  };
  const handleSignUpClose = () => {
    setSignInOpen(false);
    setSignUpOpen(false);
  };

  const handleEnterEmailOpen = () => {
    setEnterEmailOpen(true);
    setSignInOpen(false);
  };

  const handleForgotVerificationOpen = (email: string) => {
    setForgotVerificationEmail(email)
    setForgotVerificationOpen(true);
    setEnterEmailOpen(false);
  };

  const handlePasswordSetOpen = (email: string, code: string) => {
    setForgotVerificationEmail(email);
    setForgotPassCode(code);
    setPasswordSetOpen(true);
    setEnterEmailOpen(false);
    setForgotVerificationOpen(false)
  };

  const handleEnterEmailClose = () => {
    setEnterEmailOpen(false);
    setSignInOpen(false);
  };

  const handleVerficationOpen = (email: string) => {
    setVerificationEmail(email);
    setVerificationOpen(true);
    setSignUpOpen(false);
  };
  const handleVerficationClose = () => {
    setVerificationOpen(false);
    setSignUpOpen(false);
    setSignInOpen(false);
  };

  const handleCrawlerOpen = () => {
    setCrawlerOpen(true);
  };

  const handleCrawlerClose = () => {
    setCrawlerOpen(false);
    setAnchorE2(null);
  };

  const handleClickOpenWhiteBoard = () => {
    setOpenWhiteBoard(true);
  };

  const handleWhiteBoardClose = () => {
    setOpenWhiteBoard(false);
    setAnchorE2(null);
  };

  const handleClose = () => {
    setAnchorE2(null);
  };

  return (
    <Box className="flex flex-col h-full w-full" sx={{overflowX:'none'}}>
      <Header handleSignInOpen={handleSignInOpen} handleSignUpOpen={handleSignUpOpen} />
      <ClientOnly fallback={
        <BaseChat 
          open = {open}
          anchorE2={anchorE2}
          setAnchorE2={setAnchorE2}
          handleClose={handleClose}
          handleCrawlerOpen={handleCrawlerOpen}
          setSignInOpen={setSignInOpen} 
          handleClickOpenWhiteBoard={handleClickOpenWhiteBoard}
        />
        }>{() => 
        <Chat 
          openWhiteBoard={openWhiteBoard} 
          handleWhiteBoardClose={handleWhiteBoardClose} 
          crawlerOpen={crawlerOpen}
          isCrawlerLoading={isCrawlerLoading}
          setIsCrawlerLoading={setIsCrawlerLoading}
          handleCrawlerClose={handleCrawlerClose}
          open = {open}
          anchorE2={anchorE2}
          setAnchorE2={setAnchorE2}
          handleClose={handleClose}
          handleCrawlerOpen ={handleCrawlerOpen}
          setSignInOpen={setSignInOpen} 
          handleClickOpenWhiteBoard={handleClickOpenWhiteBoard}
        />
        }
      </ClientOnly>
      
      <Login
        signinOpen={signinOpen}
        handleSignInClose={handleSignInClose}
        handleSignUpOpen={handleSignUpOpen}
        handleEnterEmailOpen={handleEnterEmailOpen}
      />

      <SignUp
        signUpOpen={signUpOpen}
        handleSignUpClose={handleSignUpClose}
        handleSignInOpen={handleSignInOpen}
        handleVerficationOpen={handleVerficationOpen}
      />
      
      <VerificationCode
        verificationOpen={verficationOpen}
        handleVerificationOpen={handleVerficationOpen}
        email={verificationEmail}
        handleSignInOpen={handleSignInOpen}
        handleVerficationClose={handleVerficationClose}
      />
      
      <EnterEmail
        enterEmailOpen={enterEmailOpen}
        handleEnterEmailClose={handleEnterEmailClose}
        handleForgotVerificationOpen={handleForgotVerificationOpen}
      />

      <ForgetVerficationCode
        forgotVerificationOpen={forgotVerificationOpen}
        email={forgotVerificationEmail}
        handlePasswordSetOpen={handlePasswordSetOpen}
      />

      <PasswordSet
        passwordSetOpen={passwordSetOpen}
        email={forgotVerificationEmail}
        code={forgotPassCode}
        handleSignInOpen={handleSignInOpen}
      />
    </Box>
  );
}
