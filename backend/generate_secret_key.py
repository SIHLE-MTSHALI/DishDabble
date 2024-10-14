import secrets
import string

def generate_secret_key(length=50):
    """Generate a secure random string of letters, digits, and symbols."""
    alphabet = string.ascii_letters + string.digits + string.punctuation
    secret_key = ''.join(secrets.choice(alphabet) for _ in range(length))
    return secret_key

if __name__ == "__main__":
    secret_key = generate_secret_key()
    print("Generated Secret Key:")
    print(secret_key)
    print("\nYou can use this key for your application's SECRET_KEY setting.")
    print("Make sure to keep it secret and never share it publicly!")
