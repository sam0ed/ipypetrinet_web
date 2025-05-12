# ipypetrinet_web Standalone Application

This project provides a standalone web interface for ipypetrinet functionality. It uses Flask as the web framework and JointJS for the frontend visualization.

## Prerequisites

*   Python 3.x
*   Node.js and npm (or yarn)

## Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd ipypetrinet_web
    ```

2.  **Set up the Python backend:**
    *   (Recommended) Create and activate a virtual environment:
        ```bash
        python -m venv venv
        # On Windows
        .\venv\Scripts\activate
        # On macOS/Linux
        source venv/bin/activate
        ```
    *   Install Python dependencies:
        ```bash
        pip install -r requirements.txt
        ```

3.  **Set up the JavaScript frontend:**
    *   Install Node.js dependencies:
        ```bash
        npm install
        ```
    *   Build the frontend assets:
        ```bash
        npm run build
        ```
        *For development, you can use `npm run watch` to automatically rebuild assets when source files change.*

## Running the Application

1.  **Start the Flask server:**
    Make sure your virtual environment is activated if you created one.
    ```bash
    python main.py
    ```

2.  **Access the application:**
    Open your web browser and navigate to `http://127.0.0.1:5000/`.

    You should see the ipypetrinet web interface. 