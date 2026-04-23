import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import Layout from "../components/layout";
import { SearchContext } from "../context/SearchContext.jsx";


function Applications() {
  const [applications, setApplications] = useState([]);

  // Add Modal State
  const [showModal, setShowModal] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [resume, setResume] = useState(null);
  const [appliedDate, setAppliedDate] = useState("");
  const [jobLink, setJobLink] = useState("");

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [editCompany, setEditCompany] = useState("");
  const [editRole, setEditRole] = useState("");

  const [editStatus, setEditStatus] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { searchQuery } = useContext(SearchContext);

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      fetchApplications();
    }
  }, [user]);

  useEffect(() => {
    document.title = "Application | Job Tracker";
}, []);

  const fetchApplications = async () => {
    try {
      const { data } = await API.get("/applications");
      setApplications(data);
    } catch (error) {
      console.log(error);
    }
  };

  // Add Application
  const handleAddApplication = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("companyName", companyName);
      formData.append("role", role);
      formData.append("appliedDate", appliedDate);
      formData.append("jobLink", jobLink);
      formData.append("resume", resume);

      await API.post("/applications", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setCompanyName("");
      setRole("");
      setResume(null);
      setAppliedDate("");
      setJobLink("");
      setShowModal(false);
      fetchApplications();
    } catch (error) {
      console.log(error);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    try {
      await API.delete(`/applications/${id}`);
      fetchApplications();
    } catch (error) {
      console.log(error);
    }
  };

  // Open Edit Modal
  const handleEditClick = (app) => {
    setCurrentEditId(app._id);
    setEditCompany(app.companyName);
    setEditRole(app.role);
    setEditStatus(app.status);
    setEditModalOpen(true);
  };

  // Update Application
  const handleUpdate = async () => {
    try {
      await API.put(`/applications/${currentEditId}`, {
        companyName: editCompany,
        role: editRole,
        status: editStatus,
      });

      setEditModalOpen(false);
      fetchApplications();
    } catch (error) {
      console.log(error);
    }
  };

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const modalStyle = {
    background: "white",
    padding: "30px",
    borderRadius: "10px",
    minWidth: "300px",
  };

  return (
    <Layout>
        <>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Applications</h2>

            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              + Add Application
            </button>
          </div>

          {/* Add Modal */}
          {showModal && (
            <div style={overlayStyle}>
              <div style={modalStyle}>
                <h3>Add Application</h3>

                <form onSubmit={handleAddApplication}>

              <input
                placeholder="Company Name"
                className="w-full border px-3 py-2 mb-3"
                value={companyName}
                onChange={(e)=>setCompanyName(e.target.value)}
                required
              />

              <input
                placeholder="Role"
                className="w-full border px-3 py-2 mb-3"
                value={role}
                onChange={(e)=>setRole(e.target.value)}
                required
              />

              <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResume(e.target.files[0])}
                  />
                  <br /><br />

              <input
                type="date"
                className="w-full border px-3 py-2 mb-3"
                value={appliedDate}
                onChange={(e)=>setAppliedDate(e.target.value)}
              />

              <input
                placeholder="Job Link"
                className="w-full border px-3 py-2 mb-4"
                value={jobLink}
                onChange={(e)=>setJobLink(e.target.value)}
              />

              <div className="flex justify-end gap-3">

                <button
                  type="button"
                  onClick={()=>setShowModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save
                </button>

              </div>

            </form>
              </div>
            </div>
          )}

          {/* Edit Modal */}
          {editModalOpen && (
            <div style={overlayStyle}>
              <div style={modalStyle}>
                <h3>Edit Application</h3>

                <input
                  value={editCompany}
                  onChange={(e) => setEditCompany(e.target.value)}
                />
                <br /><br />

                <input
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                />
                <br /><br />

                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                >
                  <option>Applied</option>
                  <option>Interview</option>
                  <option>Offer</option>
                  <option>Rejected</option>
                </select>
                <br /><br />

                <button onClick={handleUpdate}>Save</button>
                <button onClick={() => setEditModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          {applications.length === 0 ? (
            <p>No applications yet.</p>
          ) : (
            <table className="w-full bg-white shadow rounded mt-6">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Company</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Applied Date</th>
                  <th className="p-3 text-left">Resume</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications
                  .filter(
                    (app) =>
                      app.companyName
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      app.role
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                  )
                  .map((app) => (
                    <tr key={app._id} className="border-t">
                      <td className="p-3">{app.companyName}</td>
                      <td className="p-3">{app.role}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-sm font-medium ${
                            app.status === "Applied"
                              ? "bg-blue-100 text-blue-600"
                              : app.status === "Interview"
                              ? "bg-yellow-100 text-yellow-600"
                              : app.status === "Offer"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="p-3">
                        {new Date(
                          app.appliedDate
                        ).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        {app.resume && (
                          <a
                            href={`http://localhost:5000${app.resume}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            Download
                          </a>
                        )}
                      </td>
                      <td className="p-3 space-x-2">
                        <button
                          onClick={() => handleEditClick(app)}
                          className="text-blue-500 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(app._id)}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </>
    </Layout>
  );
}

export default Applications;