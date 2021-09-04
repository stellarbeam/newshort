import requests
from bs4 import BeautifulSoup

def fetch_news(api_key:str, category:str):

    url = "https://bing-news-search1.p.rapidapi.com/news"

    querystring = {"category":category,"cc":"in","safeSearch":"Off","textFormat":"Raw"}

    headers = {
        'x-bingapis-sdk': "true",
        'x-rapidapi-host': "bing-news-search1.p.rapidapi.com",
        'x-rapidapi-key': api_key
    }

    response = requests.request("GET", url, headers=headers, params=querystring)

    articles = response.json()["value"]

    response_text = ""

    for art in articles:
        art_url = art["url"]

        news_content = get_article_text(art_url)

        response_text += '<p>' + news_content + '</p> \n'


    return response_text

def get_article_text(url:str):

    news_html = requests.get(url).text

    soup = BeautifulSoup(news_html, 'html.parser')
    # print([0].get_text())

    news_content = ""
    elements = soup.find_all('p')
    for e in elements:
        news_content += e.get_text() 
        news_content += " "

    return news_content

