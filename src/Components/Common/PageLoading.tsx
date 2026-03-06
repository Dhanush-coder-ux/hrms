
import { Loader2 } from 'lucide-react';
const PageLoading = () => {
  return (
    <div className="h-96 flex flex-col items-center justify-center text-gray-400 gap-3">
      <Loader2 className="animate-spin text-blue-600" size={32} />
      <p className="text-sm font-medium">Syncing directory...</p>
    </div>
  )
}

export default PageLoading
