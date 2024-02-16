import { DragEvent, useState } from 'react';
import { useTaskStore } from '../stores';
import Swal from 'sweetalert2';
import { TaskStatus } from '../interfaces';

interface Options {
  status: TaskStatus;
}

const useTasks = ({ status }: Options) => {
  const isDragging = useTaskStore((state) => !!state.draggingTaskId);
  const onTaskDrop = useTaskStore((state) => state.onTaskDrop);
  const addTask = useTaskStore((state) => state.addTask);
  const [onDragOver, setOnDragOver] = useState<boolean>(false);

  const handleAddTask = async () => {
    // addTask('Nuevo titulo', value);
    const { isConfirmed, value } = await Swal.fire({
      title: 'Nueva tarea',
      input: 'text',
      inputLabel: 'Nombre de la Tarea',
      inputPlaceholder: 'Ingrese el nombre de la tarea',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) return 'Debe ingresar el nombre de la tarea';
      }
    });
    if(isConfirmed) {
      addTask(value, status)
    }
  }

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setOnDragOver(true);
  }

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setOnDragOver(false);
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setOnDragOver(false);
    onTaskDrop(status);
  }
  
  return {
    isDragging,
    onDragOver,
    handleAddTask,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
};

export default useTasks;