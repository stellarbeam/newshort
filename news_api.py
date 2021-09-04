import requests as http
import urllib

def fetch_news(api_key:str, categories:list):
    
    params = urllib.parse.urlencode({
        'access_key': api_key,
        'categories': ",".join(categories),
        'languages': 'en',
        'countries': 'in'
    })

    url = f'http://api.mediastack.com/v1/news?{params}'

    response = http.get(url)

    return response.json()

