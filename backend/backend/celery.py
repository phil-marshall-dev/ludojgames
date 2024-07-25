from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

app = Celery('backend')

# Using a string here means the worker does not have to serialize
# the configuration object to child processes.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Add the new setting to retain existing behavior for broker connection retries on startup
app.conf.update(
    broker_connection_retry_on_startup=True,
)

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()
