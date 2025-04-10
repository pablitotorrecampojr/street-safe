import { useLocation } from 'react-router-dom';

export default function LoadingScreen() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const loadingText = params.get("loadingText") || "Loading...";

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <div className="layout-page">
          <div>
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh", flexDirection: "column" }}>
              <div className="demo-inline-spacing">
                <div
                  className="spinner-border text-primary"
                  role="status"
                  style={{
                    width: "10rem",
                    height: "10rem",
                    borderWidth: "0.5rem"
                  }}
                >
                  <span className="visually-hidden">{loadingText}</span>
                </div>
                <div style={{ marginTop: "1rem", fontSize: "1.2rem", fontWeight: "500", textAlign: "center" }}>
                  {loadingText}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
