def get_icd10_code(diagnosis):
    # Mock function: In real application, integrate with an API
    codes = {
        "Common Cold": "J00",
        "Flu": "J10",
        "Hypertension": "I10",
    }
    return codes.get(diagnosis, "Unknown")
