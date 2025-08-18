import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}