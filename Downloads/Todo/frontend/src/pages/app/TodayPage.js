// frontend/src/pages/app/TodayPage.js
import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api';
import TaskItem from '../../components/TaskItem';
import { ListGroup, Alert, Spinner, Card } from 'react-bootstrap'; // 'Form' removed
import { useAuth } from '../../context/AuthContext';

const TodayPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  // Optional: could add a filter for all/active/completed "today" tasks
  // const [filter, setFilter] = useState('active'); 

  const fetchTodayTasks = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/tasks/today'); // Use the new dedicated endpoint
      setTasks(data);
    } catch (err) {
      setError('Failed to fetch tasks for today. ' + (err.response?.data?.message || err.message));
      console.error("Fetch Today's tasks error:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTodayTasks();
  }, [fetchTodayTasks]);

  // --- Task Action Handlers ---
  // These handlers will update the task on the backend and then refresh the list for this page.
  // This ensures consistency if a task's status changes (e.g., no longer "for today").

  const handleToggleComplete = async (id, currentCompletedStatus) => {
    const taskToUpdate = tasks.find(t => t._id === id);
    if (!taskToUpdate) return;
    try {
      await api.put(`/tasks/${id}`, { ...taskToUpdate, completed: !currentCompletedStatus });
      fetchTodayTasks(); // Re-fetch to reflect changes (e.g., completed task might be filtered out)
    } catch (err) { console.error("Error toggling complete:", err); setError('Failed to update task.'); }
  };

  const handleToggleImportant = async (id, currentIsImportantStatus) => {
    const taskToUpdate = tasks.find(t => t._id === id);
    if (!taskToUpdate) return;
    try {
      await api.put(`/tasks/${id}`, { ...taskToUpdate, isImportant: !currentIsImportantStatus });
      fetchTodayTasks(); // Re-fetch as the displayed task's important status changed
    } catch (err) { console.error("Error toggling important:", err); setError('Failed to update task.'); }
  };

  const handleToggleIsForToday = async (id, currentIsForTodayStatus) => {
    const taskToUpdate = tasks.find(t => t._id === id);
    if (!taskToUpdate) return;
    try {
      // If we are toggling it OFF from "My Day", it should disappear from this list
      await api.put(`/tasks/${id}`, { ...taskToUpdate, isForToday: !currentIsForTodayStatus });
      fetchTodayTasks(); // Crucial: re-fetch to remove/update the task from this view
    } catch (err) { console.error("Error toggling for today:", err); setError('Failed to update task.'); }
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTodayTasks(); // Re-fetch to remove the task from this view
    } catch (err) { console.error("Error deleting task:", err); setError('Failed to delete task.'); }
  };

  // Filter tasks to show active ones first, then completed (if backend doesn't do this)
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
        <h2 className="mb-0">My Day</h2>
        {/* Optional: Add filter for "Today" tasks (e.g. active/completed)
        <Form.Select style={{ width: 'auto' }} value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="all">All</option>
        </Form.Select> */}
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

      <Card>
        {/* You could add an AddTaskForm here specifically for "My Day" if desired,
            pre-checking the "isForToday" box. For now, tasks are added via the main TasksPage. */}
        {loading && tasks.length > 0 && <div className="text-center p-2 border-bottom"><Spinner size="sm" /> Refreshing...</div>}
        <ListGroup variant="flush">
          {!loading && sortedTasks.length === 0 && (
            <ListGroup.Item className="text-center text-muted py-3">
              No tasks scheduled for "My Day". Add tasks from the main list or create new ones!
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

export default TodayPage;