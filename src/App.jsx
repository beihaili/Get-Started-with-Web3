import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import { useContentStore } from './store/useContentStore';
import { Confetti } from './components/animations';

/**
 * 主应用组件
 */
function App() {
  const showConfetti = useAppStore((s) => s.showConfetti);
  const { cleanOldCache } = useContentStore();

  useEffect(() => {
    cleanOldCache();
  }, [cleanOldCache]);

  return (
    <div className="app">
      <RouterProvider router={router} />
      <Confetti active={showConfetti} />
    </div>
  );
}

export default App;
