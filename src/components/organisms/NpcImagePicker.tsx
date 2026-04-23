import type { UseFormRegisterReturn } from 'react-hook-form'
import { LOCAL_ARTS, resolveImageUrl, toLocalArtUrl } from '../../constants/arts'

const inputClass = `
  w-full bg-black-500 border border-black-100 rounded-lg px-3 py-2
  text-white-100 text-sm placeholder:text-white-300/30
  focus:outline-none focus:border-red-100 transition-colors
`
const labelClass = 'block text-white-300 text-xs font-medium mb-1.5'

interface NpcImagePickerProps {
  imageUrl: string
  onSelect: (url: string) => void
  registration: UseFormRegisterReturn
}

function NpcImagePicker({ imageUrl, onSelect, registration }: NpcImagePickerProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className={labelClass}>Imagem</label>
      <div className="flex gap-2 flex-wrap">
        {LOCAL_ARTS.map(art => {
          const artKey = toLocalArtUrl(art.key)
          return (
            <button
              key={art.key}
              type="button"
              onClick={() => onSelect(artKey)}
              className={`w-14 h-18 rounded-lg overflow-hidden border-2 shrink-0 transition-colors ${imageUrl === artKey ? 'border-red-100' : 'border-black-100 hover:border-white-300/40'}`}
            >
              <img src={art.url} alt={art.name} className="w-full h-full object-cover" />
            </button>
          )
        })}
        {imageUrl && !LOCAL_ARTS.some(a => toLocalArtUrl(a.key) === imageUrl) && (
          <div className="w-14 h-18 rounded-lg overflow-hidden border-2 border-red-100 shrink-0">
            <img
              src={resolveImageUrl(imageUrl)}
              alt="preview"
              className="w-full h-full object-cover"
              onError={e => { e.currentTarget.style.display = 'none' }}
            />
          </div>
        )}
      </div>
      <input
        {...registration}
        className={inputClass}
        placeholder="ou cole uma URL externa..."
      />
    </div>
  )
}

export default NpcImagePicker
