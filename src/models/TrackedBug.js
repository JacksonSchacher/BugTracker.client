export class TrackedBug {
  constructor(trackedBugData = {}) {
    this.id = trackedBugData.id
    this.bug = trackedBugData.bug
    this.tracker = trackedBugData.tracker
  }
}
