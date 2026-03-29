import react from 'react';
export default function PageNotFound() {
  return (

    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
      <div className="demo-inline-spacing">
          <div className="container-xxl container-p-y">
              <div className="misc-wrapper">
                  <h2 className="mb-4 mx-2 text-center" style={{fontSize: '25px'}}>Page Not Found :(</h2>
                  <p className="text-center mb-4">Oops! 😖 The requested URL was not found on this server.</p>
                  <p className="text-center"><a href="/" className="btn btn-primary">Back to home</a></p>
                  <div className="mt-3">
              <img
                  src="./illustrations/page-misc-error-light.png"
                  alt="page-misc-error-light"
                  className="img-fluid"
                  width={"500"}
                  data-app-dark-img="illustrations/page-misc-error-dark.png"
                  data-app-light-img="illustrations/page-misc-error-light.png"
                />
              </div>
              </div>
          </div>
      </div>
    </div>

  );
}