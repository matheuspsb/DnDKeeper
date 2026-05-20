import type { Letter } from '../../../types/letter'
import { useLetterForm } from '../../../hooks/useLetterForm'
import { labelClass } from '../../../styles/form'
import Input from '../../atoms/Input'
import Button from '../../atoms/Button'
import XIcon from '../../atoms/icons/XIcon'

interface LetterModalProps {
  initialLetter: Letter | null
  onSave: (data: Omit<Letter, 'id'>) => void
  onClose: () => void
}

const fieldClass = 'w-full bg-black-500 rounded-lg px-3 py-2'
const textareaClass = `${fieldClass} border border-black-100 text-white-100 text-sm placeholder:text-white-300/30 focus:outline-none focus:border-red-100 transition-colors resize-none`
const errorClass = 'text-red-100 text-xs mt-1'

function LetterModal({ initialLetter, onSave, onClose }: LetterModalProps) {
  const { register, handleSubmit, errors } = useLetterForm(initialLetter, onSave)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-black-400 border border-black-100 rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-black-100">
          <h2 className="text-white-100 font-semibold text-lg">
            {initialLetter ? 'Editar Carta' : 'Nova Carta'}
          </h2>
          <button onClick={onClose} className="text-white-300 hover:text-white-100 transition-colors">
            <XIcon size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <div>
            <label className={labelClass}>Título *</label>
            <Input
              {...register('title')}
              error={!!errors.title}
              className={fieldClass}
              placeholder="Carta do Rei Thalos"
            />
            {errors.title && <p className={errorClass}>{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Destinatário</label>
              <Input
                {...register('recipient')}
                className={fieldClass}
                placeholder="Aventureiros da Taverna do Grifo"
              />
            </div>
            <div>
              <label className={labelClass}>Data de encontro *</label>
              <Input
                {...register('foundAt')}
                error={!!errors.foundAt}
                className={fieldClass}
                placeholder="26/04/1372"
              />
              {errors.foundAt && <p className={errorClass}>{errors.foundAt.message}</p>}
            </div>
          </div>

          <div>
            <label className={labelClass}>Conteúdo *</label>
            <textarea
              {...register('content')}
              className={`${textareaClass} h-52`}
              placeholder="Estimados aventureiros..."
            />
            {errors.content && <p className={errorClass}>{errors.content.message}</p>}
          </div>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input type="checkbox" {...register('shown')} className="w-4 h-4 accent-red-100" />
            <span className="text-white-200 text-sm">Já revelada aos jogadores</span>
          </label>

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="secondary" onClick={onClose} className="w-auto! flex-1">
              Cancelar
            </Button>
            <Button type="submit" variant="primary" className="w-auto! flex-1">
              {initialLetter ? 'Salvar Alterações' : 'Adicionar Carta'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LetterModal
