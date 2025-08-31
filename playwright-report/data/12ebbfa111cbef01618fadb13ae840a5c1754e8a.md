# Page snapshot

```yaml
- generic [ref=e1]:
  - navigation [ref=e2]:
    - generic [ref=e5]:
      - link "Jira Dashboard" [ref=e6] [cursor=pointer]:
        - /url: /
        - button "Jira Dashboard" [ref=e7] [cursor=pointer]
      - link "Google Sheets Table" [ref=e8] [cursor=pointer]:
        - /url: /google-sheets
        - button "Google Sheets Table" [active] [ref=e9] [cursor=pointer]
  - generic [ref=e14] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e15] [cursor=pointer]:
      - img [ref=e16] [cursor=pointer]
    - generic [ref=e19] [cursor=pointer]:
      - button "Open issues overlay" [ref=e20] [cursor=pointer]:
        - generic [ref=e21] [cursor=pointer]:
          - generic [ref=e22] [cursor=pointer]: "6"
          - generic [ref=e23] [cursor=pointer]: "7"
        - generic [ref=e24] [cursor=pointer]:
          - text: Issue
          - generic [ref=e25] [cursor=pointer]: s
      - button "Collapse issues badge" [ref=e26] [cursor=pointer]:
        - img [ref=e27] [cursor=pointer]
  - alert [ref=e29]
  - generic [ref=e32]:
    - paragraph [ref=e33]: "Error: Failed to fetch"
    - button "Retry" [ref=e34] [cursor=pointer]
```