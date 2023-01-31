import { useAdminUploadImageMutation } from '@api/media.api'
import { useAdminUpdateRepairCardMutation } from '@api/repairCard.api'
import {
	RepairCardsGetResponse,
	IRepairCardCreate,
} from '@interfaces/repair-card'
import customToast from '@utils/customToast'
import { useCallback } from 'react'

export const useUpdateCard = (
	cardData: RepairCardsGetResponse | undefined,
	icon: File | undefined,
	refetch: () => void,
	repairCardModelRefetch: () => void
) => {
	const [updateCard] = useAdminUpdateRepairCardMutation()
	const [uploadIcon] = useAdminUploadImageMutation()

	const result = useCallback(
		(repairCard: IRepairCardCreate) => {
			if (!cardData) return

			updateCard({ ...repairCard, id: cardData.id })
				.unwrap()
				.then(response => {
					customToast.success(response.message)

					if (icon) {
						const iconPath = new FormData()
						iconPath.append('image', icon, icon?.name)

						uploadIcon({
							data: { image: iconPath, folder: 'icon', id: cardData.id },
						}).then(() => {
							refetch()
							repairCardModelRefetch()
						})
					}
				})
		},
		[cardData, icon, refetch, repairCardModelRefetch]
	)

	return result
}
