# Traceability Matrix
## ParaBank Demo Application

---

### Document Information
| Field | Value |
|-------|--------|
| **Document ID** | TM-PARABANK-001 |
| **Version** | 1.0 |
| **Date** | August 30, 2025 |
| **Author** | Test Analyst |
| **Reviewed by** | Test Lead |
| **Approved by** | Test Manager |
| **Status** | Active |

### Document Changes
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-08-30 | Test Analyst | Initial traceability for 200 test cases |

---

## 1. What is Traceability Matrix?

### 1.1 Purpose
This document shows the connection between **ParaBank requirements** and **our 200 test cases**. It helps us make sure we test everything important and don't miss anything.

### 1.2 Why We Need It
- ✅ **Check coverage** - make sure all requirements are tested
- ✅ **Find gaps** - see what we might have missed  
- ✅ **Track progress** - know which requirements are tested
- ✅ **Show compliance** - prove we tested what was asked
- ✅ **Impact analysis** - understand effect of requirement changes

### 1.3 How to Read This Matrix
- **Requirement** = what the app should do
- **Test Cases** = tests that check the requirement  
- **Coverage %** = how well we test each requirement
- **Status** = if testing is done, in progress, or not started

---

## 2. Requirements Coverage Summary

### 2.1 Overall Coverage Statistics
| Category | Total Requirements | Test Cases | Coverage % | Status |
|----------|-------------------|------------|------------|--------|
| **Authentication** | 8 requirements | 35 test cases | 100% | ✅ Complete |
| **Registration** | 6 requirements | 25 test cases | 100% | ✅ Complete |
| **Account Management** | 7 requirements | 40 test cases | 100% | ✅ Complete |
| **Transactions** | 8 requirements | 55 test cases | 100% | ✅ Complete |
| **Reports & Search** | 5 requirements | 20 test cases | 100% | ✅ Complete |
| **Security** | 6 requirements | 15 test cases | 90% | 🔄 In Progress |
| **Performance** | 4 requirements | 10 test cases | 85% | 🔄 In Progress |
| **Usability** | 4 requirements | 10 test cases | 80% | 🔄 In Progress |

**TOTAL: 48 requirements → 200 test cases → 96% coverage**

---

## 3. Detailed Requirements to Test Cases Mapping

### 3.1 Authentication Module

| Requirement ID | Requirement Description | Test Cases | Coverage | Priority |
|----------------|------------------------|------------|----------|----------|
| **REQ_AUTH_001** | Users can login with valid username and password | TC_001, TC_002, TC_003 | 100% | Critical |
| **REQ_AUTH_002** | Show error message for wrong login details | TC_004, TC_005, TC_006, TC_007 | 100% | High |
| **REQ_AUTH_003** | Prevent brute force password attacks | TC_008, TC_009, TC_010 | 100% | Critical |
| **REQ_AUTH_004** | Logout users after 30 minutes of no activity | TC_011, TC_012 | 100% | Medium |
| **REQ_AUTH_005** | Logout button ends user session properly | TC_013, TC_014, TC_015 | 100% | High |
| **REQ_AUTH_006** | Stop SQL injection attacks in login form | TC_016, TC_017, TC_018 | 100% | Critical |
| **REQ_AUTH_007** | Protect against XSS attacks in login | TC_019, TC_020 | 100% | Critical |
| **REQ_AUTH_008** | Login form works in different browsers | TC_021, TC_022, TC_023, TC_024 | 100% | High |

**Authentication Total: 8 requirements → 35 test cases**

### 3.2 Registration Module

| Requirement ID | Requirement Description | Test Cases | Coverage | Priority |
|----------------|------------------------|------------|----------|----------|
| **REQ_REG_001** | New users can register with personal information | TC_036, TC_037, TC_038 | 100% | Critical |
| **REQ_REG_002** | All required fields must be filled correctly | TC_039, TC_040, TC_041, TC_042, TC_043 | 100% | High |
| **REQ_REG_003** | Username must be unique in the system | TC_044, TC_045 | 100% | High |
| **REQ_REG_004** | Password must be strong enough | TC_046, TC_047, TC_048 | 100% | Medium |
| **REQ_REG_005** | Phone number format must be valid | TC_049, TC_050, TC_051 | 100% | Low |
| **REQ_REG_006** | Social Security Number format must be correct | TC_052, TC_053, TC_054 | 100% | Medium |

