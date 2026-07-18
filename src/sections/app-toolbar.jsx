import { useState } from 'react';
import { AppBar, Button, Toolbar, Popover } from '@mui/material';
import { SketchPicker } from 'react-color';
import { exportBlocksArrayToStl } from '../utils/exportStl';

function AppToolbar({ blockColor, onBlockColorChange, blocksArray }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleColorChange = (color) => {
    onBlockColorChange(color.hex);
  }

  const handleExport = () => {
    exportBlocksArrayToStl(blocksArray);
  };

  return (
    <>
    <AppBar
      position="static"
      color="transparent"
      elevation={1}
      sx={{ backgroundColor: 'rgba(17, 24, 39, 0.95)' }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Button
          sx={{
            width: 32,
            height: 32,
            border: '1px solid #f8fafc',
            p: 0,
            minWidth: 0,
            borderRadius: '4px',
            backgroundColor: blockColor,
          }}
          onClick={handleClick}
        ></Button>
        <Button onClick={handleExport}>
          Export
        </Button>
        
      </Toolbar>
      <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <SketchPicker color={blockColor} onChangeComplete={handleColorChange} />
        </Popover>
    </AppBar>
    </>
  );
}

export default AppToolbar;
