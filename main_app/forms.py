from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from .models import *


User = get_user_model()

class UserCreationForm(forms.ModelForm):
    """ A form for creating new users. """

    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Password confirmation', widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ['email', 'name']

    def clean_password2(self):
        # Check that the confirmed password matches the original password
        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')

        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords don't match")

        return password2

    def save(self, commit=True):
        # Save the inputted password in hashed format
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])

        if commit:
            user.save()

        return user


class UserChangeForm(forms.ModelForm):
    """ A form for updating users' existing information. """

    password = ReadOnlyPasswordHashField()

    class Meta:
        model = User
        fields = ['email', 'password', 'name', 'is_active', 'is_staff', 'is_admin']

    def clean_password(self):
        # Ignore whatever the user provides
        return self.initial["password"]


class MenuForm(forms.ModelForm):
    """ A form for creating a menu item. """

    category = forms.ModelChoiceField(queryset=Category.objects.all(), to_field_name='category', empty_label=None)
    name = forms.CharField(label="Name")
    description = forms.CharField(label="Description", widget=forms.Textarea)
    price = forms.DecimalField(label="Price")
    size = forms.ChoiceField(choices=(('all', 'All'), ('none', 'None')))
    topping = forms.ChoiceField(choices=(('all', 'All'), ('none', 'None')))
    image = forms.ImageField(label="Image")

    class Meta:
        model = Menu
        fields = ['category', 'name', 'description', 'size', 'topping']

    def save(self, commit=True):
        menu = super().save(commit=False)

        if commit:
            menu.save()

        return menu


class PriceForm(forms.ModelForm):
    """ A form for creating the prices for an item """

    name = forms.ModelChoiceField(queryset=Menu.objects.all(), to_field_name='name', empty_label=None)
    size = forms.ChoiceField(choices=(('none', 'None'), ('small', 'Small'), ('large', 'Large')))
    no_topping = forms.DecimalField(label="No Topping")
    one_topping = forms.DecimalField(label="1 Topping")
    two_topping = forms.DecimalField(label="2 Toppings")
    three_topping = forms.DecimalField(label="3 Toppings")
    special_topping = forms.DecimalField(label="Special Topping")

    class Meta:
        model = Price
        fields = ['name', 'size', 'no_topping', 'one_topping', 'two_topping', 'three_topping', 'special_topping']

    def save(self, commit=True):
        price = super().save(commit=False)

        if commit:
            price.save()

        return price


class ToppingsForm(forms.ModelForm):
    """ A form for creating the toppings for an item """

    name = forms.CharField(label="Name")
    special = forms.ChoiceField(choices=(('yes', 'Yes'), ('no', 'No')))

    class Meta:
        model = Toppings
        fields = ['name', 'special']

    def save(self, commit=True):
        toppings = super().save(commit=False)

        if commit:
            toppings.save()

        return toppings


class OrdersInfoForm(forms.ModelForm):
    """ A form for creating the main orders' info """

    name = forms.CharField(label="Name")
    user_id = forms.IntegerField(label="User id")
    street_address = forms.CharField(label="Street address")
    city = forms.CharField(label="City")
    country = forms.CharField(label="Country")
    phone_number = forms.CharField(label="Phone number")
    notes = forms.CharField(label="Notes", widget=forms.Textarea)

    class Meta:
        model = OrdersInfo
        fields = ['name', 'user_id', 'street_address', 'city', 'country', 'phone_number', 'notes']

    def save(self, commit=True):
        ordersinfo = super().save(commit=False)

        if commit:
            ordersinfo.save()

        return ordersinfo


class OrdersItemsForm(forms.ModelForm):
    """ A form for creating the orders' items """

    order_id = forms.IntegerField(label="Order id")
    name = forms.CharField(label="Name")
    size = forms.ChoiceField(choices=(('none', 'None'), ('small', 'Small'), ('large', 'Large')))
    topping = forms.ChoiceField(choices=(('all', 'All'), ('none', 'None')))
    price = forms.DecimalField(label="Price")

    class Meta:
        model = OrdersItems
        fields = ['order_id', 'name', 'size', 'topping', 'price']

    def save(self, commit=True):
        ordersitems = super().save(commit=False)

        if commit:
            ordersitems.save()

        return ordersitems


class OrdersToppingsForm(forms.ModelForm):
    """ A form for creating the orders' toppings """

    order_id = forms.IntegerField(label="Order id")
    item_id = forms.IntegerField(label="Item id")
    name = forms.CharField(max_length=64)

    class Meta:
        model = OrdersToppings
        fields = ['order_id', 'item_id', 'name']

    def save(self, commit=True):
        ordertoppings = super().save(commit=False)

        if commit:
            ordertoppings.save()

        return ordertoppings




