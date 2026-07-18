import { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './App.css';
import AppToolbar from './sections/app-toolbar';
import ThreeDBuilder from './sections/three-d-builder';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0f172a',
      paper: '#111827',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
    },
  },
});

function App() {
  const [blockColor, setBlockColor] = useState('#327dee');
  const [blocksArray, setBlocksArray] = useState();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppToolbar blockColor={blockColor} onBlockColorChange={setBlockColor} blocksArray={blocksArray}/>
        <ThreeDBuilder size={10} blockColor={blockColor} blocksArray={blocksArray} onBlocksArrayChange={setBlocksArray} />
      </Box>
    </ThemeProvider>
  );
}

export default App;
