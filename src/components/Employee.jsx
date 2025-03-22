import { useParams, useNavigate } from "react-router-dom";
import { teamMembers } from "../data/teamMembers";
import "./Employee.css";

function Employee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const employee = teamMembers.find((member) => member.id === id);

  if (!employee) return null;

  return (
    <div className="employee-overlay">
      <div className="employee-content">
        <button className="close-button" onClick={() => navigate("/")}>
          ×
        </button>
        <h2>{employee.name}</h2>
        <p>{employee.designation}</p>
        <div className="employee-image">
          <img src={employee.url} alt={employee.name} />
        </div>
        {/* Add more employee details as needed */}
      </div>
    </div>
  );
}

export default Employee;
