import os

# Define the folder structure and files
structure = {
    "backend": {
        "forum": {
            "__init__.py": "",
            "models": {
                "__init__.py": "",
                "meta.py": "",
                "user.py": ""
            },
            "schemas": {
                "__init__.py": "",
                "user.py": ""
            },
            "views": {
                "__init__.py": "",
                "user.py": ""
            },
            "static": {
                "test_signup.html": ""
            },
            "security.py": "",
            "routes.py": ""
        },
        "tests": {
            "__init__.py": "",
            "test_user.py": ""
        },
        "alembic.ini": "",
        "setup.py": "",
        "development.ini": "",
        "production.ini": "",
        "README.md": ""
    }
}

def create_structure(base_path, struct):
    for name, content in struct.items():
        path = os.path.join(base_path, name)
        if isinstance(content, dict):
            # It's a directory
            os.makedirs(path, exist_ok=True)
            create_structure(path, content)
        else:
            # It's a file
            with open(path, "w", encoding="utf-8") as f:
                f.write(content)

# Create the structure in current directory (or specify your path)
create_structure(".", structure)
print("Folder and file structure created successfully.")