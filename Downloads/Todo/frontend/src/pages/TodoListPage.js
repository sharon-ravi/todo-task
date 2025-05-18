import React, { useState, useEffect } from 'react';
import api from '../api';
import AddTaskForm from '../components/AddTaskForm';
import TaskItem from '../components/TaskItem';
import { Container, ListGroup, Alert, Spinner, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';


const TodoListPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth(); // Get user to ensure page is rendered for logged-in user

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return; // Don't fetch if user is not yet loaded/logged in
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get('/tasks');
        setTasks(data);
      } catch (err) {
        setError('Failed to fetch tasks. ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [user]); // Re-fetch if user changes (e.g., on login)

  const handleAddTask = async (text) => {
    try {
      const { data } = await api.post('/tasks', { text });
      setTasks([data, ...tasks]);
    } catch (err) {
      setError('Failed to add task. ' + (err.response?.data?.message || err.message));
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      const taskToUpdate = tasks.find(t => t._id === id);
      const { data } = await api.put(`/tasks/${id}`, { ...taskToUpdate, completed });
      setTasks(tasks.map(task => task._id === id ? data : task));
    } catch (err) {
      setError('Failed to update task. ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      setError('Failed to delete task. ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <Container className="text-center mt-5"><Spinner animation="border" /></Container>;

  return (
    <Container>
        <Card className="mt-4">
            <Card.Header as="h3">My To-Do List</Card.Header>
            <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <AddTaskForm onAddTask={handleAddTask} />
                {tasks.length === 0 && !loading && <p>No tasks yet. Add one!</p>}
                <ListGroup>
                    {tasks.map(task => (
                    <TaskItem
                        key={task._id}
                        task={task}
                        onToggleComplete={handleToggleComplete}
                        onDeleteTask={handleDeleteTask}
                    />
                    ))}
                </ListGroup>
            </Card.Body>
        </Card>
    </Container>
  );
};

export default TodoListPage;