**Registration Total: 6 requirements → 25 test cases**

### 3.3 Account Management Module

| Requirement ID | Requirement Description | Test Cases | Coverage | Priority |
|----------------|------------------------|------------|----------|----------|
| **REQ_ACC_001** | Users can see all their accounts overview | TC_061, TC_062, TC_063, TC_064, TC_065 | 100% | Critical |
| **REQ_ACC_002** | Account balances show correct amounts | TC_066, TC_067, TC_068, TC_069 | 100% | Critical |
| **REQ_ACC_003** | Users can open new checking accounts | TC_076, TC_077, TC_078, TC_079 | 100% | Critical |
| **REQ_ACC_004** | Users can open new savings accounts | TC_080, TC_081, TC_082, TC_083 | 100% | Critical |
| **REQ_ACC_005** | Starting money moves from existing account | TC_084, TC_085, TC_086 | 100% | High |
| **REQ_ACC_006** | Each account gets unique account number | TC_087, TC_088 | 100% | High |
| **REQ_ACC_007** | Users can view detailed account information | TC_091, TC_092, TC_093, TC_094, TC_095 | 100% | High |

**Account Management Total: 7 requirements → 40 test cases**

### 3.4 Transaction Processing Module

| Requirement ID | Requirement Description | Test Cases | Coverage | Priority |
|----------------|------------------------|------------|----------|----------|
| **REQ_TXN_001** | Users can transfer money between their accounts | TC_101, TC_102, TC_103, TC_104, TC_105 | 100% | Critical |
| **REQ_TXN_002** | Cannot transfer more money than available | TC_106, TC_107, TC_108 | 100% | Critical |
| **REQ_TXN_003** | Users can pay bills to registered payees | TC_126, TC_127, TC_128, TC_129 | 100% | High |
| **REQ_TXN_004** | Users can add new people to pay bills to | TC_130, TC_131, TC_132, TC_133 | 100% | High |
| **REQ_TXN_005** | Users can request different types of loans | TC_146, TC_147, TC_148, TC_149 | 100% | Medium |
| **REQ_TXN_006** | All money movements are saved with date/time | TC_115, TC_139, TC_145 | 100% | High |
| **REQ_TXN_007** | Transfer confirmation before processing | TC_116, TC_117 | 100% | High |
| **REQ_TXN_008** | Bill payment confirmation and tracking | TC_134, TC_135, TC_136 | 100% | High |

**Transactions Total: 8 requirements → 55 test cases**

### 3.5 Reports and Search Module

| Requirement ID | Requirement Description | Test Cases | Coverage | Priority |
|----------------|------------------------|------------|----------|----------|
| **REQ_RPT_001** | Users can search for transactions by different ways | TC_156, TC_157, TC_158, TC_159, TC_160 | 100% | Medium |
| **REQ_RPT_002** | Users can see their account activity history | TC_096, TC_097, TC_161, TC_162 | 100% | High |
| **REQ_RPT_003** | Users can create monthly account statements | TC_171, TC_172, TC_173 | 100% | Medium |
| **REQ_RPT_004** | Search works with date ranges | TC_163, TC_164, TC_165 | 100% | Low |
| **REQ_RPT_005** | Users can export and download reports | TC_174, TC_175 | 100% | Low |

**Reports Total: 5 requirements → 20 test cases**

---

## 4. Non-Functional Requirements Coverage

### 4.1 Security Requirements

| Requirement ID | Requirement Description | Test Cases | Coverage | Priority |
|----------------|------------------------|------------|----------|----------|
| **REQ_SEC_001** | Prevent harmful code injection in all forms | TC_016, TC_017, TC_018, TC_052, TC_053 | 90% | Critical |
| **REQ_SEC_002** | Keep user sessions safe and secure | TC_011, TC_012, TC_013, TC_014 | 85% | Critical |
| **REQ_SEC_003** | Protect data when sending over internet | TC_025, TC_026 | 70% | High |
| **REQ_SEC_004** | Check user permissions are working | TC_027, TC_028, TC_029 | 80% | High |
| **REQ_SEC_005** | Stop unauthorized access to user accounts | TC_030, TC_031, TC_032 | 90% | Critical |
| **REQ_SEC_006** | Log all security-related events | TC_033, TC_034, TC_035 | 95% | High |

