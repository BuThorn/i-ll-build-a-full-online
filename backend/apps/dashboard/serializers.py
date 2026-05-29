from rest_framework import serializers


class DashboardDailyStatsSerializer(serializers.Serializer):
    date = serializers.DateField()
    orders = serializers.IntegerField()
    revenue = serializers.DecimalField(max_digits=12, decimal_places=2)

    def create(self, validated_data):
        return validated_data

    def update(self, instance, validated_data):
        return instance


class DashboardMonthlyStatsSerializer(serializers.Serializer):
    month = serializers.CharField()
    orders = serializers.IntegerField()
    revenue = serializers.DecimalField(max_digits=12, decimal_places=2)

    def create(self, validated_data):
        return validated_data

    def update(self, instance, validated_data):
        return instance


class DashboardStatsSerializer(serializers.Serializer):
    users = serializers.IntegerField()
    products = serializers.IntegerField()
    orders = serializers.IntegerField()
    total_sales = serializers.DecimalField(max_digits=14, decimal_places=2)
    daily = DashboardDailyStatsSerializer(many=True)
    monthly = DashboardMonthlyStatsSerializer(many=True)

    def create(self, validated_data):
        return validated_data

    def update(self, instance, validated_data):
        return instance
