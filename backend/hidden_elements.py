from bs4 import BeautifulSoup

def is_hidden(element):
    style = element.get("style", "").replace(" ", "").lower()

    if "display:none" in style:
        return True
    if "visibility:hidden" in style:
        return True
    if element.has_attr("hidden"):
        return True

    return False


def detect_and_redact_hidden_elements(html):
    """Input: raw HTML string
    Output:
    - redacted_html (str)
    - hidden_elements_removed (int)
    """

    soup = BeautifulSoup(html, "html.parser")
    removed_count = 0

    for element in soup.find_all(True):
        if is_hidden(element):
            element.decompose()
            removed_count += 1

    redacted_html = str(soup)
    return redacted_html, removed_count


if __name__ == "__main__":
    sample_html = """
    <html>
        <body>
            <p>Hello World</p>
            <div style="display:none">Hidden Text</div>
            <span hidden>Secret</span>
        </body>
    </html>
    """

    redacted_html, removed_count = detect_and_redact_hidden_elements(sample_html)

    print("Removed:", removed_count)
    print(redacted_html)
