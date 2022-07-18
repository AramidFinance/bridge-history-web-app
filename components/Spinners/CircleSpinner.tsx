interface CircleSpinnerProps {
  className: string;
}
export const CircleSpinner = (props: CircleSpinnerProps) => {
  return (
    <>
      <svg className={`m-auto animate-spin 3xl:hidden ml-3 mr-6 h-8 w-8 text-white ${props.className ? props.className : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <svg
        className={`m-auto animate-spin hidden 3xl:block 4xl:hidden ml-5 mr-8 h-12 w-12 text-white ${props.className ? props.className : ''}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 36 36"
      >
        <circle className="opacity-25 scale-[1.5]" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75 scale-[1.5]" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <svg
        className={`m-auto animate-spin hidden 4xl:block ml-8 mr-14 h-16 w-16 text-white ${props.className ? props.className : ''}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 48 48"
      >
        <circle className="opacity-25 scale-[2]" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75 scale-[2]" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </>
  );
};
