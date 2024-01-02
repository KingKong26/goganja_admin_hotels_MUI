import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { storage } from '../firebase-config'
import StringGenerator from './StringGenerator'

export const MultiImageUpload = async (imageAsFile) => {
  try {
    const uploadPromises = imageAsFile.map(file => {
      const imgExtenstion = file.type.split('/')[1]
      const imgName = `${StringGenerator()}.${imgExtenstion}`

      const storageRef = ref(storage, `/hotel_images/${imgName}`)
      const uploadTask = uploadBytesResumable(storageRef, file)

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
    })

    const uploadedUrls = await Promise.all(uploadPromises)

    return uploadedUrls

    // Additional logic after upload completes
  } catch (error) {
    console.error('Error uploading files', error)
  }
}
