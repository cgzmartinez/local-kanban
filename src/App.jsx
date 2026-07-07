import React, { useState, useEffect } from 'react';
import { Layers, Plus, Trash2, Calendar } from 'lucide-react';

const INITIAL_COLUMNS = [
  { id: 'todo', title: 'Backlog Tasks' },
  { id: 'progress', title: 'In Flight' },
  { id: 'done', title: 'Shipped (Prod)' }
];

const INITIAL_TASKS = [
  { id: 'task-1', columnId: 'todo', title: 'Optimize client INP core latency budgets' },
  { id: 'task-2', columnId: 'progress', title: 'Integrate custom streaming engine callbacks' },
  { id: 'task-3', columnId: 'done', title: 'Deploy architectural configuration parameters to edge instances' }
];

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('kb_matrix_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    localStorage.setItem('kb_matrix_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Required to allow landing dropped state element
  };

  const handleDrop = (e, targetColumnId) => {
    const taskId = e.dataTransfer.getData('text/plain');
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, columnId: targetColumnId } : t))
    );
  };

  const createCard = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newCard = {
      id: `task-${Date.now()}`,
      columnId: 'todo',
      title: newTaskTitle.trim()
    };
    setTasks(prev => [...prev, newCard]);
    setNewTaskTitle('');
  };

  const deleteCard = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-violet-400 font-semibold text-sm mb-1">
              <Layers className="w-4 h-4" /> Local-First System Strategy
            </div>
            <h1 className="text-2xl font-bold tracking-tight">State Isolation Matrix</h1>
          </div>
          
          <form onSubmit={createCard} className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Queue backlog title..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-sm outline-none focus:border-violet-500 text-zinc-100 placeholder-zinc-500 w-full sm:w-60"
            />
            <button type="submit" className="bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap">
              <Plus className="w-3.5 h-3.5" /> Append Task
            </button>
          </form>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {INITIAL_COLUMNS.map((col) => {
            const columnTasks = tasks.filter(t => t.columnId === col.id);
            return (
              <div
                key={col.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
                className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 flex flex-col min-h-[400px]"
              >
                <div className="flex justify-between items-center mb-4 px-1">
                  <h3 className="font-semibold text-sm text-zinc-300 tracking-wide">{col.title}</h3>
                  <span className="bg-zinc-800 text-zinc-400 font-mono text-xs px-2 py-0.5 rounded-full border border-zinc-700/50">
                    {columnTasks.length}
                  </span>
                </div>

                <div className="space-y-2.5 flex-1 overflow-y-auto">
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className="bg-zinc-900 border border-zinc-800/80 p-3.5 rounded-lg cursor-grab active:cursor-grabbing hover:border-zinc-700 hover:bg-zinc-800/30 transition-all shadow-md group relative"
                    >
                      <p className="text-sm text-zinc-200 font-normal leading-snug pr-6">{task.title}</p>
                      <div className="flex items-center gap-1.5 mt-3 text-xs text-zinc-500 font-mono">
                        <Calendar className="w-3.5 h-3.5" /> {task.id.split('-')[1] ? 'User Node' : 'System Mock'}
                      </div>
                      <button
                        onClick={() => deleteCard(task.id)}
                        className="absolute top-3.5 right-3 text-zinc-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Evict item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {columnTasks.length === 0 && (
                    <div className="border border-dashed border-zinc-800 rounded-lg h-24 flex items-center justify-center text-xs text-zinc-600 font-mono">
                      Empty Stack Buffer
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}