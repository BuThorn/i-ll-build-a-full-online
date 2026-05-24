from decimal import Decimal

from django.core.management.base import BaseCommand
from django.utils.text import slugify

from apps.catalog.models import Category, Product


class Command(BaseCommand):
    help = "Seed the catalog with starter categories and products."

    def handle(self, *args, **options):
        fixtures = {
            "Home": [
                ("Linen Storage Basket", "A structured basket for throws, towels, and everyday clutter.", Decimal("42.00"), 18),
                ("Ceramic Pour-Over Set", "A clean ceramic brewer with matching server for slow mornings.", Decimal("58.00"), 12),
            ],
            "Travel": [
                ("Canvas Weekender", "A durable carryall with a padded laptop sleeve and shoe pocket.", Decimal("128.00"), 9),
                ("Packing Cube Trio", "Three lightweight cubes for tidy, quick-access packing.", Decimal("34.00"), 30),
            ],
            "Desk": [
                ("Walnut Monitor Stand", "Raises your display and keeps notebooks tucked neatly underneath.", Decimal("76.00"), 14),
                ("Brass Task Lamp", "A compact lamp with warm dimmable light for focused work.", Decimal("96.00"), 7),
            ],
        }

        created = 0
        for category_name, products in fixtures.items():
            category, _ = Category.objects.get_or_create(
                slug=slugify(category_name),
                defaults={"name": category_name, "description": f"{category_name} essentials for daily routines."},
            )
            for name, description, price, stock in products:
                _, was_created = Product.objects.get_or_create(
                    slug=slugify(name),
                    defaults={
                        "category": category,
                        "name": name,
                        "description": description,
                        "price": price,
                        "stock": stock,
                    },
                )
                created += int(was_created)

        self.stdout.write(self.style.SUCCESS(f"Seeded {created} products."))

