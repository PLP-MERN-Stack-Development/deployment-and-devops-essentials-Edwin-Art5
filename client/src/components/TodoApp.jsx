// client/src/components/TodoApp.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '') + '/api/todos';

export default function TodoApp() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API);
      setItems(res.data);
    } catch (err) {
      console.error('Fetch todos error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTodos(); }, []);

  const create = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await axios.post(API, { title: title.trim() });
      setTitle('');
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const toggle = async (id) => {
    try {
      await axios.patch(`${API}/${id}/toggle`);
      fetchTodos();
    } catch (err) { console.error(err); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this todo?')) return;
    try {
      await axios.delete(`${API}/${id}`);
      fetchTodos();
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{maxWidth:700, margin:'20px auto', padding:16}}>
      <h2>Todo Demo (CRUD)</h2>
      <form onSubmit={create} style={{display:'flex', gap:8}}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="New todo" style={{flex:1,padding:8}}/>
        <button type="submit" style={{padding:'8px 12px'}}>Add</button>
      </form>

      {loading ? <p>Loading...</p> : (
        <ul style={{listStyle:'none', padding:0, marginTop:12}}>
          {items.length === 0 && <li>No todos yet</li>}
          {items.map(t => (
            <li key={t._id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:8, borderBottom:'1px solid #eee'}}>
              <div>
                <input type="checkbox" checked={t.done} onChange={()=>toggle(t._id)} />
                <span style={{marginLeft:8, textDecoration: t.done ? 'line-through' : 'none'}}>{t.title}</span>
                <div style={{fontSize:12,color:'#666'}}>Created: {new Date(t.createdAt).toLocaleString()}</div>
              </div>
              <div>
                <button onClick={()=>remove(t._id)} style={{padding:'6px 10px'}}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
