from bs4 import BeautifulSoup

def parse_movie_data(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    movie_data = {
        'name': soup.find('h1', class_='movie-title').text.strip(),
        'description': soup.find('div', class_='movie-description').text.strip(),
        'poster_url': soup.find('img', class_='movie-poster')['src'],
        'cast': [cast.text.strip() for cast in soup.find_all('div', class_='movie-cast-member')]
        'director': soup.find('div', class_='movie-director').text.strip(),
        'genres': [genre.text.strip() for genre in soup.find_all('span', class_='movie-genre')]
        'duration': soup.find('div', class_='movie-duration').text.strip(),
        'rating': float(soup.find('span', class_='movie-rating').text.strip())
        'release_date': soup.find('div', class_='movie-release-date').text.strip(),
        'trailer_url': soup.find('a', class_='movie-trailer')['href'],
        'imdb_url': soup.find('a', class_='movie-imdb')['href'],
        'rotten_tomatoes_url': soup.find('a', class_='movie-rotten-tomatoes')['href'],
        'metacritic_url': soup.find('a', class_='movie-metacritic')['href'],
        'reviews': [
            {
                'author': review.find('div', class_='review-author').text.strip(),
                'content': review.find('div', class_='review-content').text.strip(),
                'rating': float(review.find('span', class_='review-rating').text.strip())
            }
            for review in soup.find_all('div', class_='movie-review')
        ],
        'similar_movies': [
            {
                'name': movie.find('h2', class_='movie-title').text.strip(),
                'poster_url': movie.find('img', class_='movie-poster')['src'],
                'rating': float(movie.find('span', class_='movie-rating').text.strip())
            }
            for movie in soup.find_all('div', class_='movie-similar')
        ],
        'recommendations': [
            {
                'name': movie.find('h2', class_='movie-title').text.strip(),
                'poster_url': movie.find('img', class_='movie-poster')['src'],
                'rating': float(movie.find('span', class_='movie-rating').text.strip())
            }
            for movie in soup.find_all('div', class_='movie-recommendation')
        ],
        'awards': soup.find('div', class_='movie-awards').text.strip(),
        'box_office': soup.find('div', class_='movie-boxoffice').text.strip(),
        'budget': soup.find('div', class_='movie-budget').text.strip(),
        'company': soup.find('div', class_='movie-company').text.strip(),
        'country': soup.find('div', class_='movie-country').text.strip(),
        'language': soup.find('div', class_='movie-language').text.strip(),
        'tagline': soup.find('div', class_='movie-tagline').text.strip(),
        'website': soup.find('div', class_='movie-website').text.strip(),
        'writers': [writer.text.strip() for writer in soup.find_all('div', class_='movie-writer')],
        'year': int(soup.find('div', class_='movie-year').text.strip())
        'id': 'tt' + soup.find('span', class_='movie-imdb-id').text.strip(),
        'imdb_rating': float(soup.find('span', class_='movie-imdb-rating').text.strip()),
        'imdb_votes': int(soup.find('span', class_='movie-imdb-votes').text.strip().replace(',', '')),
        'metascore': int(soup.find('span', class_='movie-metascore').text.strip()),
        'rotten_tomatoes_rating': int(soup.find('span', class_='movie-rotten-tomatoes-rating').text.strip().replace('%', '')),
        'rotten_tomatoes_reviews': int(soup.find('span', class_='movie-rotten-tomatoes-reviews').text.strip().replace(',', '')),
        'rotten_tomatoes_fresh': int(soup.find('span', class_='movie-rotten-tomatoes-fresh').text.strip().replace('%', '')),
    }
    return movie_data
