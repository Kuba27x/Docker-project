from django.contrib import admin
from .models import Car

@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ('mark', 'model', 'year', 'fuel', 'price')
    list_filter = ('mark', 'fuel', 'year')
    search_fields = ('mark', 'model', 'city', 'province')