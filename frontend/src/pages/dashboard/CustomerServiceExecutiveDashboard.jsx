export default function CustomerServiceExecutiveDashboard() {
  return (
    <div className="container-fluid">
      <div className="row g-3">
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="fw-semibold">Today Bookings</div>
              <div className="display-6">0</div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="fw-semibold">Revenue</div>
              <div className="display-6">$0</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}