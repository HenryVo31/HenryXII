from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("menu/", views.menu, name="menu"),
    path("login/", views.login_view, name="login"),
    path("register/", views.register_view, name="register"),
    path("logout/", views.logout_view, name="logout"),
    path("add_orders/", views.add_orders, name="add_orders"),
    path("add_customer_info/", views.add_customer_info, name="add_customer_info"),
    path("orders/", views.orders, name="orders"),
]



