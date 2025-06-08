from django.db import models
from django.contrib.auth.models import User

class Car(models.Model):
    external_id = models.IntegerField(null=True, blank=True)  
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cars')
    mark = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    generation_name = models.CharField(max_length=100, blank=True, null=True)
    year = models.IntegerField()
    mileage = models.IntegerField()
    vol_engine = models.FloatField()
    fuel = models.CharField(max_length=50)
    city = models.CharField(max_length=100)
    province = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return f"{self.mark} {self.model} ({self.year})"

    class Meta:
        ordering = ['-id']