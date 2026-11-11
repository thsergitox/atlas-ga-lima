"""Matrices académicas de Lima; ninguna cifra es una tarifa ni tiempo real."""
import math


def haversine(a, b):
    lat1, lat2 = math.radians(a['lat']), math.radians(b['lat'])
    dlat = lat2 - lat1
    dlon = math.radians(b['lon'] - a['lon'])
    h = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    return 6371 * 2 * math.asin(min(1, math.sqrt(h)))


def matrices(places):
    distance, time, cost = [], [], []
    for origin in places:
        drow, trow, crow = [], [], []
        for destination in places:
            d = haversine(origin, destination)
            drow.append(d)
            trow.append(60 * d / 4.5 if d <= 1 else 4 + 60 * d / 18)
            crow.append(0 if d <= 1 else max(8, 4 + 2.5 * d))
        distance.append(drow)
        time.append(trow)
        cost.append(crow)
    return {'distance': distance, 'time': time, 'cost': cost}


def evaluate(route, data, budget):
    totals = {}
    for metric, matrix in data.items():
        total = 0
        for i in range(len(route) - 1):
            total += matrix[route[i] - 1][route[i + 1] - 1]
        totals[metric] = total
    maximum_distance = max(max(row) for row in data['distance'])
    maximum_time = max(max(row) for row in data['time'])
    denominator = totals['distance'] / maximum_distance + totals['time'] / maximum_time
    totals['fitness'] = ((budget - totals['cost']) / budget) / denominator
    return totals
