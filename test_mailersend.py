import requests
import json

MAILERSEND_API_KEY = "mlsn.05a31e14a7267a684a685b639938a0afb5463069f360ab35f03b9db07428d314"
MAILERSEND_URL = 'https://api.mailersend.com/v1/email'

payload = {
    "from": {"name": "ValAndAI", "email": "info@valandai.com"},
    "to": [
        {"email": "valerii.babaiev@gmail.com"}
    ],
    "subject": "Test Email from new backend logic",
    "html": "<p>This is a test email with an unsubscribe link: {$unsubscribe_url}</p>",
    "personalization": [
        {
            "email": "valerii.babaiev@gmail.com",
            "data": {
                "unsubscribe_url": "https://valandai.com"
            }
        }
    ]
}

headers = {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "Authorization": f"Bearer {MAILERSEND_API_KEY}"
}

response = requests.post(MAILERSEND_URL, headers=headers, json=payload)
print("Status Code:", response.status_code)
print("Response:", response.text)
