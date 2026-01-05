from crawler.exceptions import DataValidationError


def _ensure_list(value, field: str) -> None:
    if value is None:
        return
    if not isinstance(value, list):
        raise DataValidationError(f"Expected list for {field}")


def validate_movie_data(data):
    if not data.get("name"):
        raise DataValidationError("Missing movie name")
    if not data.get("description"):
        raise DataValidationError("Missing movie description")

    rating = data.get("rating")
    if rating is not None and not (0 <= rating <= 10):
        raise DataValidationError("Rating out of range")

    _ensure_list(data.get("cast"), "cast")
    _ensure_list(data.get("genres"), "genres")
    _ensure_list(data.get("reviews"), "reviews")
