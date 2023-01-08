import { IUploadImage } from '@interfaces/upload-image.interface'
import { baseApi } from './baseApi'

export const mediaApi = baseApi.injectEndpoints({
  endpoints: build => ({
    adminUploadImage: build.mutation<{ url: string }, { data: IUploadImage }>({
      query: ({ data: { image, id, folder } }) => ({
        url: '/media/upload/icon/admin',
        method: 'POST',
        params: {
          id,
          folder,
        },
        body: image,
      }),
    }),

    uploadImage: build.mutation<{ url: string }, { data: IUploadImage }>({
      query: ({ data: { image, id, folder } }) => ({
        url: 'media/upload/image',
        method: 'POST',
        params: {
          id,
          folder,
        },
        body: image,
      }),
    }),
  }),
})

export const { useUploadImageMutation, useAdminUploadImageMutation } = mediaApi
