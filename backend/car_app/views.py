import csv
import json
import pandas as pd
from django.db import transaction
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import HttpResponse
from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth import authenticate
from django.db.models import Avg, Max, Min, Count, Q
from datetime import datetime
from .models import Car
from .serializers import CarSerializer, UserSerializer
from .pagination import CustomPageNumberPagination
from rest_framework import filters
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated

class RegisterView(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user_id': user.id,
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email
                
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@method_decorator(csrf_exempt, name='dispatch')
class CarViewSet(viewsets.ModelViewSet):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = CustomPageNumberPagination
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['id', 'year', 'price', 'mileage', 'mark', 'model', 'fuel']
    ordering = ['-id']

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def get_queryset(self):
        queryset = Car.objects.filter(user=self.request.user)
        
        # Ogólne wyszukiwanie
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(mark__icontains=search) |
                Q(model__icontains=search) |
                Q(generation_name__icontains=search) |
                Q(city__icontains=search) |
                Q(province__icontains=search)
            )
        
        # Specyficzne filtry
        mark = self.request.query_params.get('mark')
        if mark:
            queryset = queryset.filter(mark__icontains=mark)
            
        model = self.request.query_params.get('model')
        if model:
            queryset = queryset.filter(model__icontains=model)
            
        year_min = self.request.query_params.get('year_min')
        if year_min:
            try:
                queryset = queryset.filter(year__gte=int(year_min))
            except ValueError:
                pass
            
        year_max = self.request.query_params.get('year_max')
        if year_max:
            try:
                queryset = queryset.filter(year__lte=int(year_max))
            except ValueError:
                pass
                
        fuel = self.request.query_params.get('fuel')
        if fuel:
            queryset = queryset.filter(fuel__icontains=fuel)
            
        province = self.request.query_params.get('province')
        if province:
            queryset = queryset.filter(province__icontains=province)
            
        price_min = self.request.query_params.get('price_min')
        if price_min:
            try:
                queryset = queryset.filter(price__gte=float(price_min))
            except ValueError:
                pass
            
        price_max = self.request.query_params.get('price_max')
        if price_max:
            try:
                queryset = queryset.filter(price__lte=float(price_max))
            except ValueError:
                pass
        
        # Usuwamy własną obsługę sortowania, bo DRF obsłuży ordering
            
        # Optymalizacja zapytania dla dużych zbiorów danych
        queryset = queryset.select_related().only(
            'id', 'mark', 'model', 'generation_name', 'year', 'mileage', 
            'vol_engine', 'fuel', 'city', 'province', 'price'
        )
            
        return queryset

    def destroy(self, request, *args, **kwargs):
        car = self.get_object()
        car.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        car = self.get_object()
        if car.user != request.user:
            return Response({'error': 'Brak uprawnień do edycji tego pojazdu.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = self.get_serializer(car, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({'message': 'Zaktualizowano pomyślnie', 'car': serializer.data}, status=status.HTTP_200_OK)
    
    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def upload_csv(request):
    if 'file' not in request.FILES:
        return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)
        
    file = request.FILES['file']
    try:
        df = pd.read_csv(file)
        df.columns = df.columns.str.strip()
        
        if df.shape[1] == 11: 
            df.columns = ['external_id', 'mark', 'model', 'generation_name', 'year', 'mileage', 'vol_engine', 'fuel', 'city', 'province', 'price']

        car_objects = []
        total_rows = len(df)
        progress_step = max(1, total_rows // 10)

        with transaction.atomic():
            for idx, row in df.iterrows():
                car_data = {
                    'mark': row['mark'],
                    'model': row['model'],
                    'year': row['year'],
                    'mileage': row['mileage'],
                    'vol_engine': row['vol_engine'],
                    'fuel': row['fuel'],
                    'city': row['city'],
                    'province': row['province'],
                    'price': row['price'],
                    'user': request.user
                }    

                if 'external_id' in row and pd.notna(row['external_id']):
                    car_data['external_id'] = row['external_id']
            
                if 'generation_name' in row and pd.notna(row['generation_name']):
                    car_data['generation_name'] = row['generation_name']
            
                car_objects.append(Car(**car_data))

                # Zapisuj co 1000 rekordów, aby oszczędzać pamięć przy dużych plikach
                if len(car_objects) >= 1000:
                    Car.objects.bulk_create(car_objects)
                    car_objects = []

            if car_objects:
                Car.objects.bulk_create(car_objects)
        
        return Response({
            'success': f'Zaimportowano pomyślnie {total_rows} rekordów',
            'total_rows': total_rows
        }, status=status.HTTP_201_CREATED)
    except Exception as e:        
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

def filter_cars(request):
    """Helper function to apply filters on car queryset"""
    queryset = Car.objects.filter(user=request.user)
    
    # Ogólne wyszukiwanie
    search = request.query_params.get('search')
    if search:
        queryset = queryset.filter(
            Q(mark__icontains=search) |
            Q(model__icontains=search) |
            Q(generation_name__icontains=search) |
            Q(city__icontains=search) |
            Q(province__icontains=search)
        )
    
    # Specyficzne filtry
    mark = request.query_params.get('mark')
    if mark:
        queryset = queryset.filter(mark__icontains=mark)
        
    model = request.query_params.get('model')
    if model:
        queryset = queryset.filter(model__icontains=model)
        
    year_min = request.query_params.get('year_min')
    if year_min:
        try:
            queryset = queryset.filter(year__gte=int(year_min))
        except ValueError:
            pass
        
    year_max = request.query_params.get('year_max')
    if year_max:
        try:
            queryset = queryset.filter(year__lte=int(year_max))
        except ValueError:
            pass
        
    fuel = request.query_params.get('fuel')
    if fuel:
        queryset = queryset.filter(fuel__icontains=fuel)
        
    province = request.query_params.get('province')
    if province:
        queryset = queryset.filter(province__icontains=province)
    
    price_min = request.query_params.get('price_min')
    if price_min:
        try:
            queryset = queryset.filter(price__gte=float(price_min))
        except ValueError:
            pass
        
    price_max = request.query_params.get('price_max')
    if price_max:
        try:
            queryset = queryset.filter(price__lte=float(price_max))
        except ValueError:
            pass
    
    # Dodajemy możliwość sortowania
    sort_by = request.query_params.get('sort_by', '-id')
    valid_sort_fields = ['id', 'year', 'price', 'mileage', 'mark', 'model', 'fuel']
    sort_field = sort_by.lstrip('-')
    
    if sort_field in valid_sort_fields:
        queryset = queryset.order_by(sort_by)
    else:
        queryset = queryset.order_by('-id')  # Domyślne sortowanie od najnowszych
        
    # Optymalizacja zapytania dla dużych zbiorów danych
    queryset = queryset.select_related().only(
        'id', 'mark', 'model', 'generation_name', 'year', 'mileage', 
        'vol_engine', 'fuel', 'city', 'province', 'price'
    )
    
    return queryset

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def export_csv(request):
    """
    Eksportuje dane samochodów do formatu CSV.
    """
    
    try:
        queryset = filter_cars(request)
        
        response = HttpResponse(content_type='text/csv; charset=utf-8')
        response['Content-Disposition'] = f'attachment; filename="car_data_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv"'
        
        response.write('\ufeff')
        
        writer = csv.writer(response)
        writer.writerow(['mark', 'model', 'generation_name', 'year', 'mileage', 'vol_engine', 'fuel', 'city', 'province', 'price'])
        
        batch_size = 1000
        total = queryset.count()
        
        for offset in range(0, total, batch_size):
            batch = queryset[offset:offset + batch_size]
            for car in batch:
                writer.writerow([
                    car.mark or '', 
                    car.model or '', 
                    car.generation_name or '', 
                    car.year or '', 
                    car.mileage or '',
                    car.vol_engine or '', 
                    car.fuel or '', 
                    car.city or '', 
                    car.province or '', 
                    car.price or ''
                ])
        
        return response
    except Exception as e:
        print(f"Error in export_csv: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def export_json(request):
    """
    Eksportuje dane samochodów do formatu JSON.
    """
    
    try:
        queryset = filter_cars(request)
        
        max_export = 10000
        if queryset.count() > max_export:
            queryset = queryset[:max_export]
            
        serializer = CarSerializer(queryset, many=True)
        json_data = json.dumps(serializer.data, indent=4, ensure_ascii=False)
        response = HttpResponse(json_data, content_type='application/json; charset=utf-8')
        response['Content-Disposition'] = f'attachment; filename="car_data_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json"'
        
        return response
    except Exception as e:
        print(f"Error in export_json: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_statistics(request):
    current_year = datetime.now().year
    start_year = current_year - 11

    user_cars = Car.objects.filter(user=request.user)
    
    price_trends = (
        user_cars
        .filter(year__gte=start_year, year__lte=current_year)
        .values('year')
        .annotate(avg_price=Avg('price'))
        .order_by('year')
    )
    
    price_trends_data = []
    for trend in price_trends:
        price_trends_data.append({
            'month': str(trend['year']),
            'avg_price': round(trend['avg_price'], 2) if trend['avg_price'] else 0
        })
    
    if len(price_trends_data) < 6:
        avg_price = user_cars.aggregate(avg_price=Avg('price'))['avg_price'] or 50000
        price_trends_data = []
        for i in range(12):
            year = current_year - 11 + i
            variation = (-1 if i % 2 == 0 else 1) * (i * 2000)
            price_trends_data.append({
                'month': str(year),
                'avg_price': round(max(10000, avg_price + variation), 2)
            })
    
    stats = {
        'total_cars': user_cars.count(),
        'avg_price': round(user_cars.aggregate(avg_price=Avg('price'))['avg_price'] or 0, 2),
        'max_price': user_cars.aggregate(max_price=Max('price'))['max_price'] or 0,
        'min_price': user_cars.aggregate(min_price=Min('price'))['min_price'] or 0,
        'avg_year': round(user_cars.aggregate(avg_year=Avg('year'))['avg_year'] or 0, 1),
        'avg_mileage': round(user_cars.aggregate(avg_mileage=Avg('mileage'))['avg_mileage'] or 0, 0),
        'cars_by_fuel': list(user_cars.values('fuel').annotate(count=Count('id')).order_by('-count')),
        'cars_by_mark': list(user_cars.values('mark').annotate(count=Count('id')).order_by('-count')[:10]),
        'cars_by_province': list(user_cars.values('province').annotate(count=Count('id')).order_by('-count')),
        'price_trends': price_trends_data
    }
    
    return Response(stats)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_distinct_values(request):
    """
    Endpoint zwracający unikalne wartości marek i rodzajów paliwa samochodów.
    """
    user_cars = Car.objects.filter(user=request.user)
    try:
        distinct_marks = user_cars.values_list('mark', flat=True).distinct()
        distinct_marks = [mark for mark in distinct_marks if mark]
        
        distinct_fuels = user_cars.values_list('fuel', flat=True).distinct()
        distinct_fuels = [fuel for fuel in distinct_fuels if fuel] 
        
        return Response({
            'marks': list(distinct_marks),
            'fuels': list(distinct_fuels)
        })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_recent_cars(request):
    """
    Endpoint zwracający ostatnie 5 dodanych samochodów.
    """
    user_cars = Car.objects.filter(user=request.user)
    try:
        recent_cars = user_cars.all().order_by('-id')[:5]
        serializer = CarSerializer(recent_cars, many=True)        
        
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(csrf_exempt, name='dispatch')
class UserMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Brak uprawnień.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            email = serializer.validated_data.get('email')
            username = serializer.validated_data.get('username')
            if email and User.objects.exclude(pk=request.user.pk).filter(email=email).exists():
                return Response({'email': ['Użytkownik z takim adresem email już istnieje.']}, status=status.HTTP_400_BAD_REQUEST)
            if username and User.objects.exclude(pk=request.user.pk).filter(username=username).exists():
                return Response({'username': ['Użytkownik o takiej nazwie już istnieje.']}, status=status.HTTP_400_BAD_REQUEST)
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Brak uprawnień.'}, status=status.HTTP_403_FORBIDDEN)
        request.user.delete()
        return Response({'detail': 'Konto zostało usunięte.'}, status=status.HTTP_204_NO_CONTENT)

@method_decorator(csrf_exempt, name='dispatch')
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')

        if not user.check_password(current_password):
            return Response({'current_password': ['Nieprawidłowe aktualne hasło.']}, status=status.HTTP_400_BAD_REQUEST)
        if not new_password or len(new_password) < 6:
            return Response({'new_password': ['Nowe hasło musi mieć co najmniej 6 znaków.']}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({'detail': 'Hasło zostało zmienione.'}, status=status.HTTP_200_OK)