// frontend/src/components/TaskItem.js
import React from 'react';
import { ListGroup, Button, Form, Stack } from 'react-bootstrap'; // Removed Badge for now
import { FaTrash, FaStar, FaRegStar, FaSun, FaRegSun } from 'react-icons/fa'; // Added Sun icons

// Add onToggleIsForToday to props
const TaskItem = ({ task, onToggleComplete, onDeleteTask, onToggleImportant, onToggleIsForToday }) => {
  return (
    <ListGroup.Item className={`d-flex justify-content-between align-items-center pe-2 ps-3 py-2 ${task.completed ? 'task-completed' : ''}`}>
      <Stack direction="horizontal" gap={2} className="flex-grow-1 align-items-center me-2">
        <Form.Check
          type="checkbox"
          id={`task-complete-${task._id}`}
          checked={task.completed}
          onChange={onToggleComplete} // No need to pass params, handler in TasksPage knows them
          aria-label={`Mark task ${task.text} as ${task.completed ? 'incomplete' : 'complete'}`}
          className="task-checkbox me-1"
        />
        <span className="task-text flex-grow-1">{task.text}</span>
      </Stack>
      <Stack direction="horizontal" gap={1} className="task-actions align-items-center">
        <Button
            variant="link"
            size="sm"
            onClick={onToggleIsForToday} // Toggle "My Day" status
            aria-label={`Mark task ${task.text} as ${task.isForToday ? 'not for today' : 'for today'}`}
            className={`p-1 me-1 ${task.isForToday ? 'text-primary' : 'text-muted'}`}
         >
            {task.isForToday ? <FaSun /> : <FaRegSun />}
         </Button>
         <Button
            variant="link"
            size="sm"
            onClick={onToggleImportant} // Toggle important status
            aria-label={`Mark task ${task.text} as ${task.isImportant ? 'not important' : 'important'}`}
            className={`p-1 me-1 ${task.isImportant ? 'text-warning' : 'text-muted'}`} // text-warning for filled star
         >
            {task.isImportant ? <FaStar /> : <FaRegStar />}
         </Button>
        <Button variant="link" size="sm" className="p-1 text-danger" onClick={onDeleteTask} aria-label={`Delete task ${task.text}`}>
            <FaTrash />
        </Button>
      </Stack>
    </ListGroup.Item>
  );
};
export default TaskItem;