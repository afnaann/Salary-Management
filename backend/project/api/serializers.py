from rest_framework import serializers
from .models import User, Employee, Salary
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.core.mail import send_mail
from project.settings import EMAIL_HOST_USER
from django.db import  transaction
from datetime import date


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']



class EmployeeSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Employee
        fields = ['id', 'user', 'employee_id', 'designation', 'department', 'date_of_joining', 'upi_id', 'is_active', 'basic_salary']

    def validate_date_of_joining(self, value):
        if value > date.today():
            raise serializers.ValidationError("Date of joining cannot be a future date.")
        return value
    
    def create(self, validated_data):
        user_data = validated_data.pop('user', None)

        if not user_data or not all(k in user_data for k in ['username', 'password', 'email']):
            raise serializers.ValidationError({"error": "Invalid user data. 'username', 'password', and 'email' are required."})

        with transaction.atomic(): 
            user = User.objects.create_user(**user_data)
            employee = Employee.objects.create(user=user, **validated_data)    
            subject = 'You Can now login to Salary Management!'
            message = (
                f"Dear {user.username},\n\n"
                "You Have Joined In the Salary Management System. Your account has been successfully created.\n\n"
                "You can now log in to the app using the following credentials:\n"
                f"Username: {user.username}\n"
                f"Password: {user_data['password']}\n\n"
                "We recommend keeping your credentials safe and secure. If you have any questions, feel free to reach out to our support team.\n\n"
                "Best regards,\n"
                "The Task Management Team"
            )
            print('sending mail')
            recipient_list = [user_data['email']]
            send_mail(subject, message, EMAIL_HOST_USER, recipient_list, fail_silently=False)

        return employee




class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username
        token['is_staff'] = user.is_staff

        return token
    

class SalarySerializer(serializers.ModelSerializer):
    employee = EmployeeSerializer()
    
    class Meta:
        model = Salary
        fields = ['id','employee', 'month', 'year', 'allowances', 'deductions', 'net_salary', 'pay_date']
        
class EmployeeSalarySerializer(serializers.ModelSerializer):
        
    class Meta:
        model = Salary
        fields = ['id','employee', 'month', 'year', 'allowances', 'deductions', 'net_salary', 'pay_date']
        
