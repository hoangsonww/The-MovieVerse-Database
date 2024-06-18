from datetime import datetime, timedelta
from apscheduler.schedulers.background import BackgroundScheduler
from tasks import crawl_movie_data_and_store

scheduler = BackgroundScheduler()


def start_scheduler():
    scheduler.add_job(crawl_movie_data_and_store, 'interval', hours=24, args=['http://example.com/movies'])
    scheduler.start()
