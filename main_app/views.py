from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import make_password
from django.shortcuts import render
from django.http import JsonResponse
from django.shortcuts import redirect
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt
from .models import *

# Create your views here.

# Home page
def index(request):
    return render(request, "index.html")


# Menu page
def menu(request):

    if request.method == "POST":

        chosen_pizza = request.POST["chosen_pizza"]
        chosen_size = request.POST["chosen_size"]
        chosen_topping = request.POST["chosen_topping"]

        if chosen_size == "null":
            chosen_size = "none"

        if chosen_topping == "null":
            chosen_topping = "no_topping"

        chosen_price_list = Price.objects.values_list(chosen_topping, flat=True).filter(name=chosen_pizza, size=chosen_size)

        if len(chosen_price_list) == 0:
            return JsonResponse({"chosen_price": "no data"})

        for i in chosen_price_list:
            chosen_price = i

        return JsonResponse({"chosen_price": chosen_price})

    else:

        if not request.user.is_authenticated:
            return render(request, "login.html")

        items_list = []
        price_list = []
        price_outer_list = []
        main_list = []

        categories = Category.objects.all()

        toppings_normal = Toppings.objects.filter(special="no")
        toppings_special = Toppings.objects.filter(special="yes")

        for category in categories:
            price_inner_list = []

            items = Menu.objects.filter(category=category.category)

            for item in items:
                base_price = Menu.objects.values_list('price', flat=True).filter(name=item.name)

                for price in base_price:

                    price_inner_list.append(price)

            price_outer_list.append(price_inner_list)

            items_list.append(items)

        for i in price_outer_list:

            price_list.append(list(map(str, list(i))))


        main_list = zip(items_list, price_list, categories)

        context = {'main_list': main_list, 'categories': categories, 'toppings_normal': toppings_normal, "toppings_special": toppings_special}

        return render(request, "menu.html", context)


# Login page
@csrf_exempt
def login_view(request):

    if request.method == "POST":

        email = request.POST["email"]
        password = request.POST["password"]

        user = authenticate(request, email=email, password=password)

        if user is not None:
            login(request, user)
            return JsonResponse({"valid": "true"})

        else:
            return JsonResponse({"valid": "false"})

    else:
        return render(request, "login.html")


# Register page
@csrf_exempt
def register_view(request):

    if request.method == "POST":

        username = request.POST["username"]
        email = request.POST["email"]
        password = request.POST["password"]

        # Check if email is taken
        if User.objects.filter(email=email).count() != 0:
            return JsonResponse({"valid": "false"})

        else:
            hash_password = make_password(password)
            user = User(username=username, email=email, password=hash_password)
            user.save()

            return JsonResponse({"valid": "true"})

    else:
        return render(request, "register.html")

# Logout function
def logout_view(request):
    logout(request)
    return redirect('/login/')

# Add Customer's info function
def add_customer_info(request):

    current_user = request.user
    user_id = current_user.id

    name = User.objects.filter(id=user_id).values('name')
    name = name[0]['name']

    address = request.POST["customer_address"]
    city = request.POST["customer_city"]
    country = request.POST["customer_country"]
    phone_number = request.POST["customer_phone_number"]
    notes = request.POST["customer_notes"]
    total_price = request.POST["total_price"]

    customer = OrdersInfo(name=name, user_id=user_id, street_address=address, city=city, country=country,
                          phone_number=phone_number, notes=notes, total_price=total_price)
    customer.save()

    return JsonResponse({"ok": "ok"})


# Add Orders function
def add_orders(request):

    current_user = request.user
    user_id = current_user.id

    item_name = request.POST["orders_items_name"]
    item_size = request.POST["orders_items_size"]
    item_size = item_size.title()
    item_price = request.POST["orders_items_price"]
    item_toppings = request.POST["orders_items_toppings_choices"]

    item_toppings = item_toppings.split(", ")

    order_id = OrdersInfo.objects.filter(user_id=user_id).values('id')
    order_id = order_id[0]['id']

    if item_toppings[0] == "none":
        customer_order = OrdersItems(order_id=order_id, name=item_name, size=item_size, topping="None", price=item_price)

    else:
        customer_order = OrdersItems(order_id=order_id, name=item_name, size=item_size, topping="All", price=item_price)

    customer_order.save()

    item_id = OrdersItems.objects.filter(name=item_name).values('id')
    item_id = item_id[0]['id']

    for toppings in item_toppings:

        topping_order = OrdersToppings(order_id=order_id, item_id=item_id, name=toppings)
        topping_order.save()

    return JsonResponse({"ok": "ok"})


# Load Orders page
def orders(request):

    if request.method == "POST":
        current_user = request.user
        user_id = current_user.id

        if OrdersInfo.objects.filter(user_id=user_id).values().count() == 0:
            return JsonResponse({"status": "pass"})

        else:
            return JsonResponse({"status": "fail"})

    else:
        if not request.user.is_authenticated:
            return render(request, "login.html")

        current_user = request.user
        user_id = current_user.id

        try:
            order_info = OrdersInfo.objects.filter(user_id=user_id).values()[0]

            order_id = OrdersInfo.objects.filter(user_id=user_id).values('id')[0]['id']

            order_items = OrdersItems.objects.filter(order_id=order_id).values()

            order_toppings = OrdersToppings.objects.filter(order_id=order_id).values()

            context = {"order_items": order_items, "order_toppings": order_toppings, "order_info": order_info, "empty": "no"}

            return render(request, "orders.html", context)

        except:
            context = {"empty": "yes"}
            return render(request, "orders.html", context)

