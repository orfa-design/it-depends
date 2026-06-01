export interface GlobalCopy {
  headerLogo: string;
  headerAddStep: string;
  headerCopy: string;
  headerReset: string;
}

export interface CalibrateCopy {
  wowBtn: string;
  heardBtn: string;
  skipBtn: string;
  skipCalibrationBtn: string;
  doneHeading: string;
}

export interface GalleryCopy {
  heading: string;
  recommendedSection: string;
  emptyState: string;
}

export interface MapCopy {
  heading: string;
  defaultPathNote: string;
  viewAllBtn: string;
}

export interface StepCopy {
  pitchLabel: string;
  usedWhenLabel: string;
  taskLabel: string;
  takeBtn: string;
  doneBtn: string;
  finishPhaseBtn: string;
  alsoTryHeading: string;
  levelUpHeading: string;
}

export interface DoneCopy {
  heading: string;
  urlLabel: string;
  saveBtn: string;
  shareHeading: string;
  mapBtn: string;
}

export interface ProgressCopy {
  heading: string;
  emptyState: string;
  toGalleryBtn: string;
}

export interface AppCopy {
  global: GlobalCopy;
  calibrate: CalibrateCopy;
  gallery: GalleryCopy;
  map: MapCopy;
  step: StepCopy;
  done: DoneCopy;
  progress: ProgressCopy;
}

export const DEFAULT_COPY: AppCopy = {
  global: {
    headerLogo: "· It Depends",
    headerAddStep: "+ Додати крок",
    headerCopy: "✏️ Копі",
    headerReset: "Почати все з початку"
  },
  calibrate: {
    wowBtn: "Круто, ніколи б не подумала, що AI таке вміє",
    heardBtn: "Чула про таке, але не пробувала, цікаво",
    skipBtn: "Не цікаво",
    skipCalibrationBtn: "пропустити",
    doneHeading: "готово."
  },
  gallery: {
    heading: "Галерея",
    recommendedSection: "Для тебе",
    emptyState: "Тут поки немає кроків. Спробуйте змінити фільтри."
  },
  map: {
    heading: "Твій маршрут",
    defaultPathNote: "Показуємо дефолтний шлях. Пройдіть калібровку для отримання персональних рекомендацій.",
    viewAllBtn: "переглянути всі"
  },
  step: {
    pitchLabel: "Пітч",
    usedWhenLabel: "Практичне використання:",
    taskLabel: "Моя задача",
    takeBtn: "взяти в роботу",
    doneBtn: "я зробила — далі",
    finishPhaseBtn: "закінчити фазу",
    alsoTryHeading: "ТАКОЖ СПРОБУЙ",
    levelUpHeading: "⚡ Далі: потужніший шлях"
  },
  done: {
    heading: "Готово!",
    urlLabel: "URL результату (опційно):",
    saveBtn: "зберегти",
    shareHeading: "Поділитись результатом:",
    mapBtn: "на мапу →"
  },
  progress: {
    heading: "Активні задачі",
    emptyState: "Ти ще не взяла жодного кроку в роботу",
    toGalleryBtn: "до галереї"
  }
};
