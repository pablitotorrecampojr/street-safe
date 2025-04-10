import { useLocation } from 'react-router-dom';
import { db } from '../firebase/firebase';

export default function HazardFragment() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const userId = params.get("userId") || "null";

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <div className="layout-page">
            <div className="content-wrapper">
                <div className="container-xxl flex-grow-1 container-p-y">
                    <div className="row">
                        <div className="col-md-3 mb-4 mb-md-0">
                            <h1 className="text-center fw-bold">Hazards</h1>
                            <div className="accordion mt-3" id="accordionExample">
                                {[...Array(20)].map((_, index) => {
                                    const headingId = `heading${index}`;
                                    const collapseId = `collapse${index}`;
                                    return (
                                        <div className="card accordion-item" key={index}>
                                        <h2 className="accordion-header" id={headingId}>
                                            <button
                                            type="button"
                                            className="accordion-button"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#${collapseId}`}
                                            aria-expanded="false"
                                            aria-controls={collapseId}
                                            >
                                            Accordion Item {index + 1}
                                            </button>
                                        </h2>

                                        <div
                                            id={collapseId}
                                            className="accordion-collapse collapse"
                                            data-bs-parent="#accordionExample"
                                        >
                                            <div className="accordion-body">
                                            Lemon drops chocolate cake gummies carrot cake chupa chups muffin topping. Sesame snaps icing
                                            marzipan gummi bears macaroon dragée danish caramels powder. Bear claw dragée pastry topping
                                            soufflé. Wafer gummi bears marshmallow pastry pie.
                                            </div>
                                        </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
