import subprocess
import os

script_dir = os.path.dirname(os.path.abspath(__file__))

def format_lua(lua_code: str) -> str:
    """Formats Lua code using stylua."""
    process = subprocess.Popen(
        [os.path.join(script_dir, "stylua.exe"), "--indent-type", "Spaces", "--indent-width", "4", "-"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    stdout, stderr = process.communicate(lua_code)
    if process.returncode != 0:
        raise RuntimeError(f"Stylua error: {stderr}")
    return stdout.strip()
