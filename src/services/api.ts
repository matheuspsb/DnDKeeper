import axios from 'axios'

const api = axios.create({
  baseURL: 'https://www.googleapis.com/drive/v3',
  params: {
    key: import.meta.env.VITE_GOOGLE_API_KEY as string,
  },
})

export default api
