import Image from "next/image";
import loader from "@/assets/loader.gif";

const LoadingPage = () => {
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <Image src={loader} height={150} width={150} alt="Loading..." unoptimized />
    </div>
  );
};

export default LoadingPage;
