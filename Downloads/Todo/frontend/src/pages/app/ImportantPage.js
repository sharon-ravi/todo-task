// frontend/src/pages/app/ImportantPage.js
import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api';
import TaskItem from '../../components/TaskItem';
import { ListGroup, Alert, Spinner, Card } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const ImportantPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const fetchImportantTasks = useCallback(async () => {
    if (!user) {
        setLoading(false);
        return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/tasks/important'); // Use the new dedicated endpoint
      setTasks(data);
    } catch (err) {
      setError('Failed to fetch important tasks. ' + (err.response?.data?.message || err.message));
      console.error("Fetch Important tasks error:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchImportantTasks();
  }, [fetchImportantTasks]);

  // --- Task Action Handlers (Similar to TodayPage, re-fetch on changes) ---
  const handleToggleComplete = async (id, currentCompletedStatus) => {
    const taskToUpdate = tasks.find(t => t._id === id);
    if (!taskToUpdate) return;
    try {
      await api.put(`/tasks/${id}`, { ...taskToUpdate, completed: !currentCompletedStatus });
      fetchImportantTasks();
    } catch (err) { console.error("Error toggling complete:", err); setError('Failed to update task.');}
  };

  const handleToggleImportant = async (id, currentIsImportantStatus) => {
    const taskToUpdate = tasks.find(t => t._id === id);
    if (!taskToUpdate) return;
    try {
      // If toggling it OFF from "Important", it should disappear from this list
      await api.put(`/tasks/${id}`, { ...taskToUpdate, isImportant: !currentIsImportantStatus });
      fetchImportantTasks(); // Crucial: re-fetch
    } catch (err) { console.error("Error toggling important:", err); setError('Failed to update task.');}
  };

  const handleToggleIsForToday = async (id, currentIsForTodayStatus) => {
    const taskToUpdate = tasks.find(t => t._id === id);
    if (!taskToUpdate) return;
    try {
      await api.put(`/tasks/${id}`, { ...taskToUpdate, isForToday: !currentIsForTodayStatus });
      fetchImportantTasks(); // Re-fetch as the task data changed
    } catch (err) { console.error("Error toggling for today:", err); setError('Failed to update task.');}
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchImportantTasks(); // Re-fetch
    } catch (err) { console.error("Error deleting task:", err); setError('Failed to delete task.');}
  };
  
  const sortedTasks = React.useMemo(() => {
    const active = tasks.filter(t => !t.completed);
    const completed = tasks.filter(t => t.completed);
    return [...active, ...completed];
  }, [tasks]);


  if (loading && tasks.length === 0) {
    return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Important Tasks</h2>
        {/* Optional: Filters */}
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      <Card>
        {loading && tasks.length > 0 && <div className="text-center p-2 border-bottom"><Spinner size="sm" /> Refreshing...</div>}
        <ListGroup variant="flush">
          {!loading && sortedTasks.length === 0 && (
            <ListGroup.Item className="text-center text-muted py-3">
              No tasks marked as important. Mark tasks with a star!
            </ListGroup.Item>
          )}
          {sortedTasks.map(task => (
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

export default ImportantPage;