**Security Total: 6 requirements → 15 test cases → 87% coverage**

### 4.2 Performance Requirements

| Requirement ID | Requirement Description | Test Cases | Coverage | Priority |
|----------------|------------------------|------------|----------|----------|
| **REQ_PERF_001** | Pages load in less than 3 seconds | TC_191, TC_192 | 80% | High |
| **REQ_PERF_002** | Money transfers complete in under 2 seconds | TC_193, TC_194 | 90% | High |
| **REQ_PERF_003** | App works with 100 users at same time | TC_195, TC_196 | 85% | Medium |
| **REQ_PERF_004** | No memory leaks during long sessions | TC_197, TC_198 | 80% | Medium |

**Performance Total: 4 requirements → 10 test cases → 84% coverage**

### 4.3 Usability Requirements

| Requirement ID | Requirement Description | Test Cases | Coverage | Priority |
|----------------|------------------------|------------|----------|----------|
| **REQ_UI_001** | Works properly in Chrome, Firefox, Safari | TC_021, TC_022, TC_023 | 100% | High |
| **REQ_UI_002** | Mobile phones and tablets can use the app | TC_024, TC_199 | 80% | Medium |
| **REQ_UI_003** | Easy for people with disabilities to use | TC_200 | 70% | Medium |
| **REQ_UI_004** | Error messages are clear and helpful | TC_004, TC_005, TC_039, TC_040 | 90% | Medium |

**Usability Total: 4 requirements → 10 test cases → 85% coverage**

---

## 5. Coverage Analysis

### 5.1 Requirements Coverage by Priority

#### 5.1.1 Critical Requirements (Must Test 100%)
| Category | Requirements | Test Cases | Coverage | Status |
|----------|-------------|------------|----------|---------|
| **Login Security** | 4 requirements | 18 test cases | 100% | ✅ Fully covered |
| **Money Operations** | 3 requirements | 25 test cases | 100% | ✅ Fully covered |  
| **Account Access** | 3 requirements | 15 test cases | 100% | ✅ Fully covered |
| **Data Protection** | 2 requirements | 8 test cases | 100% | ✅ Fully covered |

**Critical Total: 12 requirements → 66 test cases → 100% coverage**

#### 5.1.2 High Priority Requirements (Should Test 90%+)
| Category | Requirements | Test Cases | Coverage | Status |
|----------|-------------|------------|----------|---------|
| **Registration** | 4 requirements | 20 test cases | 95% | ✅ Well covered |
| **Account Management** | 4 requirements | 25 test cases | 100% | ✅ Fully covered |
| **Transaction Processing** | 5 requirements | 30 test cases | 90% | ✅ Well covered |
| **Reporting** | 3 requirements | 15 test cases | 85% | 🔄 Good coverage |

**High Priority Total: 16 requirements → 90 test cases → 93% coverage**

#### 5.1.3 Medium/Low Priority (Should Test 70%+)
| Category | Requirements | Test Cases | Coverage | Status |
|----------|-------------|------------|----------|---------|
| **Advanced Features** | 8 requirements | 25 test cases | 80% | ✅ Good coverage |
| **Performance** | 4 requirements | 10 test cases | 75% | 🔄 Acceptable |
| **Browser Support** | 4 requirements | 8 test cases | 70% | 🔄 Acceptable |
| **Mobile Support** | 4 requirements | 1 test case | 60% | ⚠️ Needs more tests |

**Medium/Low Total: 20 requirements → 44 test cases → 71% coverage**

---

## 6. Detailed Requirements to Test Cases Mapping

### 6.1 Authentication Requirements

| Req ID | Requirement | Test Case IDs | Test Names | Coverage |
|--------|-------------|---------------|------------|----------|
| **REQ_AUTH_001** | Valid login works | TC_001, TC_002, TC_003 | Successful login variations | 100% |
| **REQ_AUTH_002** | Invalid login shows error | TC_004, TC_005, TC_006, TC_007 | Wrong credentials scenarios | 100% |
| **REQ_AUTH_003** | Brute force protection | TC_008, TC_009, TC_010 | Multiple failed attempts | 100% |
| **REQ_AUTH_004** | Session timeout | TC_011, TC_012 | Inactive user logout | 100% |
| **REQ_AUTH_005** | Logout functionality | TC_013, TC_014, TC_015 | Proper session termination | 100% |
| **REQ_AUTH_006** | SQL injection prevention | TC_016, TC_017, TC_018 | Malicious code in login | 100% |
| **REQ_AUTH_007** | XSS attack prevention | TC_019, TC_020 | Script injection attempts | 100% |
| **REQ_AUTH_008** | Browser compatibility | TC_021, TC_022, TC_023, TC_024 | Login in different browsers | 100% |

