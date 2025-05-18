// frontend/src/pages/app/TasksPage.js
import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api';
import AddTaskForm from '../../components/AddTaskForm'; // Correct path
import TaskItem from '../../components/TaskItem';     // Correct path
import { ListGroup, Alert, Spinner, Card, Form } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
  const { user } = useAuth();

  const fetchTasks = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch (err) {
      setError('Failed to fetch tasks. ' + (err.response?.data?.message || err.message));
      console.error("Fetch tasks error:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async (text, isForToday, isImportant) => {
    if (!text.trim()) return;
    setError('');
    try {
      const taskData = { text, isForToday, isImportant };
      // MODIFIED LINE: Removed 'const { data: newTask } =' as newTask was unused
      await api.post('/tasks', taskData);
      fetchTasks(); // Re-fetch to get the latest list
    } catch (err) {
      setError('Failed to add task. ' + (err.response?.data?.message || err.message));
      console.error("Add task error:", err);
    }
  };

  const handleToggleComplete = async (id, currentCompletedStatus) => {
    setError('');
    try {
      const taskToUpdate = tasks.find(t => t._id === id);
      if (!taskToUpdate) return;

      const { data: updatedTask } = await api.put(`/tasks/${id}`, {
        ...taskToUpdate,
        completed: !currentCompletedStatus
      });
      setTasks(prevTasks => prevTasks.map(task => (task._id === id ? updatedTask : task)));
    } catch (err) {
      setError('Failed to update task completion. ' + (err.response?.data?.message || err.message));
      console.error("Toggle complete error:", err);
    }
  };

  const handleToggleImportant = async (id, currentIsImportantStatus) => {
    setError('');
    try {
      const taskToUpdate = tasks.find(t => t._id === id);
      if (!taskToUpdate) return;
      
      const { data: updatedTask } = await api.put(`/tasks/${id}`, {
        ...taskToUpdate,
        isImportant: !currentIsImportantStatus
      });
      setTasks(prevTasks => prevTasks.map(task => (task._id === id ? updatedTask : task)));
    } catch (err) {
      setError('Failed to update important status. ' + (err.response?.data?.message || err.message));
      console.error("Toggle important error:", err);
    }
  };
  
  const handleToggleIsForToday = async (id, currentIsForTodayStatus) => {
    setError('');
    try {
        const taskToUpdate = tasks.find(t => t._id === id);
        if (!taskToUpdate) return;

        const { data: updatedTask } = await api.put(`/tasks/${id}`, {
            ...taskToUpdate,
            isForToday: !currentIsForTodayStatus
        });
        setTasks(prevTasks => prevTasks.map(task => (task._id === id ? updatedTask : task)));
    } catch (err) {
        setError('Failed to update "My Day" status. ' + (err.response?.data?.message || err.message));
        console.error("Toggle My Day error:", err);
    }
  };

  const handleDeleteTask = async (id) => {
    setError('');
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(prevTasks => prevTasks.filter(task => task._id !== id));
    } catch (err) {
      setError('Failed to delete task. ' + (err.response?.data?.message || err.message));
      console.error("Delete task error:", err);
    }
  };

  // Memoize filteredTasks to avoid re-calculating on every render unless tasks or filter change
  const filteredTasks = React.useMemo(() => {
    return tasks
      .filter(task => {
        if (filter === 'active') return !task.completed;
        if (filter === 'completed') return task.completed;
        return true; // 'all'
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by newest first
  }, [tasks, filter]);

  // Show spinner only on initial load when tasks array is empty
  if (loading && tasks.length === 0) {
      return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">All Tasks</h2>
        <Form.Select 
          style={{ width: 'auto' }} 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)} 
          aria-label="Filter tasks"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </Form.Select>
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

      <Card className="mb-4">
        <Card.Header>
          <AddTaskForm onAddTask={handleAddTask} />
        </Card.Header>
        {/* Show a smaller loading indicator if tasks are already present but we are refreshing */}
        {loading && tasks.length > 0 && (
          <div className="text-center p-2 border-bottom"> 
            <Spinner animation="border" size="sm" /> Refreshing tasks...
          </div>
        )}
        <ListGroup variant="flush">
          {!loading && filteredTasks.length === 0 && (
            <ListGroup.Item className="text-center text-muted py-3">
              No tasks found for the current filter. Add one above!
            </ListGroup.Item>
          )}
          {filteredTasks.map(task => (
            <TaskItem
              key={task._id}
              task={task}
              onToggleComplete={() => handleToggleComplete(task._id, task.completed)}
              onDeleteTask={() => handleDeleteTask(task._id)}
              onToggleImportant={() => handleToggleImportant(task._id, task.isImportant)}
              onToggleIsForToday={() => handleToggleIsForToday(task._id, task.isForToday)}
            />
          ))}
        </ListGroup>
      </Card>
    </>
  );
};

export default TasksPage;