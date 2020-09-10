from django import template

register = template.Library()

@register.filter(name="underscore")
def underscore(value):

    return value.replace(" ", "_")


