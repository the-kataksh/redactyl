def explain_risk(hidden_count, encoded_count):
    risks = []

    if hidden_count > 0:
        risks.append("Hidden DOM elements")

    if encoded_count > 0:
        risks.append("Encoded payloads")

    explanation = (
        "These elements may influence AI agents consuming raw DOM. "
        "Redactyl removed them to produce AI-safe HTML."
        if risks else
        "No AI-relevant DOM manipulation patterns detected."
    )

    return risks, explanation
