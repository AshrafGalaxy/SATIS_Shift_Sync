import urllib.request
import json

payload = {
    "rooms_config": {
        "rooms": [
            {"id": "D201", "type": "Classroom", "capacity": 80, "tags": ["Theory_Room"]},
            {"id": "D205", "type": "Laboratory", "capacity": 30, "tags": ["Computer_Lab"]},
            {"id": "D207", "type": "Laboratory", "capacity": 30, "tags": ["Computer_Lab"]},
            {"id": "D313", "type": "Tutorial_Room", "capacity": 30, "tags": ["Tutorial_Room"]}
        ]
    },
    "college_settings": {
        "days_active": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "time_slots": [8, 9, 10, 11, 12, 13, 14, 15],
        "lunch_slot": 12,
        "custom_rules": []
    },
    "faculty": [
        {
            "id": "F_RNB", "name": "RNB", "email": "rnb@test.com", "shift": [8,9,10,11,12,13,14,15], "blocked_slots": [], "max_load_hrs": 12,
            "workload": [
                {"id": "W1", "type": "Theory", "subject": "DS2009_DMS", "target_groups": ["SY-CSDS-A"], "hours": 3, "consecutive_hours": 1, "required_tags": ["Theory_Room"]},
                {"id": "W2", "type": "Practical", "subject": "DS2009_DMS_LAB", "target_groups": ["SY-CSDS-A-B1"], "hours": 2, "consecutive_hours": 2, "required_tags": ["Computer_Lab"]},
                {"id": "W3", "type": "Practical", "subject": "DS2009_DMS_LAB", "target_groups": ["SY-CSDS-A-B2"], "hours": 2, "consecutive_hours": 2, "required_tags": ["Computer_Lab"]},
                {"id": "W4", "type": "Practical", "subject": "DS2009_DMS_LAB", "target_groups": ["SY-CSDS-A-B3"], "hours": 2, "consecutive_hours": 2, "required_tags": ["Computer_Lab"]},
                {"id": "W5", "type": "Tutorial", "subject": "DS2009_DMS_TUT", "target_groups": ["SY-CSDS-A-B1"], "hours": 1, "consecutive_hours": 1, "required_tags": ["Tutorial_Room"]},
                {"id": "W6", "type": "Tutorial", "subject": "DS2009_DMS_TUT", "target_groups": ["SY-CSDS-A-B2"], "hours": 1, "consecutive_hours": 1, "required_tags": ["Tutorial_Room"]},
                {"id": "W7", "type": "Tutorial", "subject": "DS2009_DMS_TUT", "target_groups": ["SY-CSDS-A-B3"], "hours": 1, "consecutive_hours": 1, "required_tags": ["Tutorial_Room"]}
            ]
        },
        {
            "id": "F_KGT", "name": "KGT", "email": "kgt@test.com", "shift": [8,9,10,11,12,13,14,15], "blocked_slots": [], "max_load_hrs": 9,
            "workload": [
                {"id": "W8", "type": "Theory", "subject": "DS2010_DAA", "target_groups": ["SY-CSDS-A"], "hours": 3, "consecutive_hours": 1, "required_tags": ["Theory_Room"]},
                {"id": "W9", "type": "Practical", "subject": "DS2010_DAA_LAB", "target_groups": ["SY-CSDS-A-B1"], "hours": 2, "consecutive_hours": 2, "required_tags": ["Computer_Lab"]},
                {"id": "W10", "type": "Practical", "subject": "DS2010_DAA_LAB", "target_groups": ["SY-CSDS-A-B2"], "hours": 2, "consecutive_hours": 2, "required_tags": ["Computer_Lab"]},
                {"id": "W11", "type": "Practical", "subject": "DS2010_DAA_LAB", "target_groups": ["SY-CSDS-A-B3"], "hours": 2, "consecutive_hours": 2, "required_tags": ["Computer_Lab"]}
            ]
        },
        {
            "id": "F_PSS", "name": "PSS", "email": "pss@test.com", "shift": [8,9,10,11,12,13,14,15], "blocked_slots": [], "max_load_hrs": 9,
            "workload": [
                {"id": "W12", "type": "Theory", "subject": "DS2011_SPOS", "target_groups": ["SY-CSDS-A"], "hours": 3, "consecutive_hours": 1, "required_tags": ["Theory_Room"]},
                {"id": "W13", "type": "Practical", "subject": "DS2011_SPOS_LAB", "target_groups": ["SY-CSDS-A-B1"], "hours": 2, "consecutive_hours": 2, "required_tags": ["Computer_Lab"]},
                {"id": "W14", "type": "Practical", "subject": "DS2011_SPOS_LAB", "target_groups": ["SY-CSDS-A-B2"], "hours": 2, "consecutive_hours": 2, "required_tags": ["Computer_Lab"]},
                {"id": "W15", "type": "Practical", "subject": "DS2011_SPOS_LAB", "target_groups": ["SY-CSDS-A-B3"], "hours": 2, "consecutive_hours": 2, "required_tags": ["Computer_Lab"]}
            ]
        },
        {
            "id": "F_RAM", "name": "RAM", "email": "ram@test.com", "shift": [8,9,10,11,12,13,14,15], "blocked_slots": [], "max_load_hrs": 9,
            "workload": [
                {"id": "W16", "type": "Theory", "subject": "DS2012_ML", "target_groups": ["SY-CSDS-A"], "hours": 3, "consecutive_hours": 1, "required_tags": ["Theory_Room"]},
                {"id": "W17", "type": "Practical", "subject": "DS2012_ML_LAB", "target_groups": ["SY-CSDS-A-B1"], "hours": 2, "consecutive_hours": 2, "required_tags": ["Computer_Lab"]},
                {"id": "W18", "type": "Practical", "subject": "DS2012_ML_LAB", "target_groups": ["SY-CSDS-A-B2"], "hours": 2, "consecutive_hours": 2, "required_tags": ["Computer_Lab"]},
                {"id": "W19", "type": "Practical", "subject": "DS2012_ML_LAB", "target_groups": ["SY-CSDS-A-B3"], "hours": 2, "consecutive_hours": 2, "required_tags": ["Computer_Lab"]}
            ]
        },
        {
            "id": "F_NRT", "name": "NRT", "email": "nrt@test.com", "shift": [8,9,10,11,12,13,14,15], "blocked_slots": [], "max_load_hrs": 7,
            "workload": [
                {"id": "W20", "type": "Theory", "subject": "MM0402_PAS", "target_groups": ["SY-CSDS-A"], "hours": 3, "consecutive_hours": 1, "required_tags": ["Theory_Room"]},
                {"id": "W21", "type": "Tutorial", "subject": "DS2013_DT2_TUT", "target_groups": ["SY-CSDS-A-B1"], "hours": 1, "consecutive_hours": 1, "required_tags": ["Tutorial_Room"]},
                {"id": "W22", "type": "Tutorial", "subject": "DS2013_DT2_TUT", "target_groups": ["SY-CSDS-A-B2"], "hours": 1, "consecutive_hours": 1, "required_tags": ["Tutorial_Room"]},
                {"id": "W23", "type": "Tutorial", "subject": "DS2013_DT2_TUT", "target_groups": ["SY-CSDS-A-B3"], "hours": 1, "consecutive_hours": 1, "required_tags": ["Tutorial_Room"]}
            ]
        },
        {
            "id": "F_GGA", "name": "GGA", "email": "gga@test.com", "shift": [8,9,10,11,12,13,14,15], "blocked_slots": [], "max_load_hrs": 2,
            "workload": [
                {"id": "W24", "type": "Theory", "subject": "HS2004_RAAD4", "target_groups": ["SY-CSDS-A"], "hours": 2, "consecutive_hours": 1, "required_tags": ["Theory_Room"]}
            ]
        },
        {
            "id": "F_VRG", "name": "VRG", "email": "vrg@test.com", "shift": [8,9,10,11,12,13,14,15], "blocked_slots": [], "max_load_hrs": 2,
            "workload": [
                {"id": "W25", "type": "Theory", "subject": "HS2003_FCTC2", "target_groups": ["SY-CSDS-A"], "hours": 2, "consecutive_hours": 1, "required_tags": ["Theory_Room"]}
            ]
        }
    ]
}

data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(
    'http://localhost:8000/api/v1/generate',
    data=data,
    headers={'Content-Type': 'application/json'},
    method='POST'
)

try:
    with urllib.request.urlopen(req) as response:
        res_body = response.read().decode('utf-8')
        print("Success:", res_body)
except urllib.error.HTTPError as e:
    res_body = e.read().decode('utf-8')
    try:
        err_json = json.loads(res_body)
        print("HTTP Error", e.code, ":\n", json.dumps(err_json, indent=2))
    except:
        print("HTTP Error", e.code, ":", res_body)
