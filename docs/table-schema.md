# Table Schema Documentation

This document describes the meaning and purpose of each column in the Google Sheets rawData table.

## Column Descriptions

### Basic Identification Fields

| Column Name | Type | Description |
|---------|------|------|
| **Key** | string | Unique identifier for the issue, typically in format `PROJECT-NUMBER` (e.g., IHAIC-1) |
| **Issue Type** | string | Type of issue such as Epic, Story, Task, Bug, etc. |
| **Projects** | string | Project abbreviation or code |
| **Summary** | string | Title or brief description of the issue |
| **parent** | string | Key of the parent issue, used to establish hierarchical relationships |

### Status and Progress Fields

| Column Name | Type | Description |
|---------|------|------|
| **Status** | string | Current status (e.g., Backlog, To Do, In Progress, Done) |
| **Sprint** | string | Sprint name or number the issue belongs to |
| **Status Category** | string | Status classification, typically To Do, In Progress, or Done |
| **Status Category Changed** | string | Timestamp or record of when status category last changed |

### Priority and Importance Fields

| Column Name | Type | Description |
|---------|------|------|
| **Priority** | string | Priority level (e.g., Highest, High, Medium, Low, Lowest) |
| **Urgency** | string | Urgency level, used to distinguish between items with same priority |

### Estimation and Scoring Fields

| Column Name | Type | Description |
|---------|------|------|
| **T-Size** | number | T-Shirt sizing estimation, possibly numeric (e.g., 1=XS, 2=S, 3=M, 5=L, 8=XL) |
| **Confidence** | number | Confidence level in the estimation, possibly percentage or score |
| **Story Points** | number | Agile story points for effort estimation |
| **BusinessPoints** | number | Business value points to measure feature value |

### Time-Related Fields

| Column Name | Type | Description |
|---------|------|------|
| **Created** | date | Issue creation timestamp |
| **Updated** | date | Last update timestamp |
| **Resolved** | date | Resolution/completion timestamp |
| **Due date** | date | Expected due date |
| **Σ Time Spent** | string | Total time spent, may include units (e.g., 2h, 3d) |

### Classification and Tagging Fields

| Column Name | Type | Description |
|---------|------|------|
| **Clients** | string | Related clients or client groups |
| **TaskTags** | string | Task tags for categorization and search |
| **Project.name** | string | Full project name |

## Data Types

- **string**: Text data
- **number**: Numeric data, may include decimals
- **date**: Date/time format, typically ISO 8601 (YYYY-MM-DD HH:mm:ss)

## Usage Notes

1. **Key field** is the unique identifier for each record and cannot be duplicated
2. **Date fields** will show as null or empty when no value is present
3. **Numeric fields** like Story Points may contain decimals for more precise estimates
4. **Status field** values may vary based on project configuration

## Data Integrity

- Required fields: Key, Issue Type, Projects, Summary, Status, Priority
- Optional fields: All other fields may be empty depending on usage

## Update Frequency

This data table is read via Google Sheets API with a 5-minute cache setting, so data may have up to 5 minutes delay.