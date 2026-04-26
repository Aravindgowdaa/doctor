import os
from pathlib import Path

import cloudinary.uploader
from django.conf import settings
from django.core.files.storage import default_storage
from django.utils.text import slugify


def upload_file(file_obj, folder):
    cloudinary_key = os.getenv("CLOUDINARY_API_KEY") or getattr(settings, "CLOUDINARY_API_KEY", "")
    cloudinary_name = os.getenv("CLOUDINARY_CLOUD_NAME") or getattr(settings, "CLOUDINARY_CLOUD_NAME", "")
    cloudinary_secret = os.getenv("CLOUDINARY_API_SECRET") or getattr(settings, "CLOUDINARY_API_SECRET", "")

    if cloudinary_key and cloudinary_name and cloudinary_secret:
        result = cloudinary.uploader.upload(file_obj, folder=folder, resource_type="auto")
        return result.get("secure_url", "")

    original_name = Path(getattr(file_obj, "name", "upload")).name
    safe_name = slugify(Path(original_name).stem) or "upload"
    extension = Path(original_name).suffix
    storage_path = f"{folder}/{safe_name}{extension}"
    saved_path = default_storage.save(storage_path, file_obj)
    return default_storage.url(saved_path)
