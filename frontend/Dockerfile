FROM node:18 AS builder
WORKDIR /app

ARG VITE_API_URL
ARG VITE_API_BASE_URL
ARG VITE_KAKAO_APP_KEY

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_KAKAO_APP_KEY=$VITE_KAKAO_APP_KEY

COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
