import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { store } from '../../app/store';
import { todosSelector, getTodosAsync, deleteTodosAsync } from './todoSlice';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core';
import TodoCard from './TodoCard';
import FilterListIcon from '@material-ui/icons/FilterList';
import TodoDialog from './TodoDialog';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menu: {
      display: 'flex',
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
      },
      [theme.breakpoints.up('sm')]: {
        flexDirection: 'row',
      },
      '& .MuiCardContent-root': {
        paddingBottom: '16px',
      },
    },
    spacer: {
      flexGrow: 1,
    },
    menuActions: {
      display: 'flex',
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column-reverse',
      },
      [theme.breakpoints.up('sm')]: {
        flexDirection: 'row',
      },
      '& .MuiButtonBase-root': {
        margin: '.5rem',
      },
    },
  })
);

interface TodosProps {}

export interface TodoState {
  open: boolean;
  edit: boolean;
  select: boolean;
  todos: number[];
}

const Todos: React.FC<TodosProps> = ({}) => {
  const classes = useStyles();

  const dispatch = useAppDispatch();

  const todos = todosSelector.selectAll(store.getState());

  const {
    profile: { user },
  } = useAppSelector(state => state);

  useEffect(() => {
    if (todos && todos.length === 0) {
      dispatch(getTodosAsync(user ? (user.uid as number) : null));
    }
  }, []);

  const [todoState, setTodoState] = useState<TodoState>({
    open: false,
    edit: false,
    select: false,
    todos: [],
  });

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card className={classes.menu}>
          <CardContent>
            <Typography variant="h6">Todos</Typography>
          </CardContent>
          <div className={classes.spacer} />
          <CardActions className={classes.menuActions}>
            {todoState.todos.length === 1 && (
              <Button
                variant="contained"
                onClick={() =>
                  setTodoState({
                    ...todoState,
                    open: true,
                    edit: true,
                  })
                }
              >
                Edit
              </Button>
            )}
            {todoState.todos.length > 0 && (
              <Button
                variant="contained"
                onClick={() => {
                  dispatch(deleteTodosAsync(todoState.todos));
                  setTodoState({
                    ...todoState,
                    select: false,
                    todos: [],
                  });
                }}
              >
                Delete
              </Button>
            )}
            {todoState.select ? (
              <Button
                variant="contained"
                onClick={() =>
                  setTodoState({
                    ...todoState,
                    select: false,
                    todos: [],
                  })
                }
              >
                Cancel
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={() =>
                  setTodoState({
                    ...todoState,
                    select: true,
                  })
                }
              >
                Select
              </Button>
            )}
            <Button
              variant="contained"
              onClick={() =>
                setTodoState({
                  ...todoState,
                  open: true,
                  edit: false,
                })
              }
            >
              Create
            </Button>
          </CardActions>
        </Card>
      </Grid>
      {todos && todos.length > 0 && (
        <>
          {todos.map(todo => (
            <TodoCard
              todo={todo}
              state={todoState}
              setState={setTodoState}
              key={`TodoCard_${todo.id}`}
            />
          ))}
        </>
      )}
      <TodoDialog
        state={todoState}
        handleClose={() => setTodoState({ ...todoState, open: false, edit: false })}
        todo={
          todoState.todos.length === 1
            ? todosSelector.selectById(store.getState(), todoState.todos[0])
            : undefined
        }
      />
    </Grid>
  );
};

export default Todos;
