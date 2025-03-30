FROM --platform=linux/amd64 node:20-alpine AS build

WORKDIR /app

# Копируем package.json и package-lock.json перед установкой зависимостей
COPY package.json package-lock.json ./

# Очистка кеша и установка зависимостей
RUN npm cache clean --force && npm install

# Копируем весь код
COPY . .

# Увеличиваем память для билда (если нужно)
ENV NODE_OPTIONS="--max_old_space_size=2048"

# Даем права на файлы
RUN chmod -R 777 /app

# Собираем проект
RUN npm run build

# Используем Nginx для раздачи статических файлов
FROM nginx:latest

# Удаляем стандартный конфиг Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Копируем статические файлы
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем конфигурацию Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Экспонируем порт
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]