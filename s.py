citys = {}

n = int(input("количество записей: "))

for i in range(n):
    line = input().split()
    if not line:
        continue
    
    country = line[0]
    cities = line[1:]
    
    for city in cities:
        if city not in citys:
            citys[city] = []
        if country not in citys[city]:
            citys[city].append(country)

target_city = input().strip()

if target_city in citys:
    countries_list = citys[target_city]
    print(", ".join(countries_list))
else:
    print("Not found")
    
