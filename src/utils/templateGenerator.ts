
export const generateAIProductivityAuditTemplate = () => {
  const template = `AI PRODUCTIVITY AUDIT TEMPLATE
==========================================

PERSONAL INFORMATION
--------------------
Name: ________________________
Role: ________________________
Company: _____________________
Date: ________________________

STEP 1: TIME LOG (Complete for 3 consecutive days)
==================================================

DAY 1 - Date: ___________
Time    | Duration | Activity Description              | Category
--------|----------|-----------------------------------|----------
        |          |                                   |
        |          |                                   |
        |          |                                   |
        |          |                                   |
        |          |                                   |

DAY 2 - Date: ___________
Time    | Duration | Activity Description              | Category
--------|----------|-----------------------------------|----------
        |          |                                   |
        |          |                                   |
        |          |                                   |
        |          |                                   |
        |          |                                   |

DAY 3 - Date: ___________
Time    | Duration | Activity Description              | Category
--------|----------|-----------------------------------|----------
        |          |                                   |
        |          |                                   |
        |          |                                   |
        |          |                                   |
        |          |                                   |

STEP 2: TASK CATEGORIZATION
============================

Calculate total time spent in each category:

CREATIVE TASKS (Writing, designing, brainstorming, content creation)
Total Time: _______ hours
Main Activities:
- ________________________________
- ________________________________
- ________________________________

ANALYTICAL TASKS (Data analysis, research, problem-solving, calculations)
Total Time: _______ hours
Main Activities:
- ________________________________
- ________________________________
- ________________________________

ADMINISTRATIVE TASKS (Scheduling, filing, email management, reporting)
Total Time: _______ hours
Main Activities:
- ________________________________
- ________________________________
- ________________________________

COMMUNICATION TASKS (Meetings, calls, presentations, team coordination)
Total Time: _______ hours
Main Activities:
- ________________________________
- ________________________________
- ________________________________

STEP 3: OPPORTUNITY SCORING
===========================

Rate each category on a scale of 1-5:

CREATIVE TASKS
Time Consumption (1=Quick, 5=Time-consuming): ____
Repetitiveness (1=Unique, 5=Highly repetitive): ____
AI Suitability (1=Needs human judgment, 5=Rule-based): ____
TOTAL SCORE (multiply all three): ____

ANALYTICAL TASKS
Time Consumption: ____
Repetitiveness: ____
AI Suitability: ____
TOTAL SCORE: ____

ADMINISTRATIVE TASKS
Time Consumption: ____
Repetitiveness: ____
AI Suitability: ____
TOTAL SCORE: ____

COMMUNICATION TASKS
Time Consumption: ____
Repetitiveness: ____
AI Suitability: ____
TOTAL SCORE: ____

STEP 4: PRIORITY MATRIX
=======================

Rank your categories by total score (highest first):

1. _________________________ (Score: ____)
2. _________________________ (Score: ____)
3. _________________________ (Score: ____)
4. _________________________ (Score: ____)

STEP 5: ACTION PLAN
===================

TOP 3 AI IMPLEMENTATION OPPORTUNITIES:

OPPORTUNITY #1: _________________________
Recommended AI Tools:
- ________________________________
- ________________________________
- ________________________________
Implementation Timeline: Week ____
Success Metric: ________________________________

OPPORTUNITY #2: _________________________
Recommended AI Tools:
- ________________________________
- ________________________________
- ________________________________
Implementation Timeline: Week ____
Success Metric: ________________________________

OPPORTUNITY #3: _________________________
Recommended AI Tools:
- ________________________________
- ________________________________
- ________________________________
Implementation Timeline: Week ____
Success Metric: ________________________________

NOTES & OBSERVATIONS
====================
________________________________
________________________________
________________________________
________________________________

FOLLOW-UP PLAN
==============
30-Day Review Date: ___________
Expected Time Savings: _______ hours/week
Next Steps:
- ________________________________
- ________________________________
- ________________________________
`;

  return template;
};

export const downloadTemplate = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
