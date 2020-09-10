from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .forms import *
from .models import *


User = get_user_model()

# Register your models here.

# User Admin model
class UserAdmin(BaseUserAdmin):
    """ Modify the Admin page for User model """

    # Create a search bar to search by users' email addresses
    search_fields = ['email']
    ordering = ['email']
    filter_horizontal = ()

    # Add the forms
    form = UserChangeForm
    add_form = UserCreationForm

    # List of fields to show in User table
    list_display = ['id', 'email', 'name', 'is_active', 'is_staff', 'is_admin']
    list_filter = ['is_admin']

    # Fieldsets to be shown in user's page
    fieldsets = (
        (None, {'fields': ['email', 'password']}),
        ('Personal Info', {'fields': ['name']}),
        ('Status', {'fields': ['is_active']}),
        ('Permissions', {'fields': ['is_staff', 'is_admin']}),
    )

    # Fieldsets to be shown in add user's page
    add_fieldsets = (
        (None, {
            'classes': ['wide'],
            'fields': ['email', 'name', 'password1', 'password2']}
         ),
    )

    # State the model
    class Meta:
        model = User


# Menu Admin model
class MenuAdmin(admin.ModelAdmin):
    """ Modify the Admin page for Menu model """

    # Create a search bar to search by item's name
    search_fields = ['name']
    ordering = ['name']
    filter_horizontal = ()

    # Add forms
    form = MenuForm

    # List of fields to be shown in Menu table
    list_display = ['id', 'category', 'name', 'description', 'price', 'size', 'topping']
    list_filter = ['category']

    # State the model
    class Meta:
        model = Menu


# Category Admin model
class CategoryAdmin(admin.ModelAdmin):
    """ Modify the Admin page for Category model """

    # Create a search bar to search by item's category
    search_fields = ["category"]
    ordering = ["category"]
    filter_horizontal = ()

    # List of fields to be shown
    list_display = ["id", "category"]

    # State the model
    class Meta:
        model = Category


# Price Admin model
class PriceAdmin(admin.ModelAdmin):
    """ Modify the Admin page for Price model """

    # Create a search bar to search by item's name
    search_fields = ["name"]
    ordering = ["name"]
    filter_horizontal = ()

    # Add form
    form = PriceForm

    # List of fields to be shown
    list_display = ["name", "size", "no_topping", "one_topping", "two_topping", "three_topping", "special_topping"]

    # State the model
    class Meta:
        model = Price


# Toppings Admin model
class ToppingsAdmin(admin.ModelAdmin):
    """ Modify the Admin page for Toppings model """

    # Create a search bar to search by item's name
    search_fields = ["name"]
    ordering = ["id"]
    filter_horizontal = ()

    # Add form
    form = ToppingsForm

    # List of fields to be shown
    list_display = ["id", "name", "special"]

    # State the model
    class Meta:
        model = Toppings


# Orders Info Admin model
class OrdersInfoAdmin(admin.ModelAdmin):
    """ Modify the Admin page for Orders Info model """

    search_fields = ["id"]
    ordering = ["id"]
    filter_horizontal = ()

    form = OrdersInfoForm

    list_display = ["id", "name", "user_id", "street_address", "city", "country", "phone_number", "notes", "total_price"]

    class Meta:
        model = OrdersInfo


# Orders Items Admin model
class OrdersItemsAdmin(admin.ModelAdmin):
    """ Modify the Admin page for Orders Items model """

    search_fields = ["order_id"]
    ordering = ["id"]
    filter_horizontal = ()

    form = OrdersItemsForm

    list_display = ["id", "order_id", "name", "size", "topping", "price"]

    class Meta:
        model = OrdersItems


# Orders Toppings Admin model
class OrdersToppingsAdmin(admin.ModelAdmin):
    """ Modify the Admin page for Orders Toppings model """

    search_fields = ["order_id"]
    ordering = ["id"]
    filter_horizontal = ()

    form = OrdersToppingsForm

    list_display = ["order_id", "item_id", "name"]

    class Meta:
        model = OrdersToppings


# Not using Django's built-in permissions, unregister the Group model from admin
admin.site.unregister(Group)

# Register the new User model and UserAdmin
admin.site.register(User, UserAdmin)

# Register the Menu model and MenuAdmin
admin.site.register(Menu, MenuAdmin)

# Register the Category model and CategoryAdmin
admin.site.register(Category, CategoryAdmin)

# Register the Price model and PriceAdmin
admin.site.register(Price, PriceAdmin)

# Register the Toppings model and ToppingsAdmin
admin.site.register(Toppings, ToppingsAdmin)

admin.site.register(OrdersInfo, OrdersInfoAdmin)

admin.site.register(OrdersItems, OrdersItemsAdmin)

admin.site.register(OrdersToppings, OrdersToppingsAdmin)


