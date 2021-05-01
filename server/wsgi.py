from app import init_app
import os

application = init_app()

if __name__ == "__main__":
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
    application.run()