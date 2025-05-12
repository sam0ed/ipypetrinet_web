from flask import Flask, render_template
import os

# Determine the absolute path to the directory where this script is located
# This is important for Flask to correctly find the 'templates' and 'static' folders
# when the script is run from a different working directory.
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__, template_folder=os.path.join(BASE_DIR, 'templates'))

# Import necessary modules for the API endpoint
from flask import request, jsonify


@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    # Make sure to run with debug=True only during development
    app.run(debug=True)
