interface ProgressIndicatorProps {
    filledComparisons: number;
    totalComparisons: number;
}

export function ProgressIndicator({ filledComparisons, totalComparisons }: ProgressIndicatorProps) {
    const percentage = (filledComparisons / totalComparisons) * 100;

    return (
        <div className="flex items-center justify-between rounded-md border bg-slate-50 p-2 sm:p-3">
            <span className="text-xs font-medium text-slate-700 sm:text-sm">
                Progres: <span className="font-bold text-blue-600">{filledComparisons}</span>/<span className="font-bold">{totalComparisons}</span>
            </span>
            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-200 sm:h-2 sm:w-24">
                <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${percentage}%` }} />
            </div>
        </div>
    );
}
