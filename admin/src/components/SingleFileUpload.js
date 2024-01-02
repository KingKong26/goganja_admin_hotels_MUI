import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { storage } from '../firebase-config'
import StringGenerator from './StringGenerator'

export const SingleFileUpload = async (imageAsFile) => {
  try {
    const imgExtenstion = imageAsFile.type.split('/')[1]
    const imgName = `${StringGenerator()}.${imgExtenstion}`

    const storageRef = ref(storage, `/hotel_images/${imgName}`)
    const uploadTask = uploadBytesResumable(storageRef, imageAsFile)

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        null,
        error => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then(async downloadURL => {
              resolve(downloadURL)
            })
            .catch(error => reject(error))
        }
      )
    })

    // Additional logic after upload completes
  } catch (error) {
    console.error('Error uploading files', error)
  }
}
