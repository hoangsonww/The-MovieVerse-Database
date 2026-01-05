import logging

from .service_clients import notify_user

logger = logging.getLogger(__name__)


def send_review_notification(user_id: int, request=None) -> None:
    message = "Thanks for submitting your review!"
    try:
        notify_user({"user_id": user_id, "message": message}, request=request)
    except Exception as exc:
        logger.warning("review_notification_failed", extra={"error": str(exc), "user_id": user_id})
