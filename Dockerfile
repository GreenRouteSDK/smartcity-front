FROM nginx:1.13.6-alpine
COPY dist /usr/share/nginx/html/
EXPOSE 80
