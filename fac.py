import subprocess
import time
import psutil
import src.config as settings

app_id = "427520"  # Factorio
steam_path = settings.getSetting("STEAM_PATH")

if not steam_path:
    raise ValueError("Steam is not installed or not in the expected path.")

# Starte das Spiel via Steam
print("Starte Factorio über Steam...")
subprocess.run([steam_path, "-applaunch", app_id])

def is_factorio_running():
    for proc in psutil.process_iter(['name']):
        if proc.info['name'] and 'factorio' in proc.info['name'].lower():
            return True
    return False

# Warten, bis das Spiel läuft
print("Warte auf Spielstart...")
while not is_factorio_running():
    time.sleep(2)

print("Factorio läuft!")

# Warten, bis das Spiel wieder geschlossen ist
while is_factorio_running():
    time.sleep(2)

print("aaahahaha")
