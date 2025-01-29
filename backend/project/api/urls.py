from django.urls import path
from .views import *
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)



urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('salary-stats/', CompanyStatsAPIView.as_view(), name='company-stats'),

    path('employees/', EmployeeAPIView.as_view(), name='employee-list'),
    path('employees/<int:pk>/', EmployeeAPIView.as_view(), name='employee-detail'),
    path('salaries/', SalaryAPIView.as_view(), name='salary-list'),
    path('salaries/<int:pk>/', SalaryAPIView.as_view(), name='salary-detail'),
]