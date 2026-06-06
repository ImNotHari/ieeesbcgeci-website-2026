// backend/controllers/fileController.js
const supabase = require('../db/supabaseClient')

const uploadEventFile = async (req, res, next) => {
  try {
    const { id: eventId } = req.params
    const { file_type }   = req.body
    const file            = req.file 

    if (!file) {
      const e = new Error('No file provided.'); e.statusCode = 400; throw e;
    }

    if (!['poster', 'photo', 'proceedings', 'press', 'report_pdf', 'other'].includes(file_type)) {
      const e = new Error('Invalid file_type. Must be one of: poster, photo, proceedings, press, report_pdf, other.'); e.statusCode = 400; throw e;
    }

    const userId = req.user.id

    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('created_by')
      .eq('id', eventId)
      .single()

    if (eventError || !event) {
      const e = new Error('Event not found.'); e.statusCode = 404; throw e;
    }

    if (event.created_by !== userId) {
      const e = new Error('You can only upload files to events you created.'); e.statusCode = 403; throw e;
    }

    const bucket = file_type === 'report_pdf' ? 'event-reports' : 'event-media'
    const uniqueName = `${eventId}/${Date.now()}_${file.originalname}`

    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from(bucket)
      .upload(uniqueName, file.buffer)

    if (uploadError) throw uploadError

    let fileUrl
    if (bucket === 'event-media') {
      fileUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/event-media/${uniqueName}`
    } else {
      const { data: signedUrl } = await supabase
        .storage
        .from(bucket)
        .createSignedUrl(uniqueName, 86400) 

      fileUrl = signedUrl?.signedUrl || uploadData.path
    }

    const { data: fileRecord, error: dbError } = await supabase
      .from('event_files')
      .insert({
        event_id:   eventId,
        file_type,
        file_url:   fileUrl,
        file_name:  file.originalname,
        uploaded_by: userId
      })
      .select()
      .single()

    if (dbError) {
      await supabase.storage.from(bucket).remove([uniqueName])
      throw dbError
    }

    return res.status(201).json({
      success: true,
      data:    fileRecord,
      message: 'File uploaded successfully.'
    })
  } catch (err) {
    next(err)
  }
}

const deleteEventFile = async (req, res, next) => {
  try {
    const { id: eventId, fileId } = req.params
    const userId = req.user.id

    const { data: file, error: fileError } = await supabase
      .from('event_files')
      .select('file_url, file_type')
      .eq('id', fileId)
      .eq('event_id', eventId)
      .single()

    if (fileError || !file) {
      const e = new Error('File not found.'); e.statusCode = 404; throw e;
    }

    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('created_by')
      .eq('id', eventId)
      .single()

    if (event.created_by !== userId) {
      const e = new Error('You can only delete files from events you created.'); e.statusCode = 403; throw e;
    }

    const bucket = file.file_type === 'report_pdf' ? 'event-reports' : 'event-media'
    const filePath = file.file_url.split(`/${bucket}/`)[1]

    const { error: storageError } = await supabase
      .storage
      .from(bucket)
      .remove([filePath])

    if (storageError) throw storageError

    const { error: dbError } = await supabase
      .from('event_files')
      .delete()
      .eq('id', fileId)

    if (dbError) throw dbError

    return res.status(200).json({ success: true, data: null, message: 'File deleted.' })
  } catch (err) {
    next(err)
  }
}

module.exports = { uploadEventFile, deleteEventFile }
