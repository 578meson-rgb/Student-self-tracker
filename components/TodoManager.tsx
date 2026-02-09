import React, { useState } from 'react';
import { Task } from '../types';
import { Plus, Trash2, CheckCircle2, Circle, ListTodo } from 'lucide-react';

interface TodoManagerProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TodoManager: React.FC<TodoManagerProps> = ({ tasks, setTasks }) => {
  const [input, setInput] = useState('');

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      text: input.trim(),
      completed: false,
      createdAt: Date.now()
    };
    setTasks([newTask, ...tasks]);
    setInput('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-500 pb-20">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-[#0A1D47] tracking-tighter uppercase italic flex items-center justify-center gap-3">
          <ListTodo size={32} /> To-Do List
        </h2>
        <p className="text-slate-500 font-medium text-sm">Organize your study goals & tasks</p>
      </div>

      <form onSubmit={addTask} className="relative group">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What needs to be done today?"
          className="w-full bg-white border-2 border-slate-100 rounded-[1.5rem] px-6 py-4 pr-16 focus:outline-none focus:border-blue-500 shadow-sm transition-all text-sm font-bold"
        />
        <button
          type="submit"
          className="absolute right-2 top-2 bottom-2 bg-[#0A1D47] text-white px-4 rounded-2xl hover:bg-blue-900 transition-all flex items-center justify-center shadow-lg active:scale-90"
        >
          <Plus size={20} strokeWidth={3} />
        </button>
      </form>

      {tasks.length > 0 && (
        <div className="bg-slate-100 h-2 w-full rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-700"
            style={{ width: `${(completedCount / tasks.length) * 100}%` }}
          />
        </div>
      )}

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`
              flex items-center gap-4 bg-white p-4 rounded-[1.5rem] border transition-all group
              ${task.completed ? 'border-emerald-100 opacity-60' : 'border-slate-100 shadow-sm hover:border-blue-200'}
            `}
          >
            <button 
              onClick={() => toggleTask(task.id)}
              className={`transition-colors ${task.completed ? 'text-emerald-500' : 'text-slate-300 hover:text-blue-500'}`}
            >
              {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
            </button>
            
            <span className={`flex-1 text-sm font-bold transition-all ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
              {task.text}
            </span>

            <button 
              onClick={() => deleteTask(task.id)}
              className="text-slate-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="py-20 text-center space-y-4 opacity-30">
            <div className="w-20 h-20 bg-slate-200 rounded-full mx-auto flex items-center justify-center">
              <ListTodo size={40} className="text-slate-400" />
            </div>
            <p className="font-black uppercase tracking-widest text-xs">No tasks yet. Stay focused!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoManager;