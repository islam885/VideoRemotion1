# Liquid Glass Cyberpunk Promo Video (Remotion)

> **20-секундный промо-ролик в стиле «Liquid Glass / Cyberpunk Glassmorphism» на Remotion (React + TypeScript).**
> Полностью самодостаточный production-ready проект с процедурным звуком (SFX), WebGL/ANGLE ускорением и готовым CI/CD воркфлоу для GitHub Actions.

---

## 🎬 1. Технические спецификации видео

| Параметр | Значение |
| :--- | :--- |
| **Длительность** | 20.0 секунд ровно |
| **FPS** | 60 кадров в секунду (всего **1200 кадров**) |
| **Разрешение** | 1920x1080 (Full HD, 16:9) |
| **Цветовая палитра** | Глубокий графит `#050505`, неон `#FF5500`, `#FF7700`, `#FFAA00`, теплый янтарный glow |
| **Стиль** | Liquid Glassmorphism — глянцевые фаски, преломления, хроматические аберрации, неоновые ореолы |
| **Звуковое сопровождение** | 100% процедурный чистый синтез без сторонних зависимостей (`whoosh.wav`, `glass_tick.wav`, `charge.wav`, `success_chime.wav`) |

---

## ⏱️ 2. Сценарий и таймлайн (1200 кадров)

1. **Кадры 0 – 240 (0–4 сек) — «Liquid Glass Orb & Circular Loader» (`Scene1Orb.tsx`)**:
   - Стеклянная сфера собирается в центре с вращающимся оранжевым ядром.
   - Круговой спидометр с градусными рисками и градиентным треком.
   - Плавный зум-переход с размытием.
2. **Кадры 240 – 540 (4–9 сек) — «Linear Glass Capsule / Multi-segment Bar» (`Scene2Bar.tsx`)**:
   - Горизонтальная капсула из толстого матового стекла.
   - Внутри переливается вязкая оранжевая жидкость (SVG wave animation) от 0% до 100%.
   - Индикаторы 10 сегментов и счетчик процентов с частотой потока.
3. **Кадры 540 – 840 (9–14 сек) — «Hexagonal / Cyber Matrix Progress» (`Scene3Matrix.tsx`)**:
   - Панель с сеткой из 24 шестиугольников, загорающихся по цепочке.
   - Всплывающие плавающие виджеты буферизации данных и пропускной способности.
4. **Кадры 840 – 1110 (14–18.5 сек) — «Radial Burst & Morphing Complete» (`Scene4Complete.tsx`)**:
   - Финальный прогресс 100%, радиальный взрыв неоновых частиц и двойная световая волна (Shockwave Ring).
   - Трансформация в стеклянную эмблему «COMPLETED / SYSTEM READY».
5. **Кадры 1110 – 1200 (18.5–20 сек) — «Outro & Clean Fade»**:
   - Элегантное затухание в глубокий черный через мягкий стеклянный дефокус (blur out).

---

## 🚀 3. Быстрый запуск

### Установка зависимостей:
```bash
npm install
```

### Генерация процедурных звуков SFX (0 external assets):
```bash
npm run generate-audio
```

### Интерактивный плеер и студия настройки (порт 3000):
```bash
npm run dev
```

### Запуск встроенного Remotion Preview Studio:
```bash
npm start
# или: npx remotion preview src/remotion-index.ts
```

### Рендеринг финального MP4 видео:
```bash
npm run render
# или с кастомными флагами:
npx remotion render src/remotion-index.ts LiquidGlassPromo out/liquid-glass-promo.mp4 --codec=h264 --crf=16 --gl=angle
```
Готовый видеофайл будет сохранен в `out/liquid-glass-promo.mp4`.

---

## 🤖 4. Автоматический рендеринг в GitHub Actions

В репозитории настроен рабочий воркфлоу `.github/workflows/render-video.yml`:

- **Триггеры:**
  - `push` в ветку `main` или `master`.
  - `workflow_dispatch` (ручной запуск с возможностью указать CRF и OpenGL backend).
- **Окружение:** Ubuntu runner, Node.js 22, системный Chromium, FFmpeg.
- **Действия:**
  1. Клонирует репозиторий и кеширует `node_modules`.
  2. Генерирует звуковые SFX файлы через `npm run generate-audio`.
  3. Рендерит видео `LiquidGlassPromo` через Remotion CLI с флагами `--codec=h264 --crf=16 --gl=angle`.
  4. Проверяет валидность видеофайла через `ffprobe`.
  5. Загружает готовый файл `out/liquid-glass-promo.mp4` в **GitHub Actions Artifacts** со сроком хранения **30 дней**!

---

## ⚙️ 5. Настройка через переменные окружения

Вы можете переопределить стиль и надписи в видео без изменения исходного кода с помощью переменных окружения (в `.env` или параметрах CI):

| Переменная | По умолчанию | Описание |
| :--- | :--- | :--- |
| `REMOTION_ACCENT_COLOR` | `#FF5500` | Основной неоновый акцентный цвет |
| `REMOTION_SECONDARY_COLOR`| `#FF7700` | Вторичный цвет янтарного свечения |
| `REMOTION_HIGHLIGHT_COLOR`| `#FFAA00` | Цвет ядра и ярких бликов |
| `REMOTION_BRAND_NAME` | `NEURAL_GLASS // OS` | Название бренда / системы |
| `REMOTION_SYSTEM_TAG` | `PROTOCOL 4.2.0-STABLE` | Версия протокола в HUD |
| `REMOTION_COMPLETION_TITLE`| `SYSTEM READY` | Главный заголовок финальной эмблемы |
| `REMOTION_COMPLETION_SUBTITLE`| `LIQUID CORE SYNCHRONIZATION 100%` | Подзаголовок финала |

---

## 📂 6. Структура проекта

```
├── .github/workflows/
│   └── render-video.yml       # Автоматический CI/CD рендеринг и выгрузка в артефакты
├── scripts/
│   └── generate-sfx.mjs       # Генератор чистого PCM 16-bit 44.1kHz WAV звука
├── public/audio/
│   ├── whoosh.wav             # Суб-басовый кинематографичный вуш
│   ├── glass_tick.wav         # Кристаллический щелчок стекла
│   ├── charge.wav             # Нарастающий кибер-заряд
│   └── success_chime.wav      # Теплый аккорд завершения
├── src/
│   ├── components/
│   │   ├── GlassContainer.tsx # Реюзабельный компонент стекла (CSS glassmorphism, highlights, sheen)
│   │   └── GlowEffect.tsx     # Неоновые градиенты, светящиеся пятна и сетка
│   ├── scenes/
│   │   ├── Scene1Orb.tsx      # Кадры 0-240: Сфера и круговой лоадер
│   │   ├── Scene2Bar.tsx      # Кадры 240-540: Линейная стеклянная капсула
│   │   ├── Scene3Matrix.tsx   # Кадры 540-840: Шестиугольная кибер-матрица
│   │   └── Scene4Complete.tsx # Кадры 840-1200: Радиальный взрыв и эмблема
│   ├── utils/
│   │   ├── transitions.ts     # Математика пружин, интерполяций, волн и взрыва
│   │   └── transitions.test.ts# Юнит-тесты на чистую логику (node:test)
│   ├── config/
│   │   └── videoConfig.ts     # Конфигурация параметров с поддержкой ENV
│   ├── Main.tsx               # Главный секвенсор с привязкой звука по кадрам
│   ├── Root.tsx               # Регистрация <Composition> на 1200 кадров 60fps
│   ├── remotion-index.ts      # Точка входа для Remotion CLI
│   ├── App.tsx                # Интерактивная веб-студия со встроенным Player
│   └── main.tsx               # Точка входа Vite SPA
├── remotion.config.ts         # Флаги рендеринга Chromium, ANGLE и WebGL
└── package.json
```
