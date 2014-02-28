function issueSummary(issueKey, issueParentKey, issueUrl, issueName, issueType, issuePriority,
		issueStatus, issueStoryPoint, issueEstimate, issueLogged,
		issueAssignee, issueLabels, issueCreated, issueUpdated) {
	
	return {
		key : issueKey,
		parentKey : issueParentKey,
		url : issueUrl,
		name : issueName,
		type : issueType,
		priority : issuePriority,
		status : issueStatus,
		storyPoint : (issueStoryPoint == null) ? 0 : issueStoryPoint,
		estimate : (issueEstimate == null) ? 0 : issueEstimate,
		logged : (issueLogged == null) ? 0 : issueLogged,
		assignee : (issueAssignee == null) ? "-" : issueAssignee.displayName,
		labels : issueLabels,
		created : issueCreated, 
		updated : issueUpdated,
		isOpen: function() {
			return (this.status == "Open" || this.status == "Reopened") ? true : false;
		},
		isInProgress: function() {
			return (this.status == "In Progress") ? true : false;
		},
		isResolved: function() {
			return (this.status == "Resolved" || this.status == "Closed") ? true : false;
		},
		isTriageIssue: function() {
			return (issueName.indexOf("[Triage]") === 0) ? true : false;
		},
		isOperationIssue: function() {
			return (issueName.indexOf("[운영]") === 0) ? true : false;
		},
		isBugIssue: function() {
			return (this.type == "Bug" && !this.isOperationIssue() && !this.isTriageIssue()) ? true : false;
		},
		isSprintIssue: function() {
			return (!this.isBugIssue() && !this.isOperationIssue() && !this.isTriageIssue()) ? true : false;
		},
		isLastUpdated: function() {
			var yesterday = (function(){this.setDate(this.getDate()-1); this.setHours(0); this.setMinutes(0); this.setSeconds(0); this.setMilliseconds(0); return this}).call(new Date());
			console.log(yesterday.toString());
			var updateday = new Date(Date.parse(this.updated));
			console.log(updateday.toString());
			
			return +yesterday < +updateday;
		}
	}
}