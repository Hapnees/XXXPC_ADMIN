import { useAdminUploadImageMutation } from '@api/media.api'
import {
  useAdminCreateRepairCardMutation,
  useAdminUpdateRepairCardMutation,
} from '@api/repairCard.api'
import { IRepairCardCreate } from '@interfaces/repair-card'
import customToast from '@utils/customToast'
import { useCallback } from 'react'

export const useCreateCard = (icon: File | undefined) => {
  const [createCard] = useAdminCreateRepairCardMutation()
  const [updateCard] = useAdminUpdateRepairCardMutation()
  const [uploadIcon] = useAdminUploadImageMutation()

  const result = useCallback(
    (repairCard: IRepairCardCreate) => {
      if (!icon) {
        customToast.error('Отсутствует иконка')
        return
      }

      delete repairCard.menuDeletedIds
      delete repairCard.paragraphDeletedIds

      createCard(repairCard)
        .unwrap()
        .then(response => {
          customToast.success(response.message)
          const iconPath = new FormData()
          iconPath.append('image', icon, icon?.name)

          uploadIcon({
            data: { image: iconPath, folder: 'icon', id: response.cardId },
          })
            .unwrap()
            .then(responseUpload =>
              updateCard({ id: response.cardId, iconPath: responseUpload.url })
            )
        })
    },
    [icon, createCard]
  )

  return result
}
