/**
 * 课程内容骨架屏
 * 模拟 Markdown 文章布局：标题 + 段落 + 代码块
 */
const ContentSkeleton = () => {
  return (
    <div data-testid="content-skeleton" className="space-y-6">
      <div className="space-y-3">
        <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
        <div className="h-8 w-3/4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
        <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
        <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
      </div>
      <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800/50 space-y-2">
        <div className="h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
        <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
        <div className="h-3 w-3/4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
        <div className="h-4 w-4/5 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
        <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
        <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
      </div>
      <div className="h-48 w-full rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
        <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
      </div>
    </div>
  );
};

export default ContentSkeleton;
