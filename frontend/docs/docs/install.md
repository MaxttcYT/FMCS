---
sidebar_position: 1
---

# Getting Started

:::warning
FMCS is only tested on Windows, installation on MacOS or Linux might need further modification
:::

## Requirements

- [Python](https://www.python.org/downloads/) (v3.7 or higher)
- [Node.js & NPM](https://nodejs.org/) (v20.0 or higher)
- [Factorio installed via steam](https://store.steampowered.com/app/427520) (Will support binary installation in future)

## Installation

1. Clone or download ``https://github.com/MaxttcYT/FMCS`` to your local machine.
2. Ensure Python is installed and added to your system PATH.
3. Ensure Node.js and NPM are installed and added to your system PATH.

### Backend

 Install Python (backend) dependencies by running:
  
  :::warning
  To run `.\env\Scripts\Activate.ps1`, enable scripts first. Open PowerShell as **Administrator** and run:

  ```powershell
  Set-ExecutionPolicy RemoteSigned
  :::

  ```powershell
  #Create python enviroment
  python -m venv env

  #Activate env (windows only)
  .\env\Scripts\Activate.ps1

  #Install required modules
  pip install -r requirements.txt
  ```

### Frontend

 Install frontend dependencies by running:
  
  ```powershell
  cd frontend
  npm install
  ```

### Configuration

Copy `settings.example.yaml` to settings.yaml

| **Setting**          | **Description**                                              | **Notes**                                                         | **Type**                |
|----------------------|--------------------------------------------------------------|---------------------------------------------------------------------------|-------------------------|
| FACTORIO_PATH        | Path where Factorio’s game files live (folders like `data/`) | [Factorio Wiki page](https://wiki.factorio.com/Application_directory#Locations)    | Path                    |
| FACTORIO_DATA_PATH   | Path where folders like `saves`, `mods`, `config`, etc. are located | [Factorio Wiki page](https://wiki.factorio.com/Application_directory#User_data_directory) | Path                    |
| STARTUP_MODE         | Defines the startup mode                                     |                                                                           | String [BINARY/STEAM]   |

<details>
  <summary>Steam Mode (`STARTUP_MODE = STEAM`)</summary>

  Settings specific to running the game via Steam:

  | **Setting**          | **Description**                   | **Notes**               | **Type**              |
  |----------------------|-----------------------------------|------------------------|----------------------|
  | FACTORIO_STEAM_ID    | Steam ID of Factorio               | Always `427520`        | Integer [SteamID]    |
  | STEAM_PATH           | Path to Steam binary               | Only needed on Windows | Path                 |

</details>

<details>
  <summary>Binary Mode (`STARTUP_MODE = BINARY`)</summary>

  Settings specific to running the game via standalone binary:

  | **Setting**          | **Description**                   | **Notes**               | **Type**              |
  |----------------------|-----------------------------------|------------------------|----------------------|
  | FACTORIO_BINARY_PATH | Path to Factorio binary           | Wherever you extracted the Factorio zip | Path |

</details>

### Copy Factorio Assets

Run the following in FMCS root, to copy assets from Factorio:

  ```powershell
  python graphic_copy.py
  ```

The script will copy all icons from the data, base and core folder to static/factorioAssets
