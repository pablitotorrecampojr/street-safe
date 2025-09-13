const colors = {
    success: "bg-green-100 text-green-800",
    info: "bg-blue-100 text-blue-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
}
export default function HazardsView({ icon, color, status, total }) {
    return (
        <div className="card">
            <div className="card-body flex justify-center items-center">
                <div
                    className={`p-2 flex items-center justify-center rounded-full ${colors[color]}`}
                >
                <i className={`${icon} text-2xl`}></i>
                </div>
                <div className="ms-3">
                    <h1 className="fw-semibold d-block mb-1">{status}</h1>
                    <h3 className="card-title mb-2">{total}</h3>
                </div>
            </div>
        </div>
    )
}