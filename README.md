ScrumReport
===========

ScrumReport는 사내 Jira 시스템의 Agile 기능과 연동하여 스크럼 스프린트의 진행 상태 및 통계 정보를 한 화면에서 제공한다.

# 사용 방법
1. 프로젝트를 'clone' 한다. (참고. Github Fork A Repository: http://help.github.com/articles/fork-a-repo) 
2. ScrumReport/static/index.html 파일을 브라우져에서 연다. 이 때 사용하는 브라우져는 사파리를 권장한다. 현재 개발 내용에 'Cross Domain'문제가 있고 이를 회피하기 위해 사파리에서는 간단히 '개발자용' > '로컬 파일 제한사항 비활성화' 기능을 사용할 수 있기 때문이다.
3. 화면 상단에 해당 스프린트명을 입력하고 Submit 버튼을 누르면 자동으로 통계 정보가 완성된다.

# 제약 사항
ScrumReport에서 통계 데이터를 산출하기 위해서는 몇 가지 사용 제약 사항이 필요하다.

1. 스토리는 스토리포인트만 입력하고 평가시간(Estimated Time), 실행시간(Logged Time)등의 정보를 기록하지 않는다.
2. 스토리의 assignee는 별도로 두지 않거나 화면 기획자가 assinee로 지정할 수 있다.
3. 스토리의 처리는 'Sub-task'를 생성해서 처리한다.
4. Task, Sub-task, Bug 등은 이슈를 처리하는 주의 담당자가 assinee가 되고, QA 작업이 요청된다 하더라고 assignee를 변경하지 않는다.
5. Task, Sub-task, Bug 등은 반드시 처리 시간을 기재한다. 처리 시간이 매우 짧은 경우 기록을 생략할 수 있다.
6. Task, Bug 등은 트리아지(서비스 운영자)가 처리할 수 있으며 스프린트에 포함된 이슈와 구분하기 위해 '[Triage]'를 해당 이슈 제목의 처음에 표기한다.
7. 이전 스프린트에서 Bug로 분류됐던 이슈가 처리되지 못하고 다음 스프린트의 Task로 처리되어야 하는 경우 '[Bug]'를 해당 이슈 제목의 처음에 표기한다.
8. 버그 관련 통계 정보를 생성하기 위해서는 이슈 처리 시점에 다음 라벨 중 복수 개를 사용하여 표기한다.
  * BugStaging
  * BugProduction
  * BugPresentation
  * BugApplication
  * BugData
  * NotaBug
  * NoFunction
  * FaultMigration
  * FaultOperation