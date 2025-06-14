from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('car_app.urls')),
    path('', include('django_prometheus.urls')),
]