### 6.2 Registration Requirements

| Req ID | Requirement | Test Case IDs | Test Names | Coverage |
|--------|-------------|---------------|------------|----------|
| **REQ_REG_001** | User registration works | TC_036, TC_037, TC_038 | Successful registration | 100% |
| **REQ_REG_002** | Required field validation | TC_039, TC_040, TC_041, TC_042, TC_043 | Empty and invalid fields | 100% |
| **REQ_REG_003** | Username uniqueness | TC_044, TC_045 | Duplicate username handling | 100% |
| **REQ_REG_004** | Password complexity | TC_046, TC_047, TC_048 | Weak password rejection | 100% |
| **REQ_REG_005** | Phone format validation | TC_049, TC_050, TC_051 | Phone number formats | 100% |
| **REQ_REG_006** | SSN format validation | TC_052, TC_053, TC_054 | Social security formats | 100% |

### 6.3 Account Management Requirements

| Req ID | Requirement | Test Case IDs | Test Names | Coverage |
|--------|-------------|---------------|------------|----------|
| **REQ_ACC_001** | Account overview display | TC_061, TC_062, TC_063, TC_064, TC_065 | Show all accounts | 100% |
| **REQ_ACC_002** | Correct balance display | TC_066, TC_067, TC_068, TC_069 | Balance accuracy | 100% |
| **REQ_ACC_003** | Open checking account | TC_076, TC_077, TC_078, TC_079 | Checking account creation | 100% |
| **REQ_ACC_004** | Open savings account | TC_080, TC_081, TC_082, TC_083 | Savings account creation | 100% |
| **REQ_ACC_005** | Initial deposit transfer | TC_084, TC_085, TC_086 | Money movement validation | 100% |
| **REQ_ACC_006** | Unique account numbers | TC_087, TC_088 | Account ID generation | 100% |
| **REQ_ACC_007** | Account details viewing | TC_091, TC_092, TC_093, TC_094, TC_095 | Account information display | 100% |

### 6.4 Transaction Requirements

| Req ID | Requirement | Test Case IDs | Test Names | Coverage |
|--------|-------------|---------------|------------|----------|
| **REQ_TXN_001** | Fund transfers work | TC_101, TC_102, TC_103, TC_104, TC_105 | Money transfer scenarios | 100% |
| **REQ_TXN_002** | Overdraft prevention | TC_106, TC_107, TC_108 | Insufficient funds handling | 100% |
| **REQ_TXN_003** | Bill payment processing | TC_126, TC_127, TC_128, TC_129 | Pay bills functionality | 100% |
| **REQ_TXN_004** | Payee management | TC_130, TC_131, TC_132, TC_133 | Add/edit/delete payees | 100% |
| **REQ_TXN_005** | Loan request system | TC_146, TC_147, TC_148, TC_149 | Loan application process | 100% |
| **REQ_TXN_006** | Transaction logging | TC_115, TC_139, TC_145 | Record all money movements | 100% |
| **REQ_TXN_007** | Transfer confirmation | TC_116, TC_117 | User confirmation process | 100% |
| **REQ_TXN_008** | Payment tracking | TC_134, TC_135, TC_136 | Bill payment status | 100% |

### 6.5 Search and Reports Requirements

| Req ID | Requirement | Test Case IDs | Test Names | Coverage |
|--------|-------------|---------------|------------|----------|
| **REQ_RPT_001** | Transaction search | TC_156, TC_157, TC_158, TC_159, TC_160 | Find transactions | 100% |
| **REQ_RPT_002** | Account activity history | TC_096, TC_097, TC_161, TC_162 | View transaction history | 100% |
| **REQ_RPT_003** | Monthly statements | TC_171, TC_172, TC_173 | Generate reports | 100% |
| **REQ_RPT_004** | Date range search | TC_163, TC_164, TC_165 | Search by dates | 100% |
| **REQ_RPT_005** | Export functionality | TC_174, TC_175 | Download reports | 100% |

