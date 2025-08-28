# Nginx Dockerfile
FROM nginx:alpine

# Copy custom nginx configuration
COPY conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf

# Create SSL directory
RUN mkdir -p /etc/nginx/ssl

# Copy SSL certificates (if available)
COPY ssl/* /etc/nginx/ssl/ 2>/dev/null || true

# Create log directory
RUN mkdir -p /var/log/nginx

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]