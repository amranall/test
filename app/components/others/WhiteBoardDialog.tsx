import { Dialog, Slide, type SlideProps } from '@mui/material'
import React from 'react'
import WhiteBoard from './WhiteBoard';

type TransitionProps = Omit<SlideProps, 'direction'>;

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface HeaderProps {
  openWhiteBoard: boolean;
  handleWhiteBoardClose: () => void;
  addFiles: (files: FileList) => void;
}

const WhiteBoardDialog: React.FC<HeaderProps> = ({ openWhiteBoard, handleWhiteBoardClose, addFiles }) => {
  // Function to convert base64 to File object
  const base64ToFile = (base64String: string) => {
    // Extract the base64 data (remove data URL prefix)
    const base64Data = base64String.split(',')[1];
    // Convert base64 to binary
    const binaryData = atob(base64Data);
    // Create an array buffer from binary data
    const arrayBuffer = new ArrayBuffer(binaryData.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    
    for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i);
    }
    
    // Create Blob from array buffer
    const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
    
    // Generate a random filename
    const filename = `whiteboard-${Date.now()}.jpg`;
    
    // Create File object
    const file = new File([blob], filename, { type: 'image/jpeg' });
    
    // Create FileList-like object
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    
    return dataTransfer.files;
  };

  const handleDrawImage = (base64Image: string | null) => {
    if (base64Image) {
      const files = base64ToFile(base64Image);
      addFiles(files);
    }
  };

  return (
    <Dialog
      fullScreen
      open={openWhiteBoard}
      onClose={handleWhiteBoardClose}
      TransitionComponent={Transition}
    >
      <WhiteBoard setDrawImage={handleDrawImage} handleWhiteBoardClose={handleWhiteBoardClose} />
    </Dialog>
  );
};

export default WhiteBoardDialog;