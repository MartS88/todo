import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import App from './App';
import classes from './App.module.scss';

describe('App component', () => {
  it('shows "You don\'t have any todo\'s" when there are no todos', async () => {
    render(<App />);
    const noTodosMessage = await screen.findByText("You don't have any todo's");
    expect(noTodosMessage).toBeInTheDocument();
  });

  it('disables the add button when input value length is 2 or less', () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Enter todo, todo must contain more than 3 characters');
    const addButton = screen.getByText('Add todo');

    fireEvent.change(input, { target: { value: 'a' } });
    expect(addButton).toBeDisabled();

    fireEvent.change(input, { target: { value: 'ab' } });
    expect(addButton).toBeDisabled();

    fireEvent.change(input, { target: { value: 'abc' } });
    expect(addButton).toBeEnabled();
  });

  it('adds a new todo when the add button is clicked', async () => {
    const { container } = render(<App />);

    const input = screen.getByPlaceholderText('Enter todo, todo must contain more than 3 characters');
    const addButton = screen.getByText('Add todo');

    fireEvent.change(input, { target: { value: 'New Todo' } });
    fireEvent.click(addButton);


    expect(container.querySelector(`.${classes.loader_block}`)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('New Todo')).toBeInTheDocument();
    }, { timeout: 1500 });

    expect(container.querySelector(`.${classes.loader_block}`)).not.toBeInTheDocument();
  });





});
