/**
 * 徽章浮动动画组件
 * 从原App.jsx迁移 (lines 493-506)
 */
const BadgeFloatingAnimation = ({ children, delay = 0 }) => {
  return (
    <div
      className="animate-bounce"
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: '3s',
        animationIterationCount: 'infinite',
      }}
    >
      {children}
    </div>
  );
};

export default BadgeFloatingAnimation;
