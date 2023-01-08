import { Theme, toast, Zoom } from 'react-toastify'

export const toastContainerConfig = {
  position: toast.POSITION.TOP_CENTER,
  autoClose: 5000,
  limit: 2,
  hideProgressBar: false,
  newestOnTop: true,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
  theme: 'colored' as Theme,
  transition: Zoom,
}
