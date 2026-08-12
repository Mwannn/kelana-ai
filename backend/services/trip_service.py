def get_trip_category(budget):
    if budget < 1000:
        return "Backpacker"
    elif budget <= 3000:
        return "Standard"
    else:
        return "Luxury"

def get_travel_session(month):
    if month.lower() == "december":
        return "Peak Season"
    elif month.lower() == "june":
        return "Holiday Season"
    else:
        return "Regular Season"

def calculate_daily_budget(budget, days):
    return budget / days

def get_recommended_places(destination):
    if destination.lower() == "japan":
        return ["Tokyo Tower", "Shibuya", "Mount Fuji"]
    elif destination.lower() == "bali":
        return ["Kuta Beach", "Ubud", "Seminyak"]
    else:
        return ["City Center", "Local Museum", "Central Park"]
