function scrumReport(issues) {
	return {
		data: issues,
		apply: function() {
			var issues = this.data;
			issues.sort(this.compareIssue);
						
			var stat = new statistic();
			var assigneeStats = {};
			var sprintIssues = "";
			var bugIssues = "";
			var triageIssues = "";

			for ( var i = 0; i < issues.length; i++) {
				var issue = issues[i].fields;
				var issueParentKey = "";
				var issuePriority = issue.priority.name;
				if (isDefined(issue.parent)) {
					issueParentKey = issue.parent.key;
					issuePriority = issue.parent.fields.priority.name;
				}
				
				var url = "http://jira.ktcloudware.com/browse";
				
				var summary = new issueSummary(
						issues[i].key, 
						issueParentKey,
						url + "/" + issues[i].key, 
						issue.summary,
						issue.issuetype.name, 
						issuePriority,
						issue.status.name,
						issue.customfield_11007, 
						issue.timeoriginalestimate,
						issue.aggregatetimespent, 
						issue.assignee, 
						issue.labels,
						issue.created,
						issue.updated);

				if (isDefined(summary.assignee)) {
					var assignStat = assigneeStats[summary.assignee];
					if (assignStat == null) {
						assignStat = {
							assignee : summary.assignee,
							stat : new statistic()
						};
					}
					assignStat.stat.addIssueCount(summary);
					assignStat.stat.addStoryPoint(summary);
					assignStat.stat.addTimeAttr(summary);
					assignStat.stat.addBugType(summary);

					assigneeStats[summary.assignee] = assignStat;
				}

				stat.addIssueCount(summary);
				stat.addStoryPoint(summary);
				stat.addBugType(summary);

				if (summary.isBugIssue()) {
					bugIssues += this.getIssuesTableRow(summary);
				} else if (summary.isTriageIssue() || summary.isOperationIssue()) {
					triageIssues += this.getIssuesTableRow(summary);
				} else {
					sprintIssues += this.getIssuesTableRow(summary);
				}
			}

			$("#issueCountTotal").text(stat.count.total);
			$("#issueCountSprint").text(
					stat.count.sprint
							+ "("
							+ (stat.count.sprint / stat.count.total * 100)
									.toFixed(2) + "%)");
			$("#issueCountOpen").text(stat.count.open);
			$("#issueCountInProgress").text(stat.count.inProgress);
			$("#issueCountResolved").text(stat.count.resolved);
			$("#issueCountBug").text(
					stat.count.bug
							+ "("
							+ (stat.count.bug / stat.count.total * 100)
									.toFixed(2) + "%)");
			$("#issueCountOperating").text(
					stat.count.operating
							+ "("
							+ (stat.count.operating / stat.count.total * 100)
									.toFixed(2) + "%)");
			$("#issueCountTriage").text(
					stat.count.triage
							+ "("
							+ (stat.count.triage / stat.count.total * 100)
									.toFixed(2) + "%)");

			$("#storyPointTotal").text(stat.storyPoint.total);
			$("#storyPointOpen").text(stat.storyPoint.open);
			$("#storyPointInProgress").text(stat.storyPoint.inProgress);
			$("#storyPointResolved").text(stat.storyPoint.resolved);

			$("#failurePresentation").text(stat.failure.tier.presentation);
			$("#failureApplication").text(stat.failure.tier.application);
			$("#failureData").text(stat.failure.tier.data);
			$("#failureStaging").text(stat.failure.env.staging);
			$("#failureProduction").text(stat.failure.env.production);

			var assigneeElements = "";
			for (x in assigneeStats) {
				assigneeElements += this.getAssigneeTableRow(assigneeStats[x]);
			}

			$("#assigneesBody").html(assigneeElements);
			
			$("#sprintIssuesBody").html(sprintIssues);
			$("#bugIssuesBody").html(bugIssues);
			$("#triageIssuesBody").html(triageIssues);

			$("#assigneeFilter").trigger("click");
		},
		compareIssue : function(a, b) {
			var aPriority = getPrioritySequence(a);
			var bPriority = getPrioritySequence(b);
			
			if (aPriority > bPriority)
				return 1;
			if (aPriority < bPriority)
				return -1;
			
			var aIssueType = getTypeSequence(a);
			var bIssueType = getTypeSequence(b);

			if (aIssueType > bIssueType)
				return 1;
			if (aIssueType < bIssueType)
				return -1;

			var aKey = "";
			if (isDefined(a.fields.parent)) {
				aKey = a.fields.parent.key + ":" + a.key;
			} else {
				aKey = a.key;
			}

			var bKey = "";
			if (isDefined(b.fields.parent)) {
				bKey = b.fields.parent.key + ":" + b.key;
			} else {
				bKey = b.key;
			}

			if (aKey > bKey) {
				return 1;
			}
			if (aKey < bKey) {
				return -1;
			}

			return 0;
		},
		getIssueTypeIconHtml : function(issueType) {
			var iconHtml = "";
			
			if (issueType == "Story") {
				iconHtml = "<i class=\"fa fa-book\"></i> ";
			} else if (issueType == "Task") {
				iconHtml = "<i class=\"fa fa-file-text\"></i> ";
			} else if (issueType == "Sub-task") {
				iconHtml = "&nbsp;&nbsp;&nbsp;&nbsp;<i class=\"fa fa-file-text-o\"></i> ";
			} else if (issueType == "Improvement") {
				iconHtml = "<i class=\"fa fa-rocket\"></i> ";
			} else if (issueType == "Bug") {
				iconHtml = "<i class=\"fa fa-bug\"></i> ";
			}
			
			return iconHtml;
		},
		getLastUpdatedIconHtml : function(issueType) {
			return "<i class=\"fa fa-spinner\" style=\"color:red\"></i> ";
		},
		getAssigneeTableRow : function(assigneeStat) {
			var assignee = assigneeStat.assignee;
			var stat = assigneeStat.stat;

			console.log(assigneeStat);

			var retval = "";

			retval += "<tr>";
			retval += "<th>" + assignee + "</th>";
			retval += "<th>" + stat.count.open + " (story:"
					+ stat.storyPoint.open + ")</th>";
			retval += "<th>" + stat.count.inProgress + " (story:"
					+ stat.storyPoint.inProgress + ")</th>";
			retval += "<th>" + stat.count.resolved + " (story:"
					+ stat.storyPoint.resolved + ")</th>";
			retval += "<th>" + stat.count.total + " (story:"
					+ stat.storyPoint.total + ")</th>";

			retval += "<th>" + roundNumber(stat.time.sprintLogged / 3600, 2)
					+ " / " + roundNumber(stat.time.sprintEstimated / 3600, 2)
					+ "</th>";
			retval += "<th>" + roundNumber(stat.time.totalLogged / 3600, 2)
					+ " / " + roundNumber(stat.time.totalEstimated / 3600, 2)
					+ "</th>";

			var totalFailure = stat.failure.env.staging
					+ stat.failure.env.production;
			retval += "<th>" + totalFailure + " (" + stat.failure.env.staging
					+ " / " + stat.failure.env.production + ")</th>";
			retval += "</tr>";

			return retval;
		},
		getIssuesTableRow : function(issue) {
			var retval = "";
			
			var rowColor = "";
			if (issue.priority == "Immediate") {
				rowColor += "error";
			} else if (issue.priority == "High") {
				rowColor += "warning";
			} else if (issue.priority == "Normal") {
				rowColor += "";
			} else if (issue.priority == "Low") {
				rowColor += "info";
			}

			// Issue#
			retval += "<tr id=\"" + issue.key + "\" data-parent-id=\""+ issue.parentKey + "\" data-issue-type=\""+ issue.type + "\" class=\"" + rowColor +"\">";
			retval += "<th>" + this.getIssueTypeIconHtml(issue.type) + "<a target=\"blank\" href=\"" + issue.url + "\">" + issue.key + "</a></th>";
			
			// Title#
			retval += "<th style=\"white-space:nowrap; text-overflow:ellipsis\">" + (issue.isLastUpdated() ? this.getLastUpdatedIconHtml() : "") +  issue.name + "</th>";
			
			if (issue.status == "Open" || issue.status == "Reopened") {
				retval += "<th>" + issue.assignee + "</th><th></th><th></th>";
			} else if (issue.status == "In Progress") {
				retval += "<th></th><th>" + issue.assignee + "</th><th></th>";
			} else if (issue.status == "Resolved" || issue.status == "Closed") {
				retval += "<th></th><th></th><th>" + issue.assignee + "</th>\n";
			}

			// Story Point
			var loggedTime = roundNumber(issue.logged / 3600, 2);
			var loggedStoryPoint = roundNumber(loggedTime / 5, 1);
			var estimatedTime = roundNumber(issue.estimate / 3600, 2);
			if (issue.type == "Story"
					|| (issue.type == "Task"
							&& issue.name.indexOf("[Triage]") != 0 && issue.name
							.indexOf("[�]") != 0)) {
				if (issue.storyPoint >= loggedStoryPoint) {
					retval += "<th>" + issue.storyPoint + " ("
							+ loggedStoryPoint + ")</th>";
				} else {
					retval += "<th class=\"text-warning\">" + issue.storyPoint
							+ " (" + loggedStoryPoint + ")</th>";
				}
			} else {
				retval += "<th>" + issue.storyPoint + "</th>";
			}

			// Logged Time / Estimated Time
			retval += "<th>" + loggedTime + " / " + estimatedTime + "</th>";
			retval += "<th>";

			var issueLabels = issue.labels;
			if (issueLabels.indexOf("BugStaging") >= 0) {
				retval += "<span class=\"label\">S</span> ";
			}
			if (issueLabels.indexOf("BugProduction") >= 0) {
				retval += "<span class=\"label\">P</span> ";
			}
			if (issueLabels.indexOf("BugPresentation") >= 0) {
				retval += "<span class=\"label label-info\">ui</span> ";
			}
			if (issueLabels.indexOf("BugApplication") >= 0) {
				retval += "<span class=\"label label-info\">app</span> ";
			}
			if (issueLabels.indexOf("BugData") >= 0) {
				retval += "<span class=\"label label-info\">data</span> ";
			}
			if (issueLabels.indexOf("NotaBug") >= 0) {
				retval += "<span class=\"label label-important\">N/B</span> ";
			}
			if (issueLabels.indexOf("NoFunction") >= 0) {
				retval += "<span class=\"label label-important\">N/F</span> ";
			}
			if (issueLabels.indexOf("FaultMigration") >= 0) {
				retval += "<span class=\"label label-important\">F/M</span> ";
			}
			if (issueLabels.indexOf("FaultOperation") >= 0) {
				retval += "<span class=\"label label-important\">F/O</span> ";
			}

			retval += "</th>";

			return retval;
		}
	}
	
	function getPrioritySequence(issue) {
		var type = issue.fields.issuetype.name;
		var priority = "";
		if (type == "Sub-task") {
			priority = issue.fields.parent.fields.priority.name;
		} else {
			priority = issue.fields.priority.name;
		}
		
		if (priority == "Immediate") {
			return 0;
		} else if (priority == "High") {
			return 1;
		} else if (priority == "Normal") {
			return 2;
		} else if (priority == "Low") {
			return 3;
		} else {
			return 4;
		}
	}
	
	function getTypeSequence(issue) {
		var type = issue.fields.issuetype.name;
		if (type == "Story" || type == "Sub-task") {
			return 0;
		} else if (type == "Task") {
			return 1;
		} else if (type == "Improvement") {
			return 2;
		} else {
			return 3;
		}
	}

	function isDefined(str) {
		if (typeof (str) != "undefined" && str != null) {
			return true;
		}
		return false;
	}

	function roundNumber(number, digits) {
		var multiple = Math.pow(10, digits);
		var rndedNum = Math.round(number * multiple) / multiple;
		return rndedNum;
	}
}