---

## 7. Gap Analysis

### 7.1 Coverage Gaps (Areas needing more tests)

#### 7.1.1 Medium Priority Gaps
| Requirement Area | Current Coverage | Target Coverage | Gap | Additional Tests Needed |
|------------------|------------------|-----------------|-----|------------------------|
| **Mobile responsiveness** | 60% | 80% | 20% | 4 more test cases |
| **Accessibility features** | 70% | 90% | 20% | 3 more test cases |
| **Error message consistency** | 75% | 90% | 15% | 2 more test cases |

#### 7.1.2 Low Priority Gaps
| Requirement Area | Current Coverage | Target Coverage | Gap | Action |
|------------------|------------------|-----------------|-----|---------|
| **Help documentation** | 50% | 70% | 20% | Add to future releases |
| **Advanced reporting** | 60% | 80% | 20% | Consider if time allows |
| **International support** | 40% | 60% | 20% | Future enhancement |

### 7.2 Over-Coverage Analysis
Some areas have more tests than minimally needed:

| Requirement Area | Current Tests | Minimum Needed | Extra Tests | Justification |
|------------------|---------------|----------------|-------------|---------------|
| **Login security** | 15 tests | 8 tests | 7 extra | High risk area - extra coverage needed |
| **Money transfers** | 25 tests | 15 tests | 10 extra | Critical business function |
| **Form validation** | 20 tests | 12 tests | 8 extra | User experience important |

---

## 8. Test Coverage Metrics

### 8.1 Requirements Coverage Summary
- **Total Requirements**: 48
- **Requirements with Tests**: 46
- **Requirements Fully Tested**: 42
- **Requirements Partially Tested**: 4
- **Requirements Not Tested**: 2

### 8.2 Coverage by Test Type
| Test Type | Requirements Covered | Test Cases | Coverage % |
|-----------|---------------------|------------|------------|
| **Functional** | 34 requirements | 160 test cases | 92% |
| **Security** | 6 requirements | 15 test cases | 87% |
| **Performance** | 4 requirements | 10 test cases | 84% |
| **Usability** | 4 requirements | 10 test cases | 85% |
| **API** | 8 requirements | 30 test cases | 95% |

### 8.3 Priority-Based Coverage
| Priority | Requirements | Test Cases | Target Coverage | Actual Coverage |
|----------|-------------|------------|-----------------|-----------------|
| **Critical** | 12 requirements | 66 test cases | 100% | ✅ 100% |
| **High** | 16 requirements | 90 test cases | 95% | ✅ 93% |
| **Medium** | 12 requirements | 30 test cases | 85% | ✅ 86% |
| **Low** | 8 requirements | 14 test cases | 70% | ✅ 71% |

---

## 9. Impact Analysis

### 9.1 If Requirements Change
This matrix helps us understand what happens if requirements change:

**Example**: If REQ_TXN_001 (money transfers) changes:
- **Affected Test Cases**: TC_101 through TC_125 (25 tests)
- **Impact**: High - need to update many tests
- **Time to Update**: 2-3 days
- **Priority**: Must update immediately

### 9.2 Uncovered Requirements
**Requirements with no test cases:**
- REQ_HELP_001: Online help system (Low priority)
- REQ_ADMIN_001: Admin panel access (Out of scope)

**Action**: Document as known gaps, consider future testing

---

## 10. Recommendations

### 10.1 Coverage Improvements
1. **Add 4 more mobile tests** to reach 80% mobile coverage
2. **Add 3 accessibility tests** for better compliance
3. **Consider 2 more performance tests** for load scenarios

### 10.2 Maintenance Plan
- **Update matrix monthly** when requirements change
- **Review coverage quarterly** for gaps
- **Add new test cases** when features are added
- **Remove obsolete tests** when features removed

---

**Matrix Approval**

| Role | Name | Signature | Date |
|------|------|-----------|------|
| **Test Analyst** | Test Analyst | _______________ | _________ |
| **Test Lead** | Sarah Johnson | _______________ | _________ |
| **Test Manager** | Test Manager | _______________ | _________ |

---

*This matrix will be updated whenever requirements change or new test cases are added. All changes must be reviewed and approved.*