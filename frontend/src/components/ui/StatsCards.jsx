// import React from "react";

// const Cards = ({ stat }) => {
//   return (
//     <div className="group bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/50
//       rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm
//       hover:shadow-lg transition-all duration-300
//       hover:border-primary/30 dark:hover:border-primary/20
//       p-3 sm:p-4 md:p-5 lg:p-6 2xl:p-8">

//       {/* Header: label + icon */}
//       <div className="flex justify-between items-start gap-2
//         mb-2 sm:mb-3 md:mb-4 2xl:mb-5">
//         <p className="text-[10px] sm:text-xs lg:text-sm 2xl:text-base
//           font-semibold uppercase tracking-widest
//           text-slate-500 dark:text-slate-400 max-w-[70%]">
//           {stat.label}
//         </p>
//         <div className="flex-shrink-0
//           p-1.5 sm:p-2 md:p-2.5 2xl:p-3
//           bg-primary/10 dark:bg-primary/5 rounded-xl
//           group-hover:bg-primary/15 dark:group-hover:bg-primary/10 transition-colors">
//           <span className="material-symbols-outlined text-primary
//             text-base sm:text-lg md:text-2xl 2xl:text-3xl">
//             {stat.icon}
//           </span>
//         </div>
//       </div>

//       {/* Main value */}
//       <p className="font-black text-slate-900 dark:text-white leading-tight
//         text-lg sm:text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl
//         mb-1 sm:mb-2 md:mb-3 2xl:mb-4">
//         {stat.value}
//       </p>

//       {/* Footer: change info */}
//       <div className="flex items-center gap-2
//         pt-1.5 sm:pt-2 md:pt-3 2xl:pt-4
//         border-t border-slate-100 dark:border-slate-700/50">
//         <span className={`text-[9px] sm:text-xs lg:text-sm 2xl:text-base font-bold truncate ${stat.changeClass}`}>
//           {stat.change}
//         </span>
//         <span className="text-[9px] sm:text-xs lg:text-sm 2xl:text-base
//           text-slate-400 dark:text-slate-500 truncate">
//           {stat.changeText}
//         </span>
//       </div>
//     </div>
//   );
// };

// export default Cards;

import React from "react";

// Breakpoint scaling:
// mobile (320-767px)  → base/sm sizes
// tablet (768-1023px) → md sizes — compact, not too big
// laptop (1024-1439px)→ lg sizes
// laptop L (1440px+)  → xl sizes
// 4K (1536px+)        → 2xl sizes

const Cards = ({ stat }) => {
  return (
    <div className="group bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/50
      rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm
      hover:shadow-lg transition-all duration-300
      hover:border-primary/30 dark:hover:border-primary/20
      p-3 sm:p-3.5 md:p-4 lg:p-4.5 xl:p-5 2xl:p-6">

      {/* Header: label + icon */}
      <div className="flex justify-between items-start gap-2 mb-2 md:mb-2.5 lg:mb-3 xl:mb-4">
        <p className="text-[10px] md:text-[11px] lg:text-xs xl:text-sm
          font-semibold uppercase tracking-widest
          text-slate-500 dark:text-slate-400 max-w-[70%]">
          {stat.label}
        </p>
        <div className="flex-shrink-0
          p-1.5 md:p-2 lg:p-2 xl:p-2.5
          bg-primary/10 dark:bg-primary/5 rounded-xl
          group-hover:bg-primary/15 dark:group-hover:bg-primary/10 transition-colors">
          <span className="material-symbols-outlined text-primary
            text-base md:text-lg lg:text-xl xl:text-2xl">
            {stat.icon}
          </span>
        </div>
      </div>

      {/* Main value */}
      <p className="font-black text-slate-900 dark:text-white leading-tight
        text-xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl
        mb-1.5 md:mb-2 lg:mb-2.5 xl:mb-3">
        {stat.value}
      </p>

      {/* Footer: change info */}
      <div className="flex items-center gap-2
        pt-1.5 md:pt-2 lg:pt-2.5 xl:pt-3
        border-t border-slate-100 dark:border-slate-700/50">
        <span className={`text-[9px] md:text-[10px] lg:text-xs xl:text-sm font-bold truncate ${stat.changeClass}`}>
          {stat.change}
        </span>
        <span className="text-[9px] md:text-[10px] lg:text-xs xl:text-sm
          text-slate-400 dark:text-slate-500 truncate">
          {stat.changeText}
        </span>
      </div>
    </div>
  );
};

export default Cards;