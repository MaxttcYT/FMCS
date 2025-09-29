# Factorio Mod Editor

A tool to assist with editing and managing Factorio mods.

> ⚠️ **IMPORTANT:** This is only tested on Windows, ussage on MacOS or Linux might need further modification

## Testing your mod

> ⚠️ **VERY IMPORTANT:** Make a backup of your `mods` folder! I **cannot guarantee** that your mods will be restored after playtesting your mod.  
> **Important:** Do **not** close Factorio via the main menu—always close it using the **Stop** button in the editor GUI!

## Requirements

- [Python](https://www.python.org/downloads/) (version 3.7 or higher)
- [Node.js & NPM](https://nodejs.org/) (version v20.0 or higher, lower might work, not tested)
- [Factorio installed via steam](https://store.steampowered.com/app/427520)

## Installation

1. Clone or download this repository to your local machine.
2. Ensure Python is installed and added to your system PATH.
3. Ensure Node.js and NPM are installed and added to your system PATH.

### Python (Backend)

- Install Python (backend) dependencies by running:
  
  ```bash
  #Create env
  python -m venv env

  #Activate env (Works on Windows), you need to run 
  #Set-ExecutionPolicy RemoteSigned
  #first
  
  .\env\Scripts\Activate.ps1

  #Install modules
  pip install -r requirements.txt
  ```

### Webpack with NPM (Frontend)

- Install frontend dependencies by running:
  
  ```bash
  cd frontend
  npm install
  ```

### Factorio Assets

1. Open a terminal or command prompt.
2. Navigate to the project directory.
3. Run the following command:

    ```bash
    python graphic_copy.py
    ```

The script will copy all icons from the data/ base and core folder to static/factorioAssets

## Running

### Backend

- Start Flask Server (backend) by running:
  
  ```bash
  python app.py
  ```

### Frontend

- Start frontend by running:
  
  ```bash
  cd frontend
  npm start
  ```
