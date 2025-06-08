from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CarViewSet, RegisterView, LoginView, upload_csv, export_csv, export_json, get_statistics, get_distinct_values, get_recent_cars, UserMeView, ChangePasswordView

router = DefaultRouter()
router.register(r'cars', CarViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('export-csv/', export_csv, name='export-csv'),  
    path('export-json/', export_json, name='export-json'), 
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('upload-csv/', upload_csv, name='upload-csv'),
    path('statistics/', get_statistics, name='statistics'),
    path('distinct/', get_distinct_values, name='distinct-values'),
    path('recent-cars/', get_recent_cars, name='recent-cars'),
    path('users/me/', UserMeView.as_view(), name='user-me'),
    path('users/change-password/', ChangePasswordView.as_view(), name='change-password'),
]