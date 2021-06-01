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
  createStyles,
  makeStyles,
  Theme,
  FormControl,
  FormHelperText,
} from '@material-ui/core';
import Draggable from 'react-draggable';
import { useFormik } from 'formik';
import { Todo } from './todoSlice';
import * as Yup from 'yup';
import { isEmpty } from 'lodash';
import { useAppDispatch } from '../../app/hooks';
import { createTodoAsync, updateTodoAsync } from './todoSlice';
import { TodoState } from './Todos';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialog: {
      '& .MuiFormControl-root': {
        marginBottom: '1rem',
      },
    },
  })
);

function PaperComponent(props: PaperProps) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

interface TodoDialogProps {
  state: TodoState;
  handleClose: () => void;
  todo?: Todo;
}

const TodoDialog: React.FC<TodoDialogProps> = ({ state: { open, edit }, handleClose, todo }) => {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const dispatch = useAppDispatch();

  const {
    isSubmitting,
    dirty,
    touched,
    errors,
    values,
    handleSubmit,
    handleChange,
    handleReset,
    handleBlur,
  } = useFormik({
    initialValues:
      edit && todo
        ? { title: todo.title, description: todo.description }
        : { title: '', description: '' },
    enableReinitialize: true,
    onSubmit: values => {
      if (edit && todo) {
        dispatch(updateTodoAsync({ id: todo.id, ...values }));
      } else {
        dispatch(createTodoAsync(values));
      }
      handleReset(null);
      handleClose();
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().min(2, 'Too Short!').max(80, 'Too Long!').required('Required'),
      description: Yup.string().min(2, 'Too Short!').max(1000, 'Too Long!').required('Required'),
    }),
  });

  const close = () => {
    handleReset(null);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={close}
      fullWidth={true}
      fullScreen={fullScreen}
      maxWidth="sm"
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
      className={classes.dialog}
    >
      <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
        {edit ? 'Edit Todo' : 'Create Todo'}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          id="title"
          name="title"
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          margin="normal"
          autoComplete="off"
          variant="outlined"
          error={errors.title && touched.title ? true : false}
          helperText={errors.title && touched.title && errors.title}
          label="Title"
          fullWidth
        />
        <TextField
          id="description"
          name="description"
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          margin="normal"
          autoComplete="off"
          variant="outlined"
          error={errors.description && touched.description ? true : false}
          helperText={errors.description && touched.description && errors.description}
          label="Description"
          fullWidth
          multiline
          rows={4}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={close} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit as any}
          disabled={!dirty || !isEmpty(errors) || isSubmitting}
          color="primary"
        >
          {edit ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TodoDialog;
