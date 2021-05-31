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
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    todoCard: {},
  })
);

interface TodoCardProps {
  todo: Todo;
}

const TodoCard: React.FC<TodoCardProps> = ({ todo }) => {
  const classes = useStyles();
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card>
        <CardContent><Typography variant='subtitle1'>{todo.title}</Typography></CardContent>
        <CardContent><Typography variant='body2'>{todo.description}</Typography></CardContent>
      </Card>
    </Grid>
  );
};

export default TodoCard;
