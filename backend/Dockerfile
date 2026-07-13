# Use the official Python slim image.
FROM python:3.12-slim

# Allow statements and log messages to immediately appear in the Knative logs
ENV PYTHONUNBUFFERED True

# Copy local code to the container image.
ENV APP_HOME /app
WORKDIR $APP_HOME
COPY . ./

# Install production dependencies.
RUN pip install --no-cache-dir -r requirements.txt

# Run collectstatic (safe to run at build time)
RUN python manage.py collectstatic --no-input

# Run the web service on container startup. 
# Cloud Run injects the PORT environment variable.
# Run migrations before starting the gunicorn server to ensure DB is up to date.
CMD ["sh", "-c", "python manage.py migrate && python create_admin.py && python fix_posts.py && exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 core.wsgi:application"]
