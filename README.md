# Booking Link Scheduling Feature

## Overview
Build an interview scheduling feature in Next.js where users can view, and book available interview slots. 

You've seen how candidate.fyi offers a single available interview slot now let's build a feature where users can book multiple slots / interviews at once.

## 🎯 Objective
Create a user-friendly interface that allows candidates to:
- Browse available interview schedules
- Book their preferred slots

## 🛠️ Technical Stack
- **Frontend**: Next.js
- **Styling**: Choose from:
  - Tailwind CSS
  - Chakra UI

## 📋 Core Requirements

### 1. Schedule Display
- Fetch and display interview schedules
- Present data in an organized accessible layout
- Allow toggling based on preferred date 


### 3. Booking System
- Implement booking functionality
- Display review page before booking
- Display confirmation page after booking
- Show success/error states

## 🔌 API Specifications

### GET /api/schedules
Returns available interview slots

#### Sample Response
```json
{
  "count": 2,
  "results": {
    "interviewCount": 2,
    "scheduleName": "Interview Superday",
    "interviews": [
      {
        "id": "1",
        "interviewName": "Technical Interview",
        "interviewers": [{"name": "Alice Johnson", "id": "1"}],
        "startTime": "2025-01-22T09:00:00Z",
        "endTime": "2025-01-22T10:00:00Z"
      },
      {
        "id": "2",
        "interviewName": "Behavioral Interview",
        "interviewers": [{"name": "Bob Smith", "id": "2"}],
        "startTime": "2025-01-22T11:00:00Z",
        "endTime": "2025-01-22T12:00:00Z"
      }
    ]
  }
}
```

### POST /api/book
Books a selected interview slot

#### Request Body
```json
[
    {
        "startTime": "2025-01-22T09:00:00Z",
        "interviewId": "1",
        "interviewers": [{"id": "1"}],
    }
]
```

#### Response
```json
{
  "success": true,
  "message": "Booking confirmed."
}
```

## 📝 Implementation Tasks

### 1. API Route Setup
- Create `/pages/api/schedules.js`
- Implement mock data generation using Faker.js

### 2. Frontend Development
- Implement data fetching to fetch schedules from `/api/schedules`
- Create responsive UI components
- Format timestamps for readability and allow timezone selection

### 3. Interaction Features
- Add booking confirmation flow
    - Are there any edge cases to consider?
- Allow for me to be able to refresh the page without losing my selection
- Allow for me to be able to go back from the review page to the selection screen with my selection still there
- Handle API responses
    - Are there any edge cases to consider?

### 4. Optional Enhancements
- Add comprehensive styling
- Make it your own and have fun with it!


## 📦 Submission Requirements

### Repository Contents
- Complete source code
- Comprehensive README
- Test files (if implemented)

### Documentation Should Include
- Setup instructions
- Design decisions
- Technical trade-offs
- Assumptions made

## ⏱️ Time Constraint
- Recommended time: 2-4 hours
- Focus on core functionality over completeness

## 🎯 Evaluation Criteria

| Criterion | Description |
|-----------|-------------|
| Functionality | Meets all core requirements |
| Code Quality | Clean, maintainable, well-structured |
| UX Design | Intuitive and user-friendly |
| Documentation | Clear and comprehensive |

## 💡 Notes
This is a practical exercise designed to evaluate real-world development skills. Focus on writing clean, maintainable code with clear documentation. Comments explaining your approach are encouraged.
