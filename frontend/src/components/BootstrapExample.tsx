import React, { useState } from 'react';

const BootstrapExample: React.FC = () => {
  const [alertVisible, setAlertVisible] = useState(false);
  
  const handleButtonClick = () => {
    setAlertVisible(true);
    setTimeout(() => setAlertVisible(false), 3000);
  };

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-12">
          <h1 className="display-4 text-center mb-4">Bootstrap Integration Example</h1>
          <p className="lead text-center mb-5">
            This demonstrates Bootstrap components working alongside your existing Tailwind styling.
          </p>
        </div>
      </div>

      {/* Alert Example */}
      {alertVisible && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <strong>Success!</strong> Bootstrap components are working perfectly!
              <button 
                type="button" 
                className="btn-close" 
                aria-label="Close"
                onClick={() => setAlertVisible(false)}
              ></button>
            </div>
          </div>
        </div>
      )}

      {/* Button Examples */}
      <div className="row mb-5">
        <div className="col-md-6">
          <h3>Bootstrap Buttons</h3>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <button type="button" className="btn btn-primary" onClick={handleButtonClick}>
              Primary
            </button>
            <button type="button" className="btn btn-secondary">
              Secondary
            </button>
            <button type="button" className="btn btn-success">
              Success
            </button>
            <button type="button" className="btn btn-warning">
              Warning
            </button>
            <button type="button" className="btn btn-danger">
              Danger
            </button>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <button type="button" className="btn btn-outline-primary">
              Outline Primary
            </button>
            <button type="button" className="btn btn-outline-secondary">
              Outline Secondary
            </button>
          </div>
        </div>
        
        <div className="col-md-6">
          <h3>Bootstrap Form</h3>
          <form>
            <div className="mb-3">
              <label htmlFor="emailInput" className="form-label">Email address</label>
              <input type="email" className="form-control" id="emailInput" placeholder="name@example.com" />
            </div>
            <div className="mb-3">
              <label htmlFor="selectExample" className="form-label">Example select</label>
              <select className="form-select" id="selectExample">
                <option>Choose option...</option>
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
                <option value="3">Option 3</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="textareaExample" className="form-label">Example textarea</label>
              <textarea className="form-control" id="textareaExample" rows={3}></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>

      {/* Card Examples */}
      <div className="row mb-5">
        <div className="col-12">
          <h3 className="mb-4">Bootstrap Cards</h3>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card">
            <img src="https://via.placeholder.com/300x200" className="card-img-top" alt="Placeholder" />
            <div className="card-body">
              <h5 className="card-title">Card title</h5>
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="#" className="btn btn-primary">Go somewhere</a>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Special title treatment</h5>
              <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
              <a href="#" className="btn btn-outline-primary">Go somewhere</a>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-bg-dark">
            <img src="https://via.placeholder.com/300x200/333/fff" className="card-img" alt="Dark placeholder" />
            <div className="card-img-overlay">
              <h5 className="card-title">Card title</h5>
              <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content.</p>
              <p className="card-text"><small>Last updated 3 mins ago</small></p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Example */}
      <div className="row mb-5">
        <div className="col-12">
          <h3 className="mb-3">Bootstrap Modal</h3>
          <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Launch Demo Modal
          </button>

          <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">Bootstrap Modal</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  This is a Bootstrap modal working perfectly with your React application!
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-primary">Save changes</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Example */}
      <div className="row">
        <div className="col-12">
          <h3 className="mb-3">Bootstrap Navigation</h3>
          <nav className="navbar navbar-expand-lg navbar-light bg-light rounded">
            <div className="container-fluid">
              <a className="navbar-brand" href="#">Navbar</a>
              <button 
                className="navbar-toggler" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#navbarNav" 
                aria-controls="navbarNav" 
                aria-expanded="false" 
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="#">Home</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">Features</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">Pricing</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link disabled">Disabled</a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default BootstrapExample;
