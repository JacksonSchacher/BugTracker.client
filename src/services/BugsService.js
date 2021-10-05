import { AppState } from '../AppState'
import { Bug } from '../models/Bug'
import { TrackedBug } from '../models/TrackedBug'
import { logger } from '../utils/Logger'
import { api } from './AxiosService'

class BugsService {
  async getBugs() {
    const res = await api.get('api/bugs')
    AppState.bugs = res.data.map(b => new Bug(b))
  }

  async getTrackedBugs() {
    const res = await api.get('account/trackedbugs')
    AppState.trackedBugs = res.data.map(b => new TrackedBug(b))
  }

  async setCurrentBug(bugId) {
    const res = await api.get(`api/bugs/${bugId}`)
    AppState.currentBug = new Bug(res.data)
  }

  async openClosed(bugId) {
    const res = await api.delete(`api/bugs/${bugId}`)
    AppState.currentBug = new Bug(res.data)
  }

  async createBug(bugData) {
    const res = await api.post('api/bugs', bugData)
    AppState.bugs = [...AppState.bugs, new Bug(res.data)]
    AppState.currentBug = new Bug(res.data)
  }

  async toggleTracked(bugId) {
    const bug = AppState.bugs.find(b => b.id === bugId)
    logger.log('Appstate found bug before conditional', bug)
    if (bug.tracked) {
      bug.tracked = false
      logger.log('Toggle Tracked DELETE', bug)
      const trackedbug = AppState.trackedBugs.find(b => b.bug.id === bugId)
      await api.delete(`api/trackedbugs/${trackedbug.id}`)
      this.getTrackedBugs()
    } else {
      bug.tracked = true
      logger.log('Toggle Tracked (tracked = true)', bug)
      bug.accountId = AppState.account.id
      bug.bugId = bug.id
      const res = await api.post('api/trackedbugs', bug)
      AppState.trackedBugs = [...AppState.trackedBugs, new TrackedBug(res.data)]
      logger.log('Tracked Bugs Array', AppState.trackedBugs)
    }
  }

  async getTracked(bugId) {
    const res = await api.get(`api/bugs/${bugId}/trackedbugs`)
    AppState.tracked = res.data.map(t => new TrackedBug(t))
  }

  async editBug(bugId, bugData) {
    const res = await api.put(`api/bugs/${bugId}`, bugData)
    const foundIndex = AppState.bugs.findIndex(b => b.id === bugId)
    AppState.bugs = AppState.bugs.splice(foundIndex, 1, new Bug(res.data))
  }
}
export const bugsService = new BugsService()
