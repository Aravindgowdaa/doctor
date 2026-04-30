#!/usr/bin/env python
import os
import sys


def main():
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
    # Use a safe default port when no explicit host/port is provided.
    if len(sys.argv) == 2 and sys.argv[1] == "runserver":
        sys.argv.append("127.0.0.1:8080")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and available on your "
            "PYTHONPATH environment variable? Did you forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
