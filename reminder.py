import requests

def send_sms(sender: str, msg_content: str, sendtime: int, recipients: list[int]):
    token="rh6b2XSEQOK2YkOLvGdtQoAxrB3yCjjtlhYTU4KCEx1HW8FqaxkBjoiunuZdAtQu"

    payload = {
        "sender": sender,
        "message": msg_content,
        "sendtime": sendtime,
        "encoding": "UCS2",
        "recipients": [
            {"msisdn": recipient_number}
            for recipient_number in recipients
        ],
    }

    resp = requests.post(
        "https://gatewayapi.com/rest/mtsms",
        json=payload,
        auth=(token, ""),
    )
    resp.raise_for_status()
    print(resp.json())
