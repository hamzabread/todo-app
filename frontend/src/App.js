import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API = '/api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(API);
      setTodos(res.data);
    } catch (err) {
      console.error('Failed to fetch todos:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (!input.trim()) return;
    setAdding(true);
    try {
      const res = await axios.post(API, { title: input.trim() });
      setTodos(prev => [res.data, ...prev]);
      setInput('');
    } catch (err) {
      console.error('Failed to add todo:', err);
    } finally {
      setAdding(false);
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      await axios.put(`${API}/${id}`, { completed: !completed });
      setTodos(prev =>
        prev.map(t => t.id === id ? { ...t, completed: !completed } : t)
      );
    } catch (err) {
      console.error('Failed to update todo:', err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Failed to delete todo:', err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addTodo();
  };

  const remaining = todos.filter(t => !t.completed).length;

  return (
    <div className="app">
      <div className="card">
        <div className="header">
          <h1 className="title">My Tasks</h1>
          <span className="badge">{remaining} left</span>
        </div>

        <div className="input-row">
          <input
            className="todo-input"
            type="text"
            placeholder="Add a new task..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={adding}
          />
          <button className="add-btn" onClick={addTodo} disabled={adding || !input.trim()}>
            {adding ? '...' : '+'}
          </button>
        </div>

        <div className="list">
          {loading ? (
            <p className="empty">Loading tasks...</p>
          ) : todos.length === 0 ? (
            <p className="empty">No tasks yet. Add one above!</p>
          ) : (
            todos.map(todo => (
              <div key={todo.id} className={`todo-item ${todo.completed ? 'done' : ''}`}>
                <button
                  className={`check-btn ${todo.completed ? 'checked' : ''}`}
                  onClick={() => toggleTodo(todo.id, todo.completed)}
                  aria-label="Toggle complete"
                >
                  {todo.completed ? '✓' : ''}
                </button>
                <span className="todo-text">{todo.title}</span>
                <button
                  className="delete-btn"
                  onClick={() => deleteTodo(todo.id)}
                  aria-label="Delete todo"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {todos.length > 0 && (
          <div className="footer">
            <span>{todos.filter(t => t.completed).length} of {todos.length} completed</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
