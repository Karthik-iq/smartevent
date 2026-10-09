import { Card } from './Card';

export function DashboardCard({ title, value, icon: Icon, trend, trendLabel, colorClass = "text-primary-600 bg-primary-50" }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {(trend || trendLabel) && (
        <div className="mt-4 flex items-center text-sm">
          {trend && (
            <span className={`font-medium ${trend > 0 ? 'text-emerald-600' : 'text-danger-600'} mr-2`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          )}
          {trendLabel && <span className="text-slate-500">{trendLabel}</span>}
        </div>
      )}
    </Card>
  );
}
