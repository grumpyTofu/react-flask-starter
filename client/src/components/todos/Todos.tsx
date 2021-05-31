import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { RootState, store } from '../../app/store';
import { todosSelector, getTodosAsync, Todo } from './todoSlice';
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
import { useSelector } from 'react-redux';
import TodoCard from './TodoCard';
import FilterListIcon from '@material-ui/icons/FilterList';
import CreateTodo from './createTodo';

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

const Todos: React.FC<TodosProps> = ({}) => {
  const classes = useStyles();

  const dispatch = useAppDispatch();

  const todos = todosSelector.selectAll(store.getState());
  const {
    profile: { user },
  } = useSelector((state: RootState) => state);

  useEffect(() => {
    if (todos && todos.length === 0) {
      dispatch(getTodosAsync(user ? (user.uid as number) : null));
    }
  }, []);

  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card className={classes.menu}>
          <CardContent>
            <Typography variant="h6">Todos</Typography>
          </CardContent>
          <div className={classes.spacer} />
          <CardActions className={classes.menuActions}>
            <Button variant="contained" startIcon={<FilterListIcon />}>
              Filter
            </Button>
            <Button
              variant="contained"
              onClick={() => setCreateDialogOpen(true)}
            >
              Create Todo
            </Button>
          </CardActions>
        </Card>
      </Grid>
      {todos && todos.length > 0 && (
        <>
          {todos.map(todo => (
            <TodoCard todo={todo} key={`TodoCard_${todo.id}`} />
          ))}
        </>
      )}
      <CreateTodo
        open={createDialogOpen}
        handleClose={() => setCreateDialogOpen(false)}
      />
    </Grid>
  );
};

export default Todos;
