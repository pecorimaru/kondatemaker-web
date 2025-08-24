// // UI関連の定数
// export const WEEKDAYS = {
//   SUNDAY: "1",
//   MONDAY: "2",
//   TUESDAY: "3",
//   WEDNESDAY: "4",
//   THURSDAY: "5",
//   FRIDAY: "6",
//   SATURDAY: "7"
// } as const;

// // // 後方互換性のため
// // export const WEEK_SUNDAY = WEEKDAYS.SUNDAY;
// // export const WEEK_MONDAY = WEEKDAYS.MONDAY;
// // export const WEEK_TUESDAY = WEEKDAYS.TUESDAY;
// // export const WEEK_WEDNESDAY = WEEKDAYS.WEDNESDAY;
// // export const WEEK_THURSDAY = WEEKDAYS.THURSDAY;
// // export const WEEK_FIRDAY = WEEKDAYS.FRIDAY; // 元のスペルミスを維持
// // export const WEEK_SATURDAY = WEEKDAYS.SATURDAY;

// export const DAYWISE_ITEMS = {
//   [WEEKDAYS.SUNDAY]: {
//     bgColor: "bg-red-100",
//     weekday: "日"
//   },
//   [WEEKDAYS.MONDAY]: {
//     bgColor: "bg-yellow-100", 
//     weekday: "月"
//   },
//   [WEEKDAYS.TUESDAY]: {
//     bgColor: "bg-fuchsia-100",
//     weekday: "火"
//   },
//   [WEEKDAYS.WEDNESDAY]: {
//     bgColor: "bg-green-100",
//     weekday: "水"
//   },
//   [WEEKDAYS.THURSDAY]: {
//     bgColor: "bg-amber-100",
//     weekday: "木"
//   },
//   [WEEKDAYS.FRIDAY]: {
//     bgColor: "bg-cyan-100",
//     weekday: "金"
//   },
//   [WEEKDAYS.SATURDAY]: {
//     bgColor: "bg-indigo-100",
//     weekday: "土"
//   }
// } as const; 