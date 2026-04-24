import cloudinary.uploader


def upload_file(file_obj, folder):
    result = cloudinary.uploader.upload(file_obj, folder=folder, resource_type="auto")
    return result.get("secure_url", "")
