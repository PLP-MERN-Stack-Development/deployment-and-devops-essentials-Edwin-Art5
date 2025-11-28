// client/src/App.js
import React from 'react';
import TodoApp from './components/TodoApp';

function App(){
  return (
    <div>
      <header style={{padding:20, textAlign:'center'}}>
        <h1>Royalty Studioz — Week7 Demo</h1>
      </header>
      <main>
        <TodoApp />
      </main>
    </div>
  );
}

export default App;


