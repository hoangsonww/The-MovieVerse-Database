def clean_text(text):
    return ' '.join(text.split())

def parse_movie_data(html_content):
    movie = {}
    soup = BeautifulSoup(html_content, 'html.parser')
    movie['name'] = soup.find('h1', class_='movie-title').text.strip()
    movie['description'] = soup.find('div', class_='movie-description').text.strip()
    movie['poster_url'] = soup.find('img', class_='movie-poster')['src']
    movie['cast'] = [cast.text.strip() for cast in soup.find_all('div', class_='movie-cast-member')]
    movie['director'] = soup.find('div', class_='movie-director').text.strip()
    movie['genres'] = [genre.text.strip() for genre in soup.find_all('span', class_='movie-genre')]
    movie['duration'] = soup.find('div', class_='movie-duration').text.strip()
    movie['rating'] = float(soup.find('span', class_='movie-rating').text.strip())
    movie['release_date'] = soup.find('div', class_='movie-release-date').text.strip()
    movie['trailer_url'] = soup.find('a', class_='movie-trailer')['href']
    movie['imdb_url'] = soup.find('a', class_='movie-imdb')['href']
    movie['rotten_tomatoes_url'] = soup.find('a', class_='movie-rotten-tomatoes')['href']
    movie['metacritic_url'] = soup.find('a', class_='movie-metacritic')['href']
    movie['reviews'] = [
        {
            'author': review.find('div', class_='review-author').text.strip(),
            'content': review.find('div', class_='review-content').text.strip(),
            'rating': float(review.find('span', class_='review-rating').text.strip())
        }
        for review in soup.find_all('div', class_='movie-review')
    ]
    movie['similar_movies'] = [
        {
            'name': movie.find('h2', class_='movie-title').text.strip(),
            'poster_url': movie.find('img', class_='movie-poster')['src'],
            'rating': float(movie.find('span', class_='movie-rating').text.strip())
        }
        for movie in soup.find_all('div', class_='movie-similar')
    ]
    movie['recommendations'] = [
        {
            'name': movie.find('h2', class_='movie-title').text.strip(),
            'poster_url': movie.find('img', class_='movie-poster')['src'],
            'rating': float(movie.find('span', class_='movie-rating').text.strip())
        }
        for movie in soup.find_all('div', class_='movie-recommendation')
    ]
    movie['awards'] = soup.find('div', class_='movie-awards').text.strip()
    movie['box_office'] = soup.find('div', class_='movie-box_office').text.strip()
    movie['budget'] = soup.find('div', class_='movie-budget').text.strip()
    movie['company'] = soup.find('div', class_='movie-company').text.strip()
    movie['country'] = soup.find('div', class_='movie-country').text.strip()
    movie['language'] = soup.find('div', class_='movie-language').text.strip()
    movie['tagline'] = soup.find('div', class_='movie-tagline').text.strip()
    movie['website'] = soup.find('div', class_='movie-website').text.strip()
    movie['writers'] = [writer.text.strip() for writer in soup.find_all('div', class_='movie-writer')]
    movie['year'] = int(soup.find('div', class_='movie-year').text.strip())
    movie['id'] = 'tt' + soup.find('span', class_='movie-imdb-id').text.strip()
