import { Spinner } from "react-bootstrap";
export default function Loading() {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "40vh" }}>
      <Spinner animation="border" />
    </div>
  );
}