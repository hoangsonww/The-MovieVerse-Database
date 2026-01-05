from apscheduler.schedulers.background import BackgroundScheduler

from crawler.datasources import seed_jobs
from crawler.tasks import crawl_movie_data_and_store

scheduler = BackgroundScheduler()


def start_scheduler(interval_hours: int = 24):
    jobs = seed_jobs()
    if not jobs:
        return
    for job in jobs:
        scheduler.add_job(
            crawl_movie_data_and_store,
            "interval",
            hours=interval_hours,
            args=[job.url],
            kwargs={"source": job.source, "tags": job.tags, "job_id": job.job_id},
        )
    scheduler.start()
