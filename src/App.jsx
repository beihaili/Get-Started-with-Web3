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
  const { updateGasPrice, showConfetti } = useAppStore();
  const { cleanOldCache } = useContentStore();

  useEffect(() => {
    updateGasPrice();
    const gasInterval = setInterval(updateGasPrice, 10000);
    cleanOldCache();

    return () => {
      clearInterval(gasInterval);
    };
  }, [updateGasPrice, cleanOldCache]);

  return (
    <div className="app">
      <RouterProvider router={router} />
      <Confetti active={showConfetti} />
    </div>
  );
}

export default App;
