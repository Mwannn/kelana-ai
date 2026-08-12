from services.trip_service import (
    get_trip_category, 
    get_travel_session, 
    calculate_daily_budget, 
    get_recommended_places
)

def main():
    print("==================================")
    print("KelanaAI - Input")
    print("==================================")
    # Tangani I/O
    destination = input("Destination (default: Japan): ") or "Japan"
    
    days_input = input("Days (default: 5): ")
    days = int(days_input) if days_input.strip() else 5
    
    budget_input = input("Budget USD (default: 1500): ")
    budget = float(budget_input) if budget_input.strip() else 1500.0
    
    month = input("Travel Month (default: December): ") or "December"

    category = get_trip_category(budget)
    daily_budget = calculate_daily_budget(budget, days)
    season = get_travel_session(month)
    recommended_places = get_recommended_places(destination)

    print("\n==================================")
    print("KelanaAI")
    print("==================================")
    print(f"Destination     : {destination.capitalize()}")
    print(f"Days        : {days}")
    print(f"Budget       : {int(budget) if budget.is_integer() else budget} USD")
    print(f"Category      : {category}")
    print(f"Daily Budget    : {int(daily_budget) if daily_budget.is_integer() else daily_budget} USD/Day")
    print(f"Travel Month: {month.capitalize()}")
    print(f"Season : {season}\n")

    print("Recommended Places")
    for place in recommended_places:
        print(f"- {place}")

if __name__ == "__main__":
    main()
