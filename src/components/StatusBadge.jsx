export function StatusBadge({ status }) {
  const styles = {
    UPCOMING: "bg-emerald-100 text-emerald-800",
    ONGOING: "bg-primary-100 text-primary-800",
    COMPLETED: "bg-slate-100 text-slate-800",
    CANCELLED: "bg-danger-100 text-danger-800"
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || "bg-slate-100 text-slate-800"}`}>
      {status}
    </span>
  );
}
