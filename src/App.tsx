import React, { useEffect, useState } from 'react';
import classes from './App.module.scss';
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im';
import './index.scss';
import Loader from './Loader';

interface Todo {
  title: string;
  isCompleted: boolean;
}

const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [activeButton, setActiveButton] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [infoBlock, setInfoBlock] = useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [sortCriteria, setSortCriteria] = useState<string>('All');

  const sortedArray = React.useMemo(() => {
    if (!todos) return [];

    const data = [...todos];
    switch (sortCriteria) {
      case 'All':
        return data;
      case 'Completed':
        return data.filter((todo: Todo) => todo.isCompleted);
      case 'NotCompleted':
        return data.filter((todo: Todo) => !todo.isCompleted);
      default:
        return data;
    }
  }, [todos, sortCriteria]);

  const hoveredHandler = (index: number | null, value: boolean) => {
    setInfoBlock(value);
    setHoveredIndex(index);
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const addTodoHandler = (title: string) => {
    setLoading(true);
    setTodos((prevTodos: Todo[]) => [...prevTodos, { title: title, isCompleted: false }]);
    setInputValue('');
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  const isCompleteHandler = (index: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo, i) => (i === index ? { ...todo, isCompleted: !todo.isCompleted } : todo)),
    );
  };

  const clearHandler = () => {
    setSortCriteria('All');
    setLoading(true);
    setTodos((prevTodos: Todo[]) => [...prevTodos.filter((todo:Todo) => !todo.isCompleted)]);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    setActiveButton(inputValue.length <= 2);
  }, [inputValue]);

  return (
    <div className={classes.App}>
      <div className={classes.todo_block}>
        <h1>Todos:</h1>

        <div className={classes.input_block}>
          <input
            type="text"
            placeholder="Enter todo, todo must contain more than 3 characters"
            autoComplete="off"
            autoCorrect="off"
            maxLength={40}
            value={inputValue}
            onChange={onChangeHandler}
          />
          <button
            className={!activeButton ? classes.add_button : classes.disabled}
            disabled={activeButton}
            onClick={() => addTodoHandler(inputValue)}
          >
            Add todo
          </button>
        </div>
        <div className={classes.todos_items}>
          {todos.length === 0 && !loading && <h2>You don't have any todo's</h2>}
          {loading ? <div className={classes.loader_block}><Loader width="70" height="70" color="gray" /></div> :
            <>
              {sortedArray.map((todo: Todo, index) => (
                <div
                  key={index}
                  className={classes.todo_item_wrapper}
                  onClick={() => isCompleteHandler(index)}
                  onMouseEnter={todo.title.length > 25 ? () => hoveredHandler(index, true) : undefined}
                  onMouseLeave={todo.title.length > 25 ? () => hoveredHandler(null, false) : undefined}
                >
                  {todo.isCompleted ? <ImCheckboxChecked color="green" size={20} /> : <ImCheckboxUnchecked color="gray" size={20} />}
                  <span className={classes.todo_item}>{todo.title.length > 25 ? todo.title.slice(0, 25) + '...' : todo.title}</span>
                  {infoBlock && index === hoveredIndex && <div className={classes.info_block}>{todo.title}</div>}
                </div>
              ))}
            </>
          }
        </div>

        <div className={classes.todo_down_menu}>
          <div className={classes.todo_down_menu_item}>{todos.length === 0 ? 'Items:' : `Items: ${todos.length}`}</div>
          <div className={`${classes.todo_down_menu_item} ${sortCriteria === 'All' ? classes.active : ''}`} onClick={() => setSortCriteria('All')}>All</div>
          <div className={`${classes.todo_down_menu_item} ${sortCriteria === 'NotCompleted' ? classes.active : ''}`} onClick={() => setSortCriteria('NotCompleted')}>Active</div>
          <div className={`${classes.todo_down_menu_item} ${sortCriteria === 'Completed' ? classes.active : ''}`} onClick={() => setSortCriteria('Completed')}>Completed</div>
          <div className={classes.todo_down_menu_item} onClick={clearHandler}>Clear Completed</div>
        </div>
      </div>
    </div>
  );
};

export default App;
