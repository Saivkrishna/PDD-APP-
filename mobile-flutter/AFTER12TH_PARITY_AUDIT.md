# CAREERPATH AI — AFTER 12TH WEB-TO-FLUTTER PARITY AUDIT & MATRIX

This audit documents exact feature, data, component, endpoint, and section parity between the **React Web application (source of truth)** and the **Flutter mobile application**.

---

## 1. Feature Architecture Comparison

| WEB FEATURE | WEB COMPONENT | WEB DATA SOURCE | BACKEND ENDPOINT | FLUTTER SCREEN | FLUTTER API | FLUTTER DATA SOURCE | STATUS |
|---|---|---|---|---|---|---|---|
| **Streams List** | `After12thPage` (Streams Tab) | `data.js` (`after12th`) | `GET /api/after12th/streams` | `After12thPage` | `ApiService.getAfter12thStreams()` | `CareerDataRepository.after12thStreams` | **PASS** |
| **Sectors List** | `After12thPage` (`view === 'sectors'`) | `data.js` (`after12th[stream].sectors`) | `GET /api/after12th/sectors/:stream` | `After12thPage` | `ApiService.getAfter12thSectors()` | `CareerDataRepository.after12thSectorsMap` | **PASS** |
| **Departments List** | `After12thPage` (`view === 'departments'`) | `sector.departments` | `GET /api/after12th/sector/:stream/:sectorId` | `After12thSectorDetailPage` | API / Local | `CareerDataRepository.after12thSectorsMap` | **PASS** |
| **Department / Course Details** | `DeptDetail` | `deptDetails.courseDetails` | `GET /api/after12th/department/:deptId` | `After12thDeptDetailScreen` | Local / API | `CareerDataRepository` | **FIXED (PARITY IMPLEMENTED)** |
| **Course Roadmap** | `RoadmapTimeline` in `DeptDetail` | Derived from `courseDetails` | Dynamic | `_buildDeptRoadmapTimeline` in `After12thDeptDetailScreen` | N/A | Dynamic | **FIXED (PARITY IMPLEMENTED)** |
| **Direct Jobs List** | `After12thPage` (Jobs Tab) | `App.js` (`JOBS_12`) | `GET /api/after12th/jobs` | `After12thPage` (Jobs Tab) | `ApiService.getAfter12thJobs()` | `CareerDataRepository.after12thJobs` | **FIXED (PARITY IMPLEMENTED)** |
| **Job Details** | `Job12thDetail` | `selectedJob` | API / Local | `After12thJobDetailScreen` | Local / API | `CareerDataRepository.after12thJobs` | **FIXED (PARITY IMPLEMENTED)** |
| **Job Roadmap** | `RoadmapTimeline` in `Job12thDetail` | Derived from `job` | Dynamic | `_buildJobRoadmapTimeline` in `After12thJobDetailScreen` | N/A | Dynamic | **FIXED (PARITY IMPLEMENTED)** |

---

## 2. Field-Level Parity Audit

### Education (Department / Course Details):

| COURSE FIELD | WEB SOURCE (`frontend/src/App.js` `DeptDetail`) | FLUTTER IMPLEMENTATION | STATUS |
|---|---|---|---|
| **Title & Icon** | `deptDetails.title`, `icon` | `dept['title']`, `dept['icon']` | **PASS** |
| **Full Form** | `deptDetails.courseDetails.fullForm` | `courseDetails['fullForm']` | **FIXED** |
| **Duration** | `deptDetails.courseDetails.duration` | `courseDetails['duration']` | **PASS** |
| **Eligibility** | `deptDetails.courseDetails.eligibility` | `courseDetails['eligibility']` | **PASS** |
| **Entrance Exams** | `deptDetails.courseDetails.entranceExams` | `courseDetails['entranceExams']` | **PASS** |
| **5-Step Roadmap** | `RoadmapTimeline` (5 steps) | `_buildDeptRoadmapTimeline` (5 steps) | **FIXED** |
| **Core Subjects** | `deptDetails.courseDetails.subjects` | `courseDetails['subjects']` | **FIXED** |
| **Key Skills** | `deptDetails.courseDetails.skills` | `courseDetails['skills']` | **FIXED** |
| **Tools to Learn** | `deptDetails.courseDetails.tools` | `courseDetails['tools']` | **FIXED** |
| **Higher Studies** | `deptDetails.courseDetails.higherStudies` | `courseDetails['higherStudies']` | **FIXED** |
| **Certifications** | `deptDetails.courseDetails.certifications` | `courseDetails['certifications']` | **FIXED** |
| **Future Scope** | `deptDetails.courseDetails.futureScope` | `courseDetails['futureScope']` | **FIXED** |
| **Best Locations** | `deptDetails.courseDetails.locations` | `courseDetails['locations']` | **FIXED** |

### Jobs:

| JOB FIELD | WEB SOURCE (`frontend/src/App.js` `JOBS_12`) | FLUTTER IMPLEMENTATION | STATUS |
|---|---|---|---|
| **Title & Icon** | `job.title`, `job.icon` | `job['title']`, `job['icon']` | **PASS** |
| **Category** | `job.category` (`IT`, `Non-IT`, `Government`) | `job['category']` | **PASS** |
| **Salary** | `job.salary` | `job['salary']` | **PASS** |
| **Description** | `job.description` | `job['description']` | **PASS** |
| **How to Become** | `job.howToBecome` | `job['howToBecome']` | **PASS** |
| **5-Step Roadmap** | `RoadmapTimeline` (5 steps) | `_buildJobRoadmapTimeline` (5 steps) | **FIXED** |
| **Skills Needed** | `job.skills` | `job['skills']` | **PASS** |
| **Where to Work** | `job.workplaces` | `job['workplaces']` | **PASS** |
