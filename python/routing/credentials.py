"""Leer la credencial local sin incorporarla a datos ni mensajes."""
import os


def api_key(root):
    value = os.environ.get('ORS_API_KEY', '').strip()
    if value:
        return value
    env = root / '.env'
    if env.is_file():
        for line in env.read_text().splitlines():
            name, separator, value = line.strip().removeprefix('export ').partition('=')
            if separator and name.strip() == 'ORS_API_KEY':
                value = value.strip().strip('\"\'')
                if value:
                    return value
    raise SystemExit('Falta ORS_API_KEY en la configuración local.')
