export const EMPTY_CD = "0";

// データタイプ関連の定数
export enum DATA_TYPE {
  TOWEEK_MENU_PLAN_DET = "1",
  BUY_INGRED = "2",
  MENU_PLAN = "3",
  MENU_PLAN_DET = "4",
  RECIPE = "5",
  RECIPE_INGRED = "6",
  INGRED = "7",
  INGRED_UNIT_CONV = "8",
};

export enum VISIBLE_TYPE {
  OPEN = "1",
  CLOSE = "2",
  HIDDEN = "3",
  MOMENTARILY_OPEN = "4",
  MOMENTARILY_CLOSE = "5"
};

export enum DICT_IDX {
  KEY = 0,
  VALUE = 1
};

export enum WEEKDAY_CD {
  SUNDAY = "1",
  MONDAY = "2",
  TUESDAY = "3",
  WEDNESDAY = "4",
  THURSDAY = "5",
  FRIDAY = "6",
  SATURDAY = "7"
};

export type WeekdayItems = {
  bgColor: string;
  label: {
    ja: string;   // "日"
    en: string;   // "Sun"
    full: {
      ja: string; // "日曜日"
      en: string; // "Sunday"
    }
  }
}

export const WEEKDAY_ITEMS_DICT: Record<WEEKDAY_CD, WeekdayItems> = {
  [WEEKDAY_CD.SUNDAY]: {
    bgColor: "bg-red-100",
    label: {
      ja: "日",
      en: "Sun",
      full: {
        ja: "日曜日",
        en: "Sunday"
      }
    }
  },
  [WEEKDAY_CD.MONDAY]: {
    bgColor: "bg-yellow-100",
    label: {
      ja: "月",
      en: "Mon",
      full: {
        ja: "月曜日",
        en: "Monday"
      }
    }
  },
  [WEEKDAY_CD.TUESDAY]: {
    bgColor: "bg-fuchsia-100",
    label: {
      ja: "火",
      en: "Tue",
      full: {
        ja: "火曜日",
        en: "Tuesday"
      }
    }
  },
  [WEEKDAY_CD.WEDNESDAY]: {
    bgColor: "bg-green-100",
    label: {
      ja: "水",
      en: "Wed",
      full: {
        ja: "水曜日",
        en: "Wednesday"
      }
    }
  },
  [WEEKDAY_CD.THURSDAY]: {
    bgColor: "bg-amber-100",
    label: {
      ja: "木",
      en: "Thu",
      full: {
        ja: "木曜日",
        en: "Thursday"
      }
    }
  },
  [WEEKDAY_CD.FRIDAY]: {
    bgColor: "bg-cyan-100",
    label: {
      ja: "金",
      en: "Fri",
      full: {
        ja: "金曜日",
        en: "Friday"
      }
    }
  },
  [WEEKDAY_CD.SATURDAY]: {
    bgColor: "bg-indigo-100",
    label: {
      ja: "土",
      en: "Sat",
      full: {
        ja: "土曜日",
        en: "Saturday"
      }
    }
  }
} as const; 

// ビジネスロジック関連
export const UNIT_CONV_TYPE_100_COMP = 1; 