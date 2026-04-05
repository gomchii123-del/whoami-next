import urllib.request
import json

url = 'http://localhost:8000/api/v1/analyze'
data = {
    "name": "gomch",
    "birth_year": 1990,
    "birth_month": 5,
    "birth_day": 12,
    "life_path_number": 9,
    "born_essence": 5,
    "question": "연애운?"
}
req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})

try:
    response = urllib.request.urlopen(req)
    print("Response Status:", response.status)
    print("Response Data:", response.read().decode('utf-8'))
except Exception as e:
    print("Error:", e)
