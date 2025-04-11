from nginx:stable-alpine

COPY bookit.conf /etc/nginx/conf.d/default.conf
COPY certs /usr/share/nginx/certs

CMD ["nginx", "-g", "daemon off;"]