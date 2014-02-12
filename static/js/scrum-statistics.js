function statistic() {
	return {
		count : {
			total : 0,
			sprint : 0,
			open : 0,
			inProgress : 0,
			resolved : 0,
			bug : 0,
			operating : 0,
			triage : 0
		},
		storyPoint : {
			total : 0,
			open : 0,
			inProgress : 0,
			resolved : 0
		},
		failure : {
			tier : {
				presentation : 0,
				application : 0,
				data : 0
			},
			env : {
				staging : 0,
				production : 0
			}
		},
		time : {
			sprintEstimated : 0,
			sprintLogged : 0,
			totalEstimated : 0,
			totalLogged : 0
		},
		addIssueCount : function(summary) {
			var issueType = summary.type;
			var issueStatus = summary.status;
			var issueName = summary.name;

			this.count.total += 1;
			
			if (summary.isOperationIssue()) {
				this.count.operating += 1;
			} else if (summary.isTriageIssue()){
				this.count.triage += 1;
			} else if (summary.isBugIssue()){
				this.count.bug += 1;
			} else {
				this.count.sprint += 1;
				this.addSprintIssueCount(summary);
			}
		},
		addSprintIssueCount : function(summary) {
			if (summary.isOpen()) {
				this.count.open += 1;
			} else if (summary.isInProgress()) {
				this.count.inProgress += 1;
			} else if (summary.isResolved()) {
				this.count.resolved += 1;
			}
		},
		addStoryPoint : function(summary) {
			var storyPoint = summary.storyPoint;
			if (typeof (storyPoint) == "undefined" || storyPoint == null) {
				return;
			}
			
			this.storyPoint.total += storyPoint;
			
			if (summary.isOpen()) {
				this.storyPoint.open += storyPoint;
			} else if (summary.isInProgress()) {
				this.storyPoint.inProgress += storyPoint;
			} else if (summary.isResolved()) {
				this.storyPoint.resolved += storyPoint;
			}
		},
		addTimeAttr : function(summary) {
			var issueType = summary.type;
			var issueStatus = summary.status;

			if (issueType != "Story") {
				this.time.totalEstimated += summary.estimate;
				this.time.totalLogged += summary.logged;
			}

			if (issueType == "Task" || issueType == "Sub-task") {
				if (!summary.isTriageIssue() && !summary.isOperationIssue()) {
					this.time.sprintEstimated += summary.estimate;
					this.time.sprintLogged += summary.logged;
				}
			}
		},
		addBugType : function(summary) {
			var issueType = summary.type;
			var issueStatus = summary.status;
			var issueName = summary.name;

			var issueLabels = summary.labels;

			if (issueLabels.indexOf("BugStaging") >= 0) {
				this.failure.env.staging += 1;
			}

			if (issueLabels.indexOf("BugProduction") >= 0) {
				this.failure.env.production += 1;
			}

			if (issueLabels.indexOf("BugPresentation") >= 0) {
				this.failure.tier.presentation += 1;
			}

			if (issueLabels.indexOf("BugApplication") >= 0) {
				this.failure.tier.application += 1;
			}

			if (issueLabels.indexOf("BugData") >= 0) {
				this.failure.tier.data += 1;
			}
		}
	}
}