from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


# Create your models here.

# Settings when creating a user
class UserManager(BaseUserManager):
    def create_user(self, email, name, password=None, is_active=True, is_staff=False, is_admin=False):
        if not email:
            raise ValueError("Must enter an email address")

        if not name:
            raise ValueError("Must enter a name")

        if not password:
            raise ValueError("Must enter a password")

        user = self.model(
            email=self.normalize_email(email)
        )

        user.name = name
        user.set_password(password)
        user.is_active = is_active
        user.is_staff = is_staff
        user.is_admin = is_admin

        user.save(using=self._db)
        return user


    def create_staffuser(self, email, name, password=None):
        user = self.create_user(
            email,
            name,
            password=password,
            is_staff=True,
        )
        return user


    def create_superuser(self, email, name, password=None):
        user = self.create_user(
            email,
            name,
            password=password,
            is_staff=True,
            is_admin=True,
        )
        return user


# User table
class User(AbstractBaseUser):
    email = models.EmailField(max_length=64, unique=True)
    name = models.TextField()
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    objects = UserManager()

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return self.is_admin

    class Meta:
        verbose_name_plural = "Users"


# Menu items table
class Menu(models.Model):
    category = models.CharField(max_length=64)
    name = models.CharField(max_length=64)
    description = models.TextField()
    price = models.DecimalField(max_digits=64, decimal_places=2)
    size = models.CharField(max_length=64)
    topping = models.CharField(max_length=64)
    image = models.ImageField(upload_to='item_image', blank=True)

    objects = models.Manager()

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Menu"


# Category table
class Category(models.Model):
    category = models.CharField(max_length=64)
    image = models.ImageField(upload_to='category_image', blank=True)

    objects = models.Manager()

    def __str__(self):
        return self.category

    class Meta:
        verbose_name_plural = "Categories"


# Price table
class Price(models.Model):
    name = models.CharField(max_length=64)
    size = models.CharField(max_length=64)
    no_topping = models.DecimalField(max_digits=64, decimal_places=2)
    one_topping = models.DecimalField(max_digits=64, decimal_places=2)
    two_topping = models.DecimalField(max_digits=64, decimal_places=2)
    three_topping = models.DecimalField(max_digits=64, decimal_places=2)
    special_topping = models.DecimalField(max_digits=64, decimal_places=2)

    objects = models.Manager()

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Prices"


# Toppings table
class Toppings(models.Model):
    name = models.CharField(max_length=64)
    special = models.CharField(max_length=64)

    objects = models.Manager()

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Toppings"


# Orders Info table
class OrdersInfo(models.Model):
    name = models.CharField(max_length=64)
    user_id = models.IntegerField()
    street_address = models.CharField(max_length=200)
    city = models.CharField(max_length=64)
    country = models.CharField(max_length=64)
    phone_number = models.CharField(max_length=64)
    notes = models.TextField()
    total_price = models.DecimalField(max_digits=64, decimal_places=2)

    objects = models.Manager()

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Orders Info"


# Orders Items table
class OrdersItems(models.Model):
    order_id = models.IntegerField()
    name = models.CharField(max_length=64)
    size = models.CharField(max_length=64)
    topping = models.CharField(max_length=64)
    price = models.DecimalField(max_digits=64, decimal_places=2)

    objects = models.Manager()

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Orders Items"


# Orders Toppings table
class OrdersToppings(models.Model):
    order_id = models.IntegerField()
    item_id = models.IntegerField()
    name = models.CharField(max_length=64)

    objects = models.Manager()

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Orders Toppings"


