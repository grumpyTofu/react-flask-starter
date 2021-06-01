import React from 'react';
import { Todo } from './todoSlice';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  createStyles,
  makeStyles,
  Theme,
  IconButton,
} from '@material-ui/core';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import { TodoState } from './Todos';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: {},
    selector: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
  })
);

interface TodoCardProps {
  state: TodoState;
  setState: (state: TodoState) => void;
  todo: Todo;
}

const TodoCard: React.FC<TodoCardProps> = ({ state, setState, todo }) => {
  const classes = useStyles();

  const handleSelect = () => {
    setState({ ...state, todos: [...state.todos, todo.id] });
  };

  const handleDeselect = () => {
    setState({
      ...state,
      todos: state.todos.filter(selectedTodo => selectedTodo !== todo.id),
    });
  };

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card>
        <Grid container>
          <Grid item xs={12}>
            <Grid container className={classes.toolbar}>
              <Grid item xs={state.select ? 10 : 12}>
                <CardContent>
                  <Typography variant="subtitle1">{todo.title}</Typography>
                </CardContent>
              </Grid>
              {state.select && (
                <Grid item xs={2} className={classes.selector}>
                  {state.todos.includes(todo.id) ? (
                    <IconButton onClick={handleDeselect}>
                      <RadioButtonCheckedIcon />
                    </IconButton>
                  ) : (
                    <IconButton onClick={handleSelect}>
                      <RadioButtonUncheckedIcon />
                    </IconButton>
                  )}
                </Grid>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <CardContent>
              <Typography variant="body2">{todo.description}</Typography>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};

export default TodoCard;
