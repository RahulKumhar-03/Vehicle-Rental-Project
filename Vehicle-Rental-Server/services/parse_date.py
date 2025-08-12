from datetime import datetime

def parse_date(date_str: str) -> datetime:
    try: 
        dt = datetime.fromisoformat(date_str.replace("Z","+00:00"))
        return dt
    except ValueError as e:
        e