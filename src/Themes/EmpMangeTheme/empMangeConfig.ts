export const empMangeTheme = {
  layout: {
    mainContainer: "h-full p-10 font-sans custom-scrollbar",
  },
  header: {
    wrapper: "flex items-start justify-between gap-6 mb-10 flex-wrap",
    pill: "inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-primary bg-primary/5 border border-primary/20 px-2.5 py-1 rounded-full mb-2.5 w-fit",
    title: "text-[2rem] font-extrabold tracking-tight mb-1.5 leading-none",
    subtitle: "text-sm text-slate-400 font-medium",
  },
  section: {
    card: "bg-white rounded-[20px] border-[1.5px] border-slate-100 overflow-hidden shadow-sm shadow-slate-100 mb-10",
    header: "flex items-center justify-between p-[18px_24px] border-b border-slate-50 bg-slate-50/30",
    title: "flex items-center gap-2 font-extrabold text-[12px] tracking-wider uppercase text-slate-600",
    titleDot: "w-1.5 h-1.5 rounded-full bg-primary",
    countBadge: "text-[11px] font-bold text-slate-400 bg-white px-2.5 py-1 rounded-full border border-slate-100 shadow-sm",
  },
  table: {
    wrapper: "w-full overflow-y-auto overflow-x-auto custom-scrollbar border-b border-slate-100",
    head: "sticky top-0 z-20",
    headRow: "bg-[hsl(var(--bg-hsl))] border-b border-primary/10 shadow-sm",
    headCell: "px-6 py-4 text-left text-[11px] font-bold tracking-widest uppercase text-primary whitespace-nowrap bg-[hsl(var(--bg-hsl))]",
    row: "group border-b border-slate-50 cursor-pointer transition-colors hover:bg-primary/5",
    cell: "px-6 py-5",
  }
};
