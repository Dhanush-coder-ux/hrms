
interface BackButtonProps {

  ClickToAction: () => void;
}

export const Backbutton :  React.FC<BackButtonProps>= ({ClickToAction}) => {
  return (
    <button onClick={ClickToAction} className="group mb-6 flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">
    <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span> Back to list
</button>
  )
}

