import {Aside, NavBar, UsersOverview, HazardsOverview, HazardsChartOverview } from '@components';

const Dashboard = () => {
  const handleNavbarToggle = () => { 
    const htmlElement = document.getElementById("main-html");
    if (htmlElement) {
        htmlElement.classList.remove("light-style", "layout-menu-fixed", "layout-menu-expanded");
    }
  }

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
          <Aside />
          <div className="layout-page">
            <NavBar />
            <div className='content-wrapper'>
              <div className='container-xxl flex-grow-1 container-p-y'>
                <div className='row'>
                  <div className="col-md-3 mb-4">
                    <h1 style={{ fontSize: '20px' }} className='fw-bold'>Dashboard</h1>
                  </div>
                </div>

                <div className='w-full flex flex-row gap-2 mb-4'>
                  <UsersOverview />

                  <HazardsOverview />
                </div>

                <div className='w-full'>
                  <HazardsChartOverview />
                </div>

              </div>
            </div>
          </div>
      </div>
      <div className="layout-overlay layout-menu-toggle" onClick={handleNavbarToggle}></div>
    </div>
  );
};

export default Dashboard;
