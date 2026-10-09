import { SearchX } from 'lucide-react';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';

export function EmptyState({ 
  icon: Icon = SearchX, 
  title = "No results found", 
  message = "We couldn't find anything matching your search.",
  actionText,
  actionPath,
  onAction
}) {
  const navigate = useNavigate();

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else if (actionPath) {
      navigate(actionPath);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl border border-slate-200 border-dashed py-16">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-slate-500 max-w-sm mx-auto mb-6">{message}</p>
      
      {(actionText && (actionPath || onAction)) && (
        <Button onClick={handleAction} variant="outline">
          {actionText}
        </Button>
      )}
    </div>
  );
}
