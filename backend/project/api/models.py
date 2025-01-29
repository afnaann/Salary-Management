from django.utils import timezone
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.forms import ValidationError
from datetime import date

class User(AbstractUser):
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.username


class Employee(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    employee_id = models.CharField(max_length=100, unique=True)  
    designation = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    date_of_joining = models.DateField()
    basic_salary = models.DecimalField(max_digits=10, decimal_places=2, default=0)  
    upi_id = models.CharField(max_length=20)
    is_active = models.BooleanField(default=True)


class Salary(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='salaries')
    month = models.PositiveSmallIntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(12)
        ]
    )    
    year = models.PositiveIntegerField()        
    allowances = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    net_salary = models.DecimalField(max_digits=10, decimal_places=2, blank=True)
    pay_date = models.DateField(auto_now_add=True)

    class Meta:
        unique_together = ('employee', 'month', 'year')  

    def save(self, *args, **kwargs):
        current_date = timezone.now().date()
        current_year = current_date.year
        current_month = current_date.month
        if self.year > current_year or (self.year == current_year and self.month > current_month):
            raise ValidationError("Salary date cannot be in the future.")
        date_of_joining = self.employee.date_of_joining
        
        if self.year < date_of_joining.year or (self.year == date_of_joining.year and self.month < date_of_joining.month):
            raise ValidationError("Salary date cannot be before the employee's date of joining.")
        
        self.net_salary = self.employee.basic_salary + self.allowances - self.deductions
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Salary for {self.employee.user.username} ({self.month}/{self.year})"