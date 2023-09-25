import Image from "next/image";

function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-80">
      <div className="flex space-x-2 animate-pulse">
        <Image
          alt="necc-logo"
          src="/logos/necc-blue.svg"
          width={100}
          height={100}
        />
      </div>
    </div>
  );
}
export default Loader;