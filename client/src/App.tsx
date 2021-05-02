import React from 'react';
import Layout from './components/Layout';
import { Counter } from './features/counter/Counter';

const App: React.FC = () => {
  return (
    <Layout>
      <Counter />
    </Layout>
  );
}

export default App;
