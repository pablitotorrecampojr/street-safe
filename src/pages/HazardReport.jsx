import React from 'react';
import { LoadingScreen } from '@webview';
import { Aside, NavBar } from '@components';
 
export default function HazardReport() {
  const [loading, setLoading] = React.useState(true);
  return( 
    <div className='layout-wrapper layout-content-navbar'>
      <div className='layout-container'>
        <Aside />
        <div className='layout-page'>
          <NavBar />
          <div className='content-wrapper'>
            <div className='container-xxl flex-grow-1 container-p-y'>
              <div className='row mb-4 p-1'>
                <h1 style={{ fontSize: '20px' }} className='fw-bold'>Hazard Report</h1>
              </div>

              <div className='card'>
                <div className='card-body'>
                  {loading ? <LoadingScreen /> : <div>Content Loaded</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}