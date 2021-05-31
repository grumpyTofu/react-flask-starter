import React from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  PaperProps,
  useTheme,
  useMediaQuery,
} from '@material-ui/core';
import Draggable from 'react-draggable';

function PaperComponent(props: PaperProps) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

interface CreateTodoProps {
  open: boolean;
  handleClose: () => void;
}

const CreateTodo: React.FC<CreateTodoProps> = ({ open, handleClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const handleCreateTodo = () => {
    handleClose();
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth={true}
      fullScreen={fullScreen}
      maxWidth="sm"
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">Create Todo</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Email Address"
          type="email"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleCreateTodo} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTodo;
