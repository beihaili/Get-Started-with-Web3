import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import { useContentStore } from './store/useContentStore';

/**
 * 主应用组件（重构后）
 * 使用React Router和Zustand状态管理
 *
 * 从原3529行精简到~100行
 */
function App() {
  const { updateGasPrice } = useAppStore();
  const { cleanOldCache } = useContentStore();

  useEffect(() => {
    // 初始化：更新Gas价格
    updateGasPrice();
    const gasInterval = setInterval(updateGasPrice, 10000);

    // 初始化：清理旧缓存
    cleanOldCache();

    return () => {
      clearInterval(gasInterval);
    };
  }, [updateGasPrice, cleanOldCache]);

  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
