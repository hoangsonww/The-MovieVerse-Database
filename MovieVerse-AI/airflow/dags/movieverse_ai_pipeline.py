from datetime import datetime, timedelta

from airflow import DAG
from airflow.operators.bash import BashOperator

DEFAULT_ARGS = {
    "owner": "movieverse-ai",
    "depends_on_past": False,
    "retries": 1,
    "retry_delay": timedelta(minutes=10),
}

with DAG(
    dag_id="movieverse_ai_pipeline",
    default_args=DEFAULT_ARGS,
    description="MovieVerse AI training and feature materialization",
    schedule_interval="0 2 * * *",
    start_date=datetime(2024, 1, 1),
    catchup=False,
    max_active_runs=1,
) as dag:
    train_recommender = BashOperator(
        task_id="train_recommender",
        bash_command="python -m movieverse_ai.pipelines.train_recommender",
    )

    train_sentiment = BashOperator(
        task_id="train_sentiment",
        bash_command="python -m movieverse_ai.pipelines.train_sentiment",
    )

    train_ranker = BashOperator(
        task_id="train_ranker",
        bash_command="python -m movieverse_ai.pipelines.train_ranker",
    )

    build_ranking_features = BashOperator(
        task_id="build_ranking_features",
        bash_command="python -m movieverse_ai.pipelines.build_ranking_features",
    )

    build_embeddings = BashOperator(
        task_id="build_embeddings",
        bash_command="python -m movieverse_ai.pipelines.build_embeddings",
    )

    materialize_features = BashOperator(
        task_id="materialize_features",
        bash_command="python -m movieverse_ai.pipelines.materialize_features",
    )

    build_feature_tables = BashOperator(
        task_id="build_feature_tables",
        bash_command="python -m movieverse_ai.pipelines.build_feature_tables",
    )

    (train_recommender, train_sentiment) >> build_embeddings
    build_ranking_features >> train_ranker
    (build_embeddings, train_ranker) >> build_feature_tables >> materialize_features
