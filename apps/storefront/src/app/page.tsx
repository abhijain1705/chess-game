import Chess from "../chess/chess";

export const metadata = {
  title: "Chess Game",
};

export default function Store(): JSX.Element {
  return (
    <div>
        <Chess />
    </div>
  );
}
