def print_trip_summary(destination, days, budget, travel_style, hotel_cost, food_cost, transport_cost, misc_cost):
    print("=======================")
    print("KelanaAI")
    print("=======================")
    print(f"Destination : {destination}")
    print(f"Days        : {days}")
    print(f"Budget      : {budget}")
    print(f"Style       : {travel_style}")
    
    # Cost Breakdown
    total = hotel_cost + food_cost + transport_cost + misc_cost
    print(f"Total Cost  : {total}")
    
    # Bonus: Budget exceeded alert
    if total > budget:
        print("⚠️ Budget exceeded.")

# Call it with any trip 
# (destination, days, budget, style, hotel, food, transport, misc)
print_trip_summary("Japan", 5, 1500, "Family", 800, 400, 300, 100)
print_trip_summary("Bali", 3, 800, "Backpacker", 200, 150, 100, 50)
