from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from .models import User, Employee, Salary
from .serializers import  EmployeeSerializer, SalarySerializer, EmployeeSalarySerializer
from django.db.models import Count, Avg, Sum


class EmployeeAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, pk=None):
        if pk:
            try:
                user = User.objects.get(id=pk)
                employee = Employee.objects.get(user=user)
                serializer = EmployeeSerializer(employee)
                return Response(serializer.data)
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
            except Employee.DoesNotExist:
                return Response({"error": "Employee details not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            employees = Employee.objects.all()
            serializer = EmployeeSerializer(employees, many=True)
            return Response(serializer.data)


    def post(self, request):
        if not request.user.is_staff:
            return Response({"detail": "You do not have permission to perform this action."}, status=403)
        
        serializer = EmployeeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if not request.user.is_staff:
            return Response({"detail": "You do not have permission to perform this action."}, status=403)
        
        try:
            employee = Employee.objects.get(pk=pk)
            user = User.objects.get(profile=employee)
            print(user)
            user.delete()
            employee.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Employee.DoesNotExist:
            return Response({"error": "Employee not found"}, status=status.HTTP_404_NOT_FOUND)

class SalaryAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, pk=None):
        if pk:
            try:
                user = User.objects.get(id=pk)
            except User.DoesNotExist:
                return Response({'error':'This User Does Not Exist'}, status=status.HTTP_400_BAD_REQUEST)
            employee = Employee.objects.get(user=user)
            
            salaries = Salary.objects.filter(employee=employee).order_by('-pay_date')

        else:
            salaries = Salary.objects.all().order_by('-pay_date')
            
        serializer = SalarySerializer(salaries, many=True)    
        return Response(serializer.data)

    def post(self, request):
        if not request.user.is_staff:
            return Response({"detail": "You do not have permission to perform this action."}, status=403)
        
        serializer = EmployeeSalarySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CompanyStatsAPIView(APIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        total_employees = Employee.objects.count()
        avg_salary = Employee.objects.aggregate(avg_salary=Avg('basic_salary'))['avg_salary']
        total_departments = Employee.objects.values('department').distinct().count()

       
        salary_overview = (
            Salary.objects.values('year', 'month')
            .annotate(total_salary_paid=Sum('net_salary'))
            .order_by('year', 'month')
        )

        return Response({
            "total_employees": total_employees,
            "average_salary": round(avg_salary, 2) if avg_salary else 0,
            "departments": total_departments,
            "salary_overview": list(salary_overview) 
        })