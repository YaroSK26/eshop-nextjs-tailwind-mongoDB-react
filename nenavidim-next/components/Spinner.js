import { BeatLoader } from "react-spinners";

export default function Spinner({fullWidth}) {
  if (fullWidth) {
    return (
      <div className="w-full flex justify-center ">
        <BeatLoader color={"#1E3a8a"}></BeatLoader>
      </div>
    );
  }
  return <BeatLoader color={"#1E3a8a"} speedMultiplier={2} />;
}
