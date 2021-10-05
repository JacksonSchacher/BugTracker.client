import { AppState } from '../AppState'
import { Note } from '../models/Note'
import { logger } from '../utils/Logger'
import { api } from './AxiosService'

class NotesService {
  async addNote(noteData) {
    const res = await api.post('api/notes', noteData)
    AppState.notes = [...AppState.notes, new Note(res.data)]
  }

  async getNotes() {
    const res = await api.get('api/notes')
    logger.log('Get All Notes', res)
    AppState.notes = res.data.map(n => new Note(n))
  }

  async deleteNote(noteId) {
    await api.delete(`api/notes/${noteId}`)
    AppState.notes.filter(n => n.id !== noteId)
    this.getNotes()
  }
}
export const notesService = new NotesService()
