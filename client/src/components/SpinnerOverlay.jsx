import Spinner from "./Spinner";

const SpinnerOverlay = ({
  show,
  text = "Loading...",
  size = "lg",
  color = "white",
}) => {
  if (!show) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 pointer-events-auto'>
      <div className='flex flex-col items-center gap-4'>
        <Spinner size={size} color={color} />
        {text && <p className='text-white text-sm select-none'>{text}</p>}
      </div>
    </div>
  );
};

export default SpinnerOverlay;
