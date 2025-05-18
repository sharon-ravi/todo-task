// frontend/src/components/AddTaskForm.js
import React, { useState } from 'react'; // Make sure useState is imported from React
import { Form, Button, InputGroup, Stack, FormCheck } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';

const AddTaskForm = ({ onAddTask }) => {
  const [text, setText] = useState('');
  // === Add these two lines to declare the state ===
  const [isForToday, setIsForToday] = useState(false);
  const [isImportant, setIsImportant] = useState(false);
  // ===============================================

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddTask(text, isForToday, isImportant); // Now isForToday and isImportant are defined
    setText('');
    setIsForToday(false); // Now setIsForToday is defined
    setIsImportant(false); // Now setIsImportant is defined
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-3">
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Add new task..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          aria-label="New task text"
        />
        <Button variant="primary" type="submit" aria-label="Add Task">
            <FaPlus /> Add
        </Button>
      </InputGroup>
      <Stack direction="horizontal" gap={3} className="mt-2">
        <FormCheck
          type="checkbox"
          id="isForTodayCheckbox"
          label="Add to My Day"
          checked={isForToday} // Uses the state variable
          onChange={(e) => setIsForToday(e.target.checked)} // Uses the state setter
        />
        <FormCheck
          type="checkbox"
          id="isImportantCheckbox"
          label="Mark as Important"
          checked={isImportant} // Uses the state variable
          onChange={(e) => setIsImportant(e.target.checked)} // Uses the state setter
        />
      </Stack>
    </Form>
  );
};

export default AddTaskForm;