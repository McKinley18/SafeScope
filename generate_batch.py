import json
data = []
for i in range(100):
    case_id = f"case_{2536 + i:05d}"
    if i < 90:
        data.append({
            "id": case_id,
            "scopeExpected": "mining",
            "agencyExpected": "MSHA",
            "observation": f"Silica dust levels high in section {i}.",
            "primaryHazardFamily": "respiratory",
            "difficulty": "medium"
        })
    else:
        data.append({
            "id": case_id,
            "scopeExpected": "no_match",
            "agencyExpected": "NONE",
            "observation": "Safety gear worn and valid.",
            "primaryHazardFamily": "other",
            "difficulty": "easy",
            "expectedOutcome": {"citationConfidence": "no_match"}
        })

with open("backend/test-data/gemini/batch-enterprise-016A.json", "w") as f:
    json.dump(data, f, indent